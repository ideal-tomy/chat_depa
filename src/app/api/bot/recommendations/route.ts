import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { BotRecommendation } from '@/types';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const botId = searchParams.get('botId');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '6');
    const type = searchParams.get('type') || 'hybrid';

    if (!botId) {
      return NextResponse.json({ error: 'botId is required' }, { status: 400 });
    }

    const recommendations = await getBotRecommendations({
      botId,
      ...(userId && { userId }),
      limit,
      type: type as 'collaborative' | 'content_based' | 'hybrid'
    });

    return NextResponse.json({ recommendations });

  } catch (error) {
    logger.error('BOT_RECOMMENDATIONS_API_ERROR', new Error(String(error)));
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

async function getBotRecommendations({
  botId,
  userId,
  limit,
  type
}: {
  botId: string;
  userId?: string;
  limit: number;
  type: 'collaborative' | 'content_based' | 'hybrid';
}): Promise<BotRecommendation[]> {
  let recommendations: BotRecommendation[] = [];

  if (type === 'collaborative' || type === 'hybrid') {
    const collaborativeRecs = await getCollaborativeRecommendations(botId, limit);
    recommendations.push(...collaborativeRecs);
  }

  if (type === 'content_based' || type === 'hybrid') {
    const contentRecs = await getContentBasedRecommendations(botId, limit);
    recommendations.push(...contentRecs);
  }

  // 重複除去とスコア統合
  recommendations = mergeAndDeduplicateRecommendations(recommendations);
  
  // ユーザー固有の調整
  if (userId) {
    recommendations = await personalizeRecommendations(recommendations, userId);
  }

  return recommendations.slice(0, limit);
}

async function getCollaborativeRecommendations(botId: string, limit: number): Promise<BotRecommendation[]> {
  const supabase = supabaseServer;

  // このボットを使ったユーザーを取得
  const { data: users, error: usersError } = await supabase
    .from('bot_user_interactions')
    .select('user_id')
    .eq('bot_id', botId)
    .eq('interaction_type', 'start_chat');

  if (usersError || !users || users.length === 0) {
    return [];
  }

  const userIds = users.map(u => u.user_id);

  // 同じユーザーが使った他のボットを取得
  const { data: similarBots, error: similarError } = await supabase
    .from('bot_user_interactions')
    .select(`
      bot_id,
      bots (
        id,
        name,
        description,
        category,
        author,
        author_icon,
        image_url,
        points,
        created_at
      )
    `)
    .in('user_id', userIds)
    .neq('bot_id', botId)
    .eq('interaction_type', 'start_chat');

  if (similarError || !similarBots) {
    return [];
  }

  // ボットごとの利用回数を集計
  const botUsageCount: Record<string, { count: number; bot: any }> = {};
  similarBots.forEach(interaction => {
    const botId = interaction.bot_id;
    if (!botUsageCount[botId]) {
      botUsageCount[botId] = { count: 0, bot: interaction.bots };
    }
    botUsageCount[botId].count++;
  });

  // 利用回数順にソートして推薦を作成
  const sortedBots = Object.entries(botUsageCount)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, limit);

  return sortedBots.map(([botId, { count, bot }]) => ({
    id: `collab-${botId}`,
    source_bot_id: botId,
    recommended_bot_id: botId,
    recommendation_type: 'collaborative',
    similarity_score: Math.min(count / userIds.length, 1.0),
    confidence_score: Math.min(count / 10, 1.0),
    click_through_rate: 0.0,
    conversion_rate: 0.0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    bot: {
      ...bot,
      authorIcon: bot.author_icon,
      imageUrl: bot.image_url,
      costPoints: bot.points
    },
    reason: 'このボットを使った人は、こんなボットも使っています'
  }));
}

async function getContentBasedRecommendations(botId: string, limit: number): Promise<BotRecommendation[]> {
  const supabase = supabaseServer;

  // 元のボットの情報を取得
  const { data: sourceBot, error: sourceError } = await supabase
    .from('bots')
    .select('*')
    .eq('id', botId)
    .single();

  if (sourceError || !sourceBot) {
    return [];
  }

  // 同じカテゴリのボットを取得
  const { data: similarBots, error: similarError } = await supabase
    .from('bots')
    .select('*')
    .eq('category', sourceBot.category)
    .neq('id', botId)
    .limit(limit * 2); // より多くの候補を取得

  if (similarError || !similarBots) {
    return [];
  }

  // 類似度を計算して推薦を作成
  const recommendations = similarBots.map(bot => {
    const similarityScore = calculateContentSimilarity(sourceBot, bot);
    return {
      id: `content-${bot.id}`,
      source_bot_id: botId,
      recommended_bot_id: bot.id,
      recommendation_type: 'content_based' as const,
      similarity_score: similarityScore,
      confidence_score: similarityScore * 0.8,
      click_through_rate: 0.0,
      conversion_rate: 0.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      bot: {
        ...bot,
        authorIcon: bot.author_icon,
        imageUrl: bot.image_url,
        costPoints: bot.points
      },
      reason: '同じカテゴリのボット'
    };
  });

  // 類似度順にソート
  return recommendations
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, limit);
}

function calculateContentSimilarity(bot1: any, bot2: any): number {
  let score = 0;

  // カテゴリ一致
  if (bot1.category === bot2.category) {
    score += 0.4;
  }

  // 複雑度一致
  if (bot1.complexity === bot2.complexity) {
    score += 0.2;
  }

  // 機能の類似性
  if (bot1.can_upload_image === bot2.can_upload_image) {
    score += 0.1;
  }
  if (bot1.can_send_file === bot2.can_send_file) {
    score += 0.1;
  }

  // ポイント範囲の類似性
  const pointDiff = Math.abs(bot1.points - bot2.points);
  if (pointDiff < 50) {
    score += 0.2;
  } else if (pointDiff < 100) {
    score += 0.1;
  }

  return Math.min(score, 1.0);
}

function mergeAndDeduplicateRecommendations(recommendations: BotRecommendation[]): BotRecommendation[] {
  const merged = new Map<string, BotRecommendation>();

  recommendations.forEach(rec => {
    const key = rec.recommended_bot_id;
    const existing = merged.get(key);

    if (existing) {
      // 既存の推薦と統合
      existing.similarity_score = Math.max(existing.similarity_score, rec.similarity_score);
      existing.confidence_score = Math.max(existing.confidence_score, rec.confidence_score);
      existing.reason = `${existing.reason} + ${rec.reason}`;
    } else {
      merged.set(key, rec);
    }
  });

  return Array.from(merged.values())
    .sort((a, b) => b.similarity_score - a.similarity_score);
}

async function personalizeRecommendations(
  recommendations: BotRecommendation[], 
  userId: string
): Promise<BotRecommendation[]> {
  const supabase = supabaseServer;

  // ユーザーの利用履歴を取得
  const { data: userHistory } = await supabase
    .from('bot_user_interactions')
    .select('bot_id, interaction_type')
    .eq('user_id', userId)
    .eq('interaction_type', 'start_chat');

  if (!userHistory || userHistory.length === 0) {
    return recommendations;
  }

  const usedBotIds = new Set(userHistory.map(h => h.bot_id));

  // 既に使ったボットの推薦スコアを下げる
  return recommendations.map(rec => {
    if (usedBotIds.has(rec.recommended_bot_id)) {
      return {
        ...rec,
        similarity_score: rec.similarity_score * 0.5,
        reason: `${rec.reason}（既に利用済み）`
      };
    }
    return rec;
  }).sort((a, b) => b.similarity_score - a.similarity_score);
}


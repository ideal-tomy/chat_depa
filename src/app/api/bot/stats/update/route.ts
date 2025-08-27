import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { botId, userId, interactionType, sessionData } = await req.json();

    // バリデーション
    if (!botId) {
      return NextResponse.json({ error: 'botId is required' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }
    if (!interactionType) {
      return NextResponse.json({ error: 'interactionType is required' }, { status: 400 });
    }

    const supabase = supabaseServer;

    // 1. ユーザー・ボット相互作用を記録
    const { error: interactionError } = await supabase
      .from('bot_user_interactions')
      .insert({
        user_id: userId,
        bot_id: botId,
        interaction_type: interactionType,
        session_duration: sessionData?.sessionDuration,
        rating: sessionData?.rating
      });

    if (interactionError) {
      console.error('Error recording interaction:', interactionError);
      return NextResponse.json({ error: 'Failed to record interaction' }, { status: 500 });
    }

    // 2. ボット利用統計を更新
    await updateBotUsageStats(botId, userId, interactionType, sessionData);

    // 3. リアルタイムランキングを更新（非同期）
    updateBotRankings().catch(error => {
      console.error('Error updating rankings:', error);
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Bot interaction recorded successfully' 
    });

  } catch (error) {
    console.error('[BOT_STATS_UPDATE_ERROR]', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

async function updateBotUsageStats(
  botId: string, 
  userId: string, 
  interactionType: string, 
  sessionData?: any
) {
  const supabase = supabaseServer;

  // 既存の統計レコードを取得または作成
  let { data: stats, error: fetchError } = await supabase
    .from('bot_usage_stats')
    .select('*')
    .eq('bot_id', botId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching stats:', fetchError);
    return;
  }

  if (!stats) {
    // 新しい統計レコードを作成
    const { error: insertError } = await supabase
      .from('bot_usage_stats')
      .insert({
        bot_id: botId,
        total_uses: 1,
        unique_users: 1,
        avg_session_duration: sessionData?.sessionDuration || 0,
        completion_rate: interactionType === 'complete_chat' ? 100.0 : 0.0,
        user_rating: sessionData?.rating || 0.0,
        last_used_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error creating stats:', insertError);
    }
    return;
  }

  // 既存の統計を更新
  const updates: any = {
    last_used_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // 利用回数を増加
  if (interactionType === 'start_chat') {
    updates.total_uses = stats.total_uses + 1;
  }

  // セッション時間を更新
  if (sessionData?.sessionDuration) {
    const totalDuration = stats.avg_session_duration * stats.total_uses + sessionData.sessionDuration;
    updates.avg_session_duration = Math.round(totalDuration / (stats.total_uses + 1));
  }

  // 完了率を更新
  if (interactionType === 'complete_chat') {
    const completedSessions = stats.total_uses * (stats.completion_rate / 100) + 1;
    updates.completion_rate = Math.round((completedSessions / (stats.total_uses + 1)) * 100 * 100) / 100;
  }

  // 評価を更新
  if (sessionData?.rating) {
    const totalRating = stats.user_rating * stats.total_uses + sessionData.rating;
    updates.user_rating = Math.round((totalRating / (stats.total_uses + 1)) * 100) / 100;
  }

  // ユニークユーザー数を更新（新しいユーザーの場合）
  const { data: existingInteraction } = await supabase
    .from('bot_user_interactions')
    .select('id')
    .eq('bot_id', botId)
    .eq('user_id', userId)
    .neq('id', stats.id)
    .limit(1);

  if (!existingInteraction || existingInteraction.length === 0) {
    updates.unique_users = stats.unique_users + 1;
  }

  // 統計を更新
  const { error: updateError } = await supabase
    .from('bot_usage_stats')
    .update(updates)
    .eq('bot_id', botId);

  if (updateError) {
    console.error('Error updating stats:', updateError);
  }
}

async function updateBotRankings() {
  const supabase = supabaseServer;

  // トレンドボットの更新（利用頻度ベース）
  const { data: trendingBots, error: trendingError } = await supabase
    .from('bot_usage_stats')
    .select('bot_id, total_uses, user_rating')
    .order('total_uses', { ascending: false })
    .limit(20);

  if (trendingError) {
    console.error('Error fetching trending bots:', trendingError);
    return;
  }

  // 既存のトレンドフラグをリセット
  await supabase
    .from('bots')
    .update({ is_trending: false });

  // 上位10件をトレンドとして設定
  const topTrendingBots = trendingBots.slice(0, 10);
  for (const bot of topTrendingBots) {
    await supabase
      .from('bots')
      .update({ is_trending: true })
      .eq('id', bot.bot_id);
  }

  console.log('Bot rankings updated successfully');
}


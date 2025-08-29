import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { supabaseServer } from '@/lib/supabase/server';
import { DynamicBotRequest, Bot } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const displayType = searchParams.get('type') as DynamicBotRequest['displayType'];
    const categoryId = searchParams.get('category');
    const maxItems = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId');

    if (!displayType) {
      return NextResponse.json({ error: 'displayType is required' }, { status: 400 });
    }

    const bots = await getDynamicBots({
      displayType,
      ...(categoryId && { categoryId }),
      maxItems,
      ...(userId && { userId })
    });

    return NextResponse.json({ bots });

  } catch (error) {
    logger.error('[DYNAMIC_BOTS_API_ERROR]', new Error(String(error)));
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

async function getDynamicBots(request: DynamicBotRequest): Promise<Bot[]> {
  const supabase = supabaseServer;
  let query = supabase
    .from('bots')
    .select(`
      *,
      bot_usage_stats (
        total_uses,
        unique_users,
        avg_session_duration,
        completion_rate,
        user_rating
      )
    `);

  switch (request.displayType) {
    case 'pickup':
      // ピックアップボット（管理者指定）
      query = query.eq('is_pickup', true);
      break;

    case 'new':
      // 新着ボット（最近作成されたボット）
      query = query.eq('is_new', true);
      break;

    case 'trending':
      // トレンドボット（利用頻度ベース）
      query = query.eq('is_trending', true);
      break;

    case 'category_featured':
      // カテゴリ別特集ボット
      if (request.categoryId) {
        query = query.eq('category', request.categoryId);
      }
      // カテゴリ内で人気のボットを取得
      break;

    default:
      return [];
  }

  // 表示順序の適用
  query = applyDisplayOrder(query, request.displayType);

  // 件数制限
  query = query.limit(request.maxItems || 10);

  const { data: bots, error } = await query;

  if (error) {
    logger.error('Error fetching dynamic bots', new Error(error.message));
    return [];
  }

  // ボットデータの整形
  const formattedBots = bots?.map(bot => ({
    ...bot,
    authorIcon: bot.author_icon,
    imageUrl: bot.image_url,
    costPoints: bot.points,
    isNew: bot.is_new,
    isPopular: bot.is_trending,
    usage_stats: bot.bot_usage_stats?.[0]
  })) || [];

  return formattedBots;
}

function applyDisplayOrder(query: any, displayType: string) {
  switch (displayType) {
    case 'pickup':
      // ピックアップは手動優先度順
      return query.order('featured_priority', { ascending: false })
                 .order('manual_sort_order', { ascending: true });

    case 'new':
      // 新着は作成日順
      return query.order('created_at', { ascending: false });

    case 'trending':
      // トレンドは利用頻度順
      return query.order('bot_usage_stats.total_uses', { ascending: false, nullsLast: true })
                 .order('bot_usage_stats.user_rating', { ascending: false, nullsLast: true });

    case 'category_featured':
      // カテゴリ特集は利用頻度順
      return query.order('bot_usage_stats.total_uses', { ascending: false, nullsLast: true })
                 .order('bot_usage_stats.user_rating', { ascending: false, nullsLast: true });

    default:
      return query.order('created_at', { ascending: false });
  }
}


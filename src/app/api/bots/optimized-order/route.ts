import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { Bot } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');

    // 1. 管理者指定の優先ボットを取得
    const { data: featuredBots, error: featuredError } = await supabaseServer
      .from('bots')
      .select('*')
      .eq('is_pickup', true)
      .order('featured_priority', { ascending: false, nullsLast: true })
      .limit(10);

    if (featuredError) {
      console.error('Featured bots error:', featuredError);
    }

    // 2. 人気ボット（利用頻度ベース）を取得
    const { data: popularBots, error: popularError } = await supabaseServer
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
      `)
      .eq('is_trending', true)
      .order('usage_stats.total_uses', { ascending: false, nullsLast: true })
      .limit(20);

    if (popularError) {
      console.error('Popular bots error:', popularError);
    }

    // 3. 新着ボットを取得
    const { data: newBots, error: newError } = await supabaseServer
      .from('bots')
      .select('*')
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(15);

    if (newError) {
      console.error('New bots error:', newError);
    }

    // 4. カテゴリ別ボットを取得
    let categoryBots: Bot[] = [];
    if (category && category !== 'all') {
      const { data: catBots, error: catError } = await supabaseServer
        .from('bots')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
        .limit(30);

      if (!catError && catBots) {
        categoryBots = catBots;
      }
    }

    // 5. ユーザー固有の推薦ボットを取得
    let personalizedBots: Bot[] = [];
    if (userId) {
      const { data: userBots, error: userError } = await supabaseServer
        .from('bots')
        .select('*')
        .order('manual_sort_order', { ascending: true, nullsLast: true })
        .limit(20);

      if (!userError && userBots) {
        personalizedBots = userBots;
      }
    }

    // 6. フォールバック：すべてのボットを取得（フラグが設定されていない場合）
    let fallbackBots: Bot[] = [];
    if ((!featuredBots || featuredBots.length === 0) && 
        (!popularBots || popularBots.length === 0) && 
        (!newBots || newBots.length === 0)) {
      
      const { data: allBots, error: allError } = await supabaseServer
        .from('bots')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!allError && allBots) {
        fallbackBots = allBots;
      }
    }

    // 7. ボットを統合して重複を除去
    const allBots = [
      ...(featuredBots || []),
      ...(popularBots || []),
      ...(newBots || []),
      ...categoryBots,
      ...personalizedBots,
      ...fallbackBots
    ];

    // 重複除去（IDベース）
    const uniqueBots = allBots.filter((bot, index, self) => 
      index === self.findIndex(b => b.id === bot.id)
    );

    // 8. 表示順序を最適化
    const optimizedBots = optimizeDisplayOrder(uniqueBots, {
      featuredBots: featuredBots || [],
      popularBots: popularBots || [],
      newBots: newBots || [],
      category,
      userId
    });

    return NextResponse.json({
      success: true,
      bots: optimizedBots.slice(0, limit),
      total: optimizedBots.length,
      categories: {
        featured: featuredBots?.length || 0,
        popular: popularBots?.length || 0,
        new: newBots?.length || 0,
        category: categoryBots.length,
        personalized: personalizedBots.length,
        fallback: fallbackBots.length
      }
    });

  } catch (error) {
    console.error('[OPTIMIZED_BOTS_ORDER_API_ERROR]', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

function optimizeDisplayOrder(bots: Bot[], context: {
  featuredBots: Bot[];
  popularBots: Bot[];
  newBots: Bot[];
  category?: string | null;
  userId?: string | null;
}) {
  return bots.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // 1. 管理者指定の優先度（最高優先）
    if (context.featuredBots.some(fb => fb.id === a.id)) scoreA += 1000;
    if (context.featuredBots.some(fb => fb.id === b.id)) scoreB += 1000;

    // 2. 人気度（利用頻度）
    if (context.popularBots.some(pb => pb.id === a.id)) scoreA += 500;
    if (context.popularBots.some(pb => pb.id === b.id)) scoreB += 500;

    // 3. 新着度
    if (context.newBots.some(nb => nb.id === a.id)) scoreA += 300;
    if (context.newBots.some(nb => nb.id === b.id)) scoreB += 300;

    // 4. カテゴリマッチング
    if (context.category && a.category === context.category) scoreA += 100;
    if (context.category && b.category === context.category) scoreB += 100;

    // 5. 作成日（新しいものほど高スコア）
    const aDate = new Date(a.created_at || 0).getTime();
    const bDate = new Date(b.created_at || 0).getTime();
    scoreA += Math.floor((Date.now() - aDate) / (1000 * 60 * 60 * 24)); // 日数
    scoreB += Math.floor((Date.now() - bDate) / (1000 * 60 * 60 * 24));

    return scoreB - scoreA; // 降順（スコアが高いものを先に）
  });
}

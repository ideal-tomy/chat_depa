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

    // シンプルに全ボットを取得（フラグは後で追加予定）
    let query = supabaseServer
      .from('bots')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: allBots, error } = await query;

    if (error) {
      console.error('Error fetching bots:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch bots' 
      }, { status: 500 });
    }

    if (!allBots || allBots.length === 0) {
      return NextResponse.json({
        success: true,
        bots: [],
        total: 0,
        categories: {
          featured: 0,
          popular: 0,
          new: 0,
          category: 0,
          personalized: 0,
          fallback: 0
        }
      });
    }

    // ボットを分類（仮のロジック）
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const categorizedBots = {
      featured: allBots.slice(0, 6), // 最初の6件をおすすめとして扱う
      popular: allBots.slice(6, 12), // 次の6件を人気として扱う
      new: allBots.filter(bot => new Date(bot.created_at) > oneWeekAgo).slice(0, 6), // 1週間以内のものを新着として扱う
      category: category && category !== 'all' ? allBots : [],
      personalized: [],
      fallback: allBots
    };

    // 重複を除去して統合
    const uniqueBots = allBots.filter((bot, index, self) => 
      index === self.findIndex(b => b.id === bot.id)
    );

    // 表示順序を最適化
    const optimizedBots = optimizeDisplayOrder(uniqueBots, {
      featuredBots: categorizedBots.featured,
      popularBots: categorizedBots.popular,
      newBots: categorizedBots.new,
      category,
      userId
    });

    return NextResponse.json({
      success: true,
      bots: optimizedBots.slice(0, limit),
      total: optimizedBots.length,
      categories: {
        featured: categorizedBots.featured.length,
        popular: categorizedBots.popular.length,
        new: categorizedBots.new.length,
        category: categorizedBots.category.length,
        personalized: categorizedBots.personalized.length,
        fallback: categorizedBots.fallback.length
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

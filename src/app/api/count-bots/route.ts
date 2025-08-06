import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    console.log('Counting total bots...');
    
    // 総ボット数をカウント
    const { count, error } = await supabaseServer
      .from('bots')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Count error:', error);
      return NextResponse.json({
        error: 'Failed to count bots',
        details: error
      }, { status: 500 });
    }

    // カテゴリ別のボット数も取得
    const { data: categoryData, error: categoryError } = await supabaseServer
      .from('bots')
      .select('category')
      .order('category');

    if (categoryError) {
      console.error('Category count error:', categoryError);
      return NextResponse.json({
        error: 'Failed to get category data',
        details: categoryError
      }, { status: 500 });
    }

    // カテゴリ別の集計
    const categoryCount: Record<string, number> = {};
    categoryData?.forEach(bot => {
      categoryCount[bot.category] = (categoryCount[bot.category] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      message: 'Bot count completed',
      totalBots: count,
      categoryBreakdown: categoryCount,
      uniqueCategories: Object.keys(categoryCount).length
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      error: 'API error',
      details: error
    }, { status: 500 });
  }
}
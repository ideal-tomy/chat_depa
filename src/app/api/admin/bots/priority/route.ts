import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

// ボットの優先度設定を取得
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let query = supabaseServer
      .from('bots')
      .select('id, name, category, is_pickup, is_trending, is_new, featured_priority, manual_sort_order, created_at')
      .order('featured_priority', { ascending: false, nullsFirst: false }) // DESC NULLS LAST
      .order('manual_sort_order', { ascending: true, nullsFirst: true }) // ASC NULLS FIRST
      .order('created_at', { ascending: false }); // 新しいものを優先

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: bots, error } = await query;

    if (error) {
      logger.error('Error fetching bot priorities', new Error(String(error)));
      return NextResponse.json({ 
        error: 'Failed to fetch bot priorities' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      bots: bots || []
    });

  } catch (error) {
    logger.error('[ADMIN_BOT_PRIORITY_API_ERROR]', new Error(String(error)));
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// ボットの優先度設定を更新
export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { botId, updates } = body;

    if (!botId || !updates) {
      return NextResponse.json({ 
        error: 'botId and updates are required' 
      }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('bots')
      .update(updates)
      .eq('id', botId)
      .select();

    if (error) {
      logger.error('Error updating bot priority', new Error(String(error)));
      return NextResponse.json({ 
        error: 'Failed to update bot priority' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      bot: data?.[0]
    });

  } catch (error) {
    logger.error('[ADMIN_BOT_PRIORITY_UPDATE_API_ERROR]', new Error(String(error)));
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// 複数のボットの優先度を一括更新
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { updates } = body;

    if (!Array.isArray(updates)) {
      return NextResponse.json({ 
        error: 'updates must be an array' 
      }, { status: 400 });
    }

    const results = [];
    const errors = [];

    for (const update of updates) {
      const { botId, ...updateData } = update;
      
      const { data, error } = await supabaseServer
        .from('bots')
        .update(updateData)
        .eq('id', botId)
        .select();

      if (error) {
        errors.push({ botId, error: error.message });
      } else {
        results.push(data?.[0]);
      }
    }

    return NextResponse.json({
      success: true,
      updated: results,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    logger.error('[ADMIN_BOT_PRIORITY_BATCH_UPDATE_API_ERROR]', new Error(String(error)));
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

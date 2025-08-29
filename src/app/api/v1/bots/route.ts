import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { ApiResponse, Bot } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * ボット一覧を取得するAPI
 * GET /api/v1/bots
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Bot[]>>> {
  try {
    logger.info('[v1/bots] Starting bots API request');
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseServer
      .from('bots')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: bots, error } = await query;

    if (error) {
      logger.error('[v1/bots] Database error', error instanceof Error ? error : new Error('Unknown db error'));
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch bots',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    logger.info('[v1/bots] Bots fetched successfully', { count: bots?.length || 0 });
    
    return NextResponse.json({
      success: true,
      data: bots || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('[v1/bots] Unexpected error', error instanceof Error ? error : new Error('Unknown error'));
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * 新しいボットを作成するAPI
 * POST /api/v1/bots
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Bot>>> {
  try {
    logger.info('[v1/bots] Starting bot creation request');
    
    const body = await req.json();
    const { name, description, category, author, points, system_prompt } = body as Partial<Bot>;

    // バリデーション
    if (!name || !description || !category || !author) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, description, category, author',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const newBot = {
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      author: author.trim(),
      points: points || 0,
      system_prompt: system_prompt || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: bot, error } = await supabaseServer
      .from('bots')
      .insert(newBot)
      .select()
      .single();

    if (error) {
      logger.error('[v1/bots] Create bot error', error instanceof Error ? error : new Error('Unknown create error'));
      return NextResponse.json({
        success: false,
        error: 'Failed to create bot',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    logger.info('[v1/bots] Bot created successfully', { botId: bot?.id });
    
    return NextResponse.json({
      success: true,
      data: bot,
      message: 'Bot created successfully',
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    logger.error('[v1/bots] Unexpected error in POST', error instanceof Error ? error : new Error('Unknown error'));
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}


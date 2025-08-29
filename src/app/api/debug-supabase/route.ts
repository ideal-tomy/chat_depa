import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
export const dynamic = 'force-dynamic'
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    logger.info('Debugging Supabase connection...');
    
    // 既存のボットデータを確認
    const { data: existingBots, error: selectError } = await supabaseServer
      .from('bots')
      .select('id, name, category')
      .limit(10);

    if (selectError) {
      logger.error('Error reading bots', new Error(String(selectError)));
      return NextResponse.json({ 
        error: 'Failed to read existing bots', 
        details: selectError 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection working',
      existingBots: existingBots,
      botsCount: existingBots?.length || 0
    });

  } catch (error) {
    logger.error('API error', new Error(String(error)));
    return NextResponse.json({ 
      error: 'API error', 
      details: error 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    logger.info('Testing single bot insertion...');
    
    // 最小限のテストボット
    const testBot = {
      name: 'テスト用ボット（削除予定）',
      description: 'Supabase接続テスト用のボットです',
      category: 'テスト',
      avatar_url: '/images/icons/placeholder/default.png',
      can_upload_image: false,
      can_send_file: false
    };

    // 既存のテストボットを削除
    const { error: deleteError } = await supabaseServer
      .from('bots')
      .delete()
      .eq('name', testBot.name);

    if (deleteError) {
      logger.warn('Delete warning (may be normal)', { error: deleteError });
    }

    // テストボットを挿入
    const { data, error } = await supabaseServer
      .from('bots')
      .insert([testBot])
      .select();

    if (error) {
      logger.error('Insert error', new Error(String(error)));
      return NextResponse.json({ 
        error: 'Failed to insert test bot', 
        details: error 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Test bot inserted successfully',
      testBot: data[0]
    });

  } catch (error) {
    logger.error('API error', new Error(String(error)));
    return NextResponse.json({ 
      error: 'API error', 
      details: error 
    }, { status: 500 });
  }
}


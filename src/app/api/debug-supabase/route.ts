import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    console.log('Debugging Supabase connection...');
    
    // 既存のボットデータを確認
    const { data: existingBots, error: selectError } = await supabaseServer
      .from('bots')
      .select('id, name, category')
      .limit(10);

    if (selectError) {
      console.error('Error reading bots:', selectError);
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
    console.error('API error:', error);
    return NextResponse.json({ 
      error: 'API error', 
      details: error 
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log('Testing single bot insertion...');
    
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
      console.log('Delete warning (may be normal):', deleteError);
    }

    // テストボットを挿入
    const { data, error } = await supabaseServer
      .from('bots')
      .insert([testBot])
      .select();

    if (error) {
      console.error('Insert error:', error);
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
    console.error('API error:', error);
    return NextResponse.json({ 
      error: 'API error', 
      details: error 
    }, { status: 500 });
  }
}
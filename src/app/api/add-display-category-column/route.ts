export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST() {
  try {
    console.log('display_categoryカラム追加開始...');
    
    // SQLでカラムを追加
    const { error } = await supabaseServer.rpc('exec_sql', {
      sql: `
        ALTER TABLE bots 
        ADD COLUMN IF NOT EXISTS display_category TEXT DEFAULT '真面目';
      `
    });
    
    if (error) {
      console.error('カラム追加エラー:', error);
      return NextResponse.json({
        error: 'Failed to add display_category column',
        details: error
      }, { status: 500 });
    }
    
    console.log('display_categoryカラム追加完了');
    
    // テーブル構造を確認
    const { data: columns, error: columnsError } = await supabaseServer
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_schema', 'public')
      .eq('table_name', 'bots');
    
    if (columnsError) {
      console.error('カラム情報取得エラー:', columnsError);
    } else {
      console.log('現在のテーブル構造:', columns);
    }
    
    return NextResponse.json({
      success: true,
      message: 'display_category column added successfully',
      columns: columns || []
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      error: 'API error',
      details: error
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Add Display Category Column API',
    description: 'Use POST method to add display_category column to bots table',
    endpoint: '/api/add-display-category-column'
  });
} 
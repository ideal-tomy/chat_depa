export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    console.log('Checking bots table schema...');
    
    // 既存のボットを1件取得してスキーマを確認
    const { data: sampleBot, error } = await supabaseServer
      .from('bots')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Schema check error:', error);
      return NextResponse.json({
        error: 'Failed to check schema',
        details: error
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Schema check completed',
      availableColumns: Object.keys(sampleBot || {}),
      sampleData: sampleBot
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      error: 'API error',
      details: error
    }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    logger.info('Checking bots table schema...');
    
    // 既存のボットを1件取得してスキーマを確認
    const { data: sampleBot, error } = await supabaseServer
      .from('bots')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      logger.error('Schema check error', new Error(String(error)));
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
    logger.error('API error', new Error(String(error)));
    return NextResponse.json({
      error: 'API error',
      details: error
    }, { status: 500 });
  }
}


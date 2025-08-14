export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Environment variables check...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    return NextResponse.json({
      success: true,
      env: {
        hasSupabaseUrl: !!supabaseUrl,
        hasAnonKey: !!supabaseAnonKey,
        hasServiceKey: !!supabaseServiceKey,
        urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'NOT SET',
      }
    });
  } catch (error) {
    console.error('Environment check error:', error);
    return NextResponse.json({
      error: 'Environment check failed',
      details: error
    }, { status: 500 });
  }
}
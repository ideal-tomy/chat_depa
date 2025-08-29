import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const errorDescription = requestUrl.searchParams.get('error_description');

    // エラーがある場合はログイン画面にリダイレクト
    if (error) {
      logger.error('Auth callback error', new Error(String(error)), { errorDescription });
      return NextResponse.redirect(`${requestUrl.origin}/account/login?error=${encodeURIComponent(error)}`);
    }

    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        logger.error('Code exchange error', new Error(String(exchangeError)));
        return NextResponse.redirect(`${requestUrl.origin}/account/login?error=code_exchange_failed`);
      }
    }

    // 成功時はホームページにリダイレクト
    return NextResponse.redirect(requestUrl.origin);
  } catch (error) {
    logger.error('Auth callback unexpected error', new Error(String(error)));
    return NextResponse.redirect(`${new URL(request.url).origin}/account/login?error=unexpected_error`);
  }
}

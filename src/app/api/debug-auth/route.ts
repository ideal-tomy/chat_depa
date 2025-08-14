import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  try {
    console.log('[debug-auth] Starting debug auth check')
    
    // 環境変数の確認
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
    }
    console.log('[debug-auth] Environment variables:', envCheck)
    
    // Supabase クライアントの作成
    const supabase = createRouteHandlerClient({ cookies })
    console.log('[debug-auth] Supabase client created')

    // クッキー情報の確認
    const cookieStore = cookies()
    const allCookies = Array.from(cookieStore.getAll())
    const supabaseCookies = allCookies.filter(cookie => 
      cookie.name.includes('supabase') || cookie.name.includes('sb-')
    )
    console.log('[debug-auth] Supabase-related cookies:', supabaseCookies.map(c => ({ name: c.name, hasValue: !!c.value })))

    // 認証ユーザー取得
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    console.log('[debug-auth] Auth result:', { 
      hasUser: !!user, 
      userId: user?.id,
      email: user?.email,
      authError: authErr?.message 
    })

    // profiles テーブルのチェック（ユーザーがいる場合のみ）
    let profileCheck = null
    if (user) {
      try {
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        profileCheck = {
          hasProfile: !!profile,
          profileData: profile,
          profileError: profileErr?.message,
          profileErrorCode: profileErr?.code
        }
        console.log('[debug-auth] Profile check:', profileCheck)
      } catch (err: any) {
        profileCheck = {
          hasProfile: false,
          profileError: err.message,
          profileErrorCode: err.code
        }
        console.log('[debug-auth] Profile check error:', err)
      }
    }

    return NextResponse.json({ 
      success: true,
      debug: {
        environment: envCheck,
        cookies: supabaseCookies.map(c => ({ name: c.name, hasValue: !!c.value })),
        auth: {
          hasUser: !!user,
          userId: user?.id,
          email: user?.email,
          error: authErr?.message
        },
        profile: profileCheck
      }
    }, { status: 200 })
    
  } catch (e: any) {
    console.error('[debug-auth] unexpected error:', e)
    return NextResponse.json({ 
      error: e?.message ?? 'unexpected error',
      stack: e?.stack 
    }, { status: 500 })
  }
}
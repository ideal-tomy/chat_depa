import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 環境変数確認
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }

    // テストユーザーの存在確認
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, username, current_points, role, created_at')
      .in('username', ['テストユーザー', '管理者ユーザー'])

    return NextResponse.json({
      success: true,
      data: {
        environment: envCheck,
        test_users: users || [],
        users_error: usersError?.message || null,
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
        auth_instructions: [
          '1. ブラウザのコンソールでエラー確認',
          '2. ネットワークタブでAPI呼び出し確認',
          '3. Supabase Auth設定確認'
        ]
      }
    })

  } catch (error) {
    console.error('Debug auth error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
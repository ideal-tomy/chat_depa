import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // テストユーザーの作成
    const testUsers = [
      {
        email: 'test@example.com',
        password: 'testpass123',
        username: 'テストユーザー',
        role: 'user',
        points: 1000
      },
      {
        email: 'admin@example.com', 
        password: 'adminpass123',
        username: '管理者ユーザー',
        role: 'admin',
        points: 5000
      }
    ]

    const results = []

    for (const userData of testUsers) {
      // ユーザー作成
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // メール認証をスキップ
        user_metadata: {
          full_name: userData.username
        }
      })

      if (authError) {
        console.error(`ユーザー作成エラー (${userData.email}):`, authError)
        results.push({
          email: userData.email,
          success: false,
          error: authError.message
        })
        continue
      }

      if (authData.user) {
        // プロフィール作成/更新
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            username: userData.username,
            role: userData.role,
            current_points: userData.points
          })

        if (profileError) {
          console.error(`プロフィール作成エラー (${userData.email}):`, profileError)
          results.push({
            email: userData.email,
            success: false,
            error: `プロフィール作成失敗: ${profileError.message}`
          })
        } else {
          results.push({
            email: userData.email,
            success: true,
            user_id: authData.user.id,
            role: userData.role,
            points: userData.points
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'テストユーザー作成処理完了',
      data: {
        results,
        login_info: [
          {
            email: 'test@example.com',
            password: 'testpass123',
            role: 'user',
            description: '一般ユーザー（1000ポイント）'
          },
          {
            email: 'admin@example.com',
            password: 'adminpass123', 
            role: 'admin',
            description: '管理者ユーザー（5000ポイント）'
          }
        ]
      }
    })

  } catch (error) {
    console.error('テストユーザー作成エラー:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
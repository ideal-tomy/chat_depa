import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('[profile-client] Starting client-based profile API')
    
    // Authorization ヘッダーからトークンを取得
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Supabase クライアントを作成（サービスロールキーを使用）
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // トークンを使ってユーザー情報を取得
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('[profile-client] Auth error:', authError)
      return NextResponse.json({ error: 'Invalid token or user not found' }, { status: 401 })
    }

    console.log('[profile-client] User found:', user.id)

    // プロフィール情報を取得
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('[profile-client] Profile error:', profileError)
      // プロフィールが存在しない場合はデフォルトプロフィールを作成
      if (profileError.code === 'PGRST116') {
        const defaultProfile = {
          id: user.id,
          username: user.email?.split('@')[0] || 'ユーザー',
          current_points: 0,
          role: 'user',
          created_at: new Date().toISOString()
        }
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert(defaultProfile)
          .select('*')
          .single()
          
        if (createError) {
          console.error('[profile-client] Create profile error:', createError)
          return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
        }
        
        return NextResponse.json({
          success: true,
          data: {
            profile: newProfile,
            auth: {
              user_id: user.id,
              email: user.email
            }
          }
        })
      }
      
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    console.log('[profile-client] Profile found successfully')
    return NextResponse.json({
      success: true,
      data: {
        profile: profile,
        auth: {
          user_id: user.id,
          email: user.email
        }
      }
    })

  } catch (error: any) {
    console.error('[profile-client] Unexpected error:', error)
    return NextResponse.json({
      error: error?.message ?? 'Internal server error',
      stack: error?.stack
    }, { status: 500 })
  }
}

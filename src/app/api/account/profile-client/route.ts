import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    logger.info('[profile-client] Starting client-based profile API')
    
    // Authorization ヘッダーからトークンを取得
    const authHeader = req.headers.get('authorization')
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
      logger.error('[profile-client] Auth error', authError instanceof Error ? authError : new Error('Unknown auth error'))
      return NextResponse.json({ error: 'Invalid token or user not found' }, { status: 401 })
    }

    logger.info('[profile-client] User found', { userId: user.id })

    // プロフィール情報を取得
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      logger.error('[profile-client] Profile error', profileError instanceof Error ? profileError : new Error('Unknown profile error'))
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
          logger.error('[profile-client] Create profile error', createError instanceof Error ? createError : new Error('Unknown create error'))
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

    logger.info('[profile-client] Profile found successfully')
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

  } catch (error) {
    logger.error('[profile-client] Unexpected error', error instanceof Error ? error : new Error('Unknown error'))
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Internal server error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

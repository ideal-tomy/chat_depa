import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    logger.info('[profile] Starting profile API request')
    
    // Supabase クライアントの作成
    const supabase = createRouteHandlerClient({ cookies })
    logger.info('[profile] Supabase client created')

    // 認証ユーザー取得
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr) {
      logger.error('[profile] auth error', authErr instanceof Error ? authErr : new Error('Unknown auth error'))
      return NextResponse.json({ error: 'Unauthorized', details: authErr.message }, { status: 401 })
    }
    if (!user) {
      logger.warn('[profile] No user found')
      return NextResponse.json({ error: 'No user' }, { status: 401 })
    }

    logger.info('[profile] User found', { userId: user.id })

    // profiles から読み出し
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      logger.error('[profile] db error', error instanceof Error ? error : new Error('Unknown db error'))
      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 })
    }

    logger.info('[profile] Profile found successfully')
    return NextResponse.json({ 
      success: true,
      data: {
        profile: profile || null,
        auth: {
          user_id: user.id,
          email: user.email
        }
      }
    }, { status: 200 })
    
  } catch (error) {
    logger.error('[profile] unexpected error', error instanceof Error ? error : new Error('Unknown error'))
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'unexpected error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

// プロフィール情報更新API
export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    logger.info('[profile PUT] Starting profile update request')
    
    const supabase = createRouteHandlerClient({ cookies })

    // 認証ユーザー取得
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr) {
      logger.error('[profile PUT] auth error', authErr instanceof Error ? authErr : new Error('Unknown auth error'))
      return NextResponse.json({ error: 'Unauthorized', details: authErr.message }, { status: 401 })
    }
    if (!user) {
      logger.warn('[profile PUT] No user found')
      return NextResponse.json({ error: 'No user' }, { status: 401 })
    }

    // リクエストボディを取得
    const body = await req.json()
    const { username, avatar_url } = body as { username?: string; avatar_url?: string }

    // バリデーション
    if (!username || username.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Username is required'
      }, { status: 400 })
    }

    if (username.length > 50) {
      return NextResponse.json({
        success: false,
        error: 'Username must be 50 characters or less'
      }, { status: 400 })
    }

    // プロフィール更新
    const updateData: Record<string, unknown> = { username: username.trim() }
    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select('*')
      .single()

    if (updateError) {
      logger.error('[profile PUT] db error', updateError instanceof Error ? updateError : new Error('Unknown update error'))
      return NextResponse.json({
        error: updateError.message,
        code: updateError.code
      }, { status: 500 })
    }

    logger.info('[profile PUT] Profile updated successfully')
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: updatedProfile
      }
    })

  } catch (error) {
    logger.error('[profile PUT] unexpected error', error instanceof Error ? error : new Error('Unknown error'))
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Internal server error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

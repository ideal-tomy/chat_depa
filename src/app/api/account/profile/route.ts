import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  try {
    console.log('[profile] Starting profile API request')
    
    // Supabase クライアントの作成
    const supabase = createRouteHandlerClient({ cookies })
    console.log('[profile] Supabase client created')

    // 認証ユーザー取得
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr) {
      console.error('[profile] auth error:', authErr)
      return NextResponse.json({ error: 'Unauthorized', details: authErr.message }, { status: 401 })
    }
    if (!user) {
      console.log('[profile] No user found')
      return NextResponse.json({ error: 'No user' }, { status: 401 })
    }

    console.log('[profile] User found:', user.id)

    // profiles から読み出し
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('[profile] db error:', error)
      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 })
    }

    console.log('[profile] Profile found successfully')
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
    
  } catch (e: any) {
    console.error('[profile] unexpected error:', e)
    return NextResponse.json({ 
      error: e?.message ?? 'unexpected error',
      stack: e?.stack 
    }, { status: 500 })
  }
}

// プロフィール情報更新API
export async function PUT(request: NextRequest) {
  try {
    console.log('[profile PUT] Starting profile update request')
    
    const supabase = createRouteHandlerClient({ cookies })

    // 認証ユーザー取得
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr) {
      console.error('[profile PUT] auth error:', authErr)
      return NextResponse.json({ error: 'Unauthorized', details: authErr.message }, { status: 401 })
    }
    if (!user) {
      console.log('[profile PUT] No user found')
      return NextResponse.json({ error: 'No user' }, { status: 401 })
    }

    // リクエストボディを取得
    const body = await request.json()
    const { username, avatar_url } = body

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
    const updateData: any = { username: username.trim() }
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
      console.error('[profile PUT] db error:', updateError)
      return NextResponse.json({
        error: updateError.message,
        code: updateError.code
      }, { status: 500 })
    }

    console.log('[profile PUT] Profile updated successfully')
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: updatedProfile
      }
    })

  } catch (error: any) {
    console.error('[profile PUT] unexpected error:', error)
    return NextResponse.json({
      error: error?.message ?? 'Internal server error',
      stack: error?.stack
    }, { status: 500 })
  }
}
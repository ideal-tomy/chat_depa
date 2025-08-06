import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// プロフィール情報取得API
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Authorization ヘッダーからトークンを取得
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Authorization header required'
      }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // トークンからユーザー情報を取得
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token or user not found'
      }, { status: 401 })
    }

    // プロフィール情報を取得
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, current_points, role, created_at')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch profile'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: profile || null,
        auth: {
          user_id: user.id,
          email: user.email
        }
      }
    })

  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// プロフィール情報更新API
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Authorization ヘッダーからトークンを取得
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Authorization header required'
      }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // トークンからユーザー情報を取得
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token or user not found'
      }, { status: 401 })
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
      .select('id, username, avatar_url, current_points, role, created_at')
      .single()

    if (updateError) {
      console.error('Profile update error:', updateError)
      return NextResponse.json({
        success: false,
        error: 'Failed to update profile'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: updatedProfile
      }
    })

  } catch (error) {
    console.error('Profile update API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
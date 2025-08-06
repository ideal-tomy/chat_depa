import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// 現在のポイント残高取得API
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

    // プロフィールからポイント残高を取得
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('current_points')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Points fetch error:', profileError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch points'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        current_points: profile?.current_points || 0,
        user_id: user.id
      }
    })

  } catch (error) {
    console.error('Points API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// ポイント消費API
export async function POST(request: NextRequest) {
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
    const { points, description, reference_id } = body

    // バリデーション
    if (!points || points <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Points must be a positive number'
      }, { status: 400 })
    }

    // 現在のポイント残高を確認
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('current_points')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch current points'
      }, { status: 500 })
    }

    const currentPoints = profile?.current_points || 0
    
    if (currentPoints < points) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient points',
        data: {
          current_points: currentPoints,
          required_points: points
        }
      }, { status: 400 })
    }

    // トランザクション処理
    const newBalance = currentPoints - points

    // ポイント残高を更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ current_points: newBalance })
      .eq('id', user.id)

    if (updateError) {
      console.error('Points update error:', updateError)
      return NextResponse.json({
        success: false,
        error: 'Failed to update points'
      }, { status: 500 })
    }

    // ポイント履歴に記録
    const { error: historyError } = await supabase
      .from('points_history')
      .insert({
        user_id: user.id,
        points: -points, // 消費なのでマイナス
        transaction_type: 'spent',
        description: description || 'ポイント消費',
        reference_id: reference_id || null
      })

    if (historyError) {
      console.error('History insert error:', historyError)
      // ポイント履歴の記録に失敗しても、ポイント消費自体は成功とする
    }

    return NextResponse.json({
      success: true,
      message: 'Points spent successfully',
      data: {
        points_spent: points,
        previous_balance: currentPoints,
        new_balance: newBalance
      }
    })

  } catch (error) {
    console.error('Points spend API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
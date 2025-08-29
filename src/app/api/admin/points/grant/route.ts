import { supabaseServer } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
export const dynamic = 'force-dynamic'

// 管理者用手動ポイント付与API
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const supabase = supabaseServer

    // Authorization ヘッダーからトークンを取得
    const authHeader = req.headers.get('authorization')
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

    // 管理者権限の確認
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (adminError || adminProfile?.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: 'Admin access required'
      }, { status: 403 })
    }

    // リクエストボディを取得
    const body = await req.json()
    const { target_user_id, points, description } = body

    // バリデーション
    if (!target_user_id) {
      return NextResponse.json({
        success: false,
        error: 'Target user ID is required'
      }, { status: 400 })
    }

    if (!points || isNaN(points)) {
      return NextResponse.json({
        success: false,
        error: 'Points must be a valid number'
      }, { status: 400 })
    }

    // 対象ユーザーの存在確認
    const { data: targetProfile, error: targetError } = await supabase
      .from('profiles')
      .select('id, username, current_points')
      .eq('id', target_user_id)
      .single()

    if (targetError || !targetProfile) {
      return NextResponse.json({
        success: false,
        error: 'Target user not found'
      }, { status: 404 })
    }

    // 新しいポイント残高を計算
    const currentPoints = targetProfile.current_points || 0
    const newBalance = currentPoints + points

    // ポイント残高を更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ current_points: newBalance })
      .eq('id', target_user_id)

    if (updateError) {
      logger.error('Points update error', new Error(String(updateError)))
      return NextResponse.json({
        success: false,
        error: 'Failed to update points'
      }, { status: 500 })
    }

    // ポイント履歴に記録
    const { error: historyError } = await supabase
      .from('points_history')
      .insert({
        user_id: target_user_id,
        points: points,
        transaction_type: 'manual_grant',
        description: description || `管理者による手動付与 (by: ${user.email})`,
        reference_id: user.id // 付与した管理者のIDを記録
      })

    if (historyError) {
      logger.error('History insert error', new Error(String(historyError)))
      // ポイント履歴の記録に失敗しても、ポイント付与自体は成功とする
    }

    return NextResponse.json({
      success: true,
      message: 'Points granted successfully',
      data: {
        target_user: {
          id: target_user_id,
          username: targetProfile.username
        },
        points_granted: points,
        previous_balance: currentPoints,
        new_balance: newBalance,
        granted_by: user.email
      }
    })

  } catch (error) {
    logger.error('Points grant API error', new Error(String(error)))
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}


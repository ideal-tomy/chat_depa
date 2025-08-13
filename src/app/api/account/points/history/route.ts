import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

// ポイント履歴取得API
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

    // URLパラメータから取得
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const type = url.searchParams.get('type') // earned, spent, purchased, manual_grant

    // ポイント履歴を取得
    let query = supabase
      .from('points_history')
      .select('id, points, transaction_type, description, reference_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (type) {
      query = query.eq('transaction_type', type)
    }

    const { data: history, error: historyError } = await query

    if (historyError) {
      console.error('History fetch error:', historyError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch point history'
      }, { status: 500 })
    }

    // 合計取得用のクエリ
    let countQuery = supabase
      .from('points_history')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (type) {
      countQuery = countQuery.eq('transaction_type', type)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error('Count fetch error:', countError)
    }

    return NextResponse.json({
      success: true,
      data: {
        history: history || [],
        pagination: {
          total: count || 0,
          limit,
          offset,
          has_more: (count || 0) > offset + limit
        },
        filter: {
          type: type || 'all'
        }
      }
    })

  } catch (error) {
    console.error('Point history API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
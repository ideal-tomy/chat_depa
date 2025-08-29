import { supabaseServer } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
export const dynamic = 'force-dynamic'

// 管理者用ユーザー一覧取得API
export async function GET(req: NextRequest): Promise<NextResponse> {
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

    // URLパラメータから取得
    const url = new URL(req.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const search = url.searchParams.get('search') || ''

    // ユーザー一覧を取得
    let query = supabase
      .from('profiles')
      .select('id, username, avatar_url, current_points, role, created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) {
      query = query.ilike('username', `%${search}%`)
    }

    const { data: users, error: usersError } = await query

    if (usersError) {
      logger.error('Users fetch error', new Error(String(usersError)))
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch users'
      }, { status: 500 })
    }

    // 合計取得用のクエリ
    let countQuery = supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })

    if (search) {
      countQuery = countQuery.ilike('username', `%${search}%`)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      logger.error('Count fetch error', new Error(String(countError)))
    }

    // 統計情報の取得
    const { data: stats } = await supabase
      .from('profiles')
      .select('role, current_points')

    const statistics = stats ? {
      total_users: stats.length,
      admin_users: stats.filter(s => s.role === 'admin').length,
      regular_users: stats.filter(s => s.role === 'user').length,
      total_points: stats.reduce((sum, s) => sum + (s.current_points || 0), 0),
      average_points: Math.round(stats.reduce((sum, s) => sum + (s.current_points || 0), 0) / stats.length)
    } : null

    return NextResponse.json({
      success: true,
      data: {
        users: users || [],
        pagination: {
          total: count || 0,
          limit,
          offset,
          has_more: (count || 0) > offset + limit
        },
        search: {
          term: search
        },
        statistics
      }
    })

  } catch (error) {
    logger.error('Admin users API error', new Error(String(error)))
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}


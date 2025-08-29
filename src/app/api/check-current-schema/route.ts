export const dynamic = 'force-dynamic'
import { supabaseServer } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const supabase = supabaseServer

    // RPC関数を使ってスキーマ情報を取得
    const { data: profilesData, error: profilesError } = await supabase
      .rpc('get_table_columns', { table_name: 'profiles' })

    const { data: botsData, error: botsError } = await supabase
      .rpc('get_table_columns', { table_name: 'bots' })

    // 単純なクエリでテーブルの存在確認
    const { data: profilesCheck, error: profilesCheckError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    const { data: botsCheck, error: botsCheckError } = await supabase
      .from('bots')
      .select('*')
      .limit(1)

    // ポイント関連テーブルの確認
    const { error: pointsHistoryError } = await supabase
      .from('points_history')
      .select('*')
      .limit(1)

    const { error: plansError } = await supabase
      .from('plans')
      .select('*')
      .limit(1)

    const { error: pointPurchasesError } = await supabase
      .from('point_purchases')
      .select('*')
      .limit(1)

    return NextResponse.json({
      success: true,
      data: {
        tables: {
          profiles: !profilesCheckError,
          bots: !botsCheckError,
          points_history: !pointsHistoryError,
          plans: !plansError,
          point_purchases: !pointPurchasesError,
        },
        errors: {
          profiles: profilesCheckError?.message || null,
          bots: botsCheckError?.message || null,
          points_history: pointsHistoryError?.message || null,
          plans: plansError?.message || null,
          point_purchases: pointPurchasesError?.message || null,
        },
        sampleData: {
          profiles: profilesCheck?.[0] || null,
          bots: botsCheck?.[0] || null,
        },
        rpcResults: {
          profilesSchema: profilesData || null,
          botsSchema: botsData || null,
          profilesRpcError: profilesError?.message || null,
          botsRpcError: botsError?.message || null,
        }
      }
    })

  } catch (error) {
    logger.error('Schema check error', new Error(String(error)))
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}


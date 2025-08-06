import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

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
    const { data: pointsHistoryCheck, error: pointsHistoryError } = await supabase
      .from('points_history')
      .select('*')
      .limit(1)

    const { data: plansCheck, error: plansError } = await supabase
      .from('plans')
      .select('*')
      .limit(1)

    const { data: pointPurchasesCheck, error: pointPurchasesError } = await supabase
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
    console.error('Schema check error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
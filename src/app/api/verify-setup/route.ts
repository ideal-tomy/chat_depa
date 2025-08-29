export const dynamic = 'force-dynamic'
import { supabaseServer } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const supabase = supabaseServer

    // テーブルの存在を直接確認
    const checkPromises = [
      supabase.from('profiles').select('current_points, role').limit(1),
      supabase.from('points_history').select('*').limit(1),
      supabase.from('plans').select('*').limit(1),
      supabase.from('point_purchases').select('*').limit(1)
    ]

    const [profilesResult, pointsHistoryResult, plansResult, purchasesResult] = await Promise.all(checkPromises)

    // プランデータの確認
    const { data: allPlans, error: allPlansError } = await supabase
      .from('plans')
      .select('*')

    return NextResponse.json({
      success: true,
      setup_status: {
        profiles_updated: !profilesResult?.error,
        points_history_created: !pointsHistoryResult?.error,
        plans_created: !plansResult?.error,
        point_purchases_created: !purchasesResult?.error,
        plans_data_inserted: !allPlansError && (allPlans?.length || 0) > 0
      },
      errors: {
        profiles: profilesResult?.error?.message || null,
        points_history: pointsHistoryResult?.error?.message || null,
        plans: plansResult?.error?.message || null,
        point_purchases: purchasesResult?.error?.message || null,
        plans_data: allPlansError?.message || null
      },
      data: {
        plans_count: allPlans?.length || 0,
        sample_plan: allPlans?.[0] || null,
        sample_profile: profilesResult?.data?.[0] || null
      }
    })

  } catch (error) {
    logger.error('Setup verification error', new Error(String(error)))
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}


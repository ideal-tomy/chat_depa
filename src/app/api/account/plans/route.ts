export const dynamic = 'force-dynamic'
import { supabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// 購入可能プラン一覧取得API
export async function GET() {
  try {
    const supabase = supabaseServer

    // アクティブなプランを取得
    const { data: plans, error: plansError } = await supabase
      .from('plans')
      .select('id, name, description, price, points, created_at')
      .eq('is_active', true)
      .order('price', { ascending: true })

    if (plansError) {
      console.error('Plans fetch error:', plansError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch plans'
      }, { status: 500 })
    }

    // プランにボーナス率を追加
    const plansWithBonus = plans?.map(plan => {
      const bonusPercent = plan.price > 0 ? Math.round(((plan.points - plan.price) / plan.price) * 100) : 0
      return {
        ...plan,
        bonus_percent: bonusPercent > 0 ? bonusPercent : 0,
        is_bonus: bonusPercent > 0
      }
    }) || []

    return NextResponse.json({
      success: true,
      data: {
        plans: plansWithBonus,
        total_plans: plansWithBonus.length
      }
    })

  } catch (error) {
    console.error('Plans API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
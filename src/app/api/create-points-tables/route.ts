import { supabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const supabase = supabaseServer

    console.log('Creating points management tables...')

    // 1. profilesテーブルにcurrent_pointsとroleカラムを追加
    const { error: addPointsError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
          -- current_points カラムを追加（存在しない場合）
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'current_points'
          ) THEN
            ALTER TABLE profiles ADD COLUMN current_points INTEGER DEFAULT 1000;
          END IF;

          -- role カラムを追加（存在しない場合）
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'role'
          ) THEN
            ALTER TABLE profiles ADD COLUMN role VARCHAR(20) DEFAULT 'user';
          END IF;
        END $$;
      `
    })

    if (addPointsError) {
      console.error('Error adding columns to profiles:', addPointsError)
      throw new Error(`Failed to add columns to profiles: ${addPointsError.message}`)
    }

    // 2. points_historyテーブルの作成
    const { error: pointsHistoryError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS points_history (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          points INTEGER NOT NULL,
          transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'purchased', 'manual_grant')),
          description TEXT,
          reference_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- インデックスの作成
        CREATE INDEX IF NOT EXISTS idx_points_history_user_id ON points_history(user_id);
        CREATE INDEX IF NOT EXISTS idx_points_history_created_at ON points_history(created_at);
      `
    })

    if (pointsHistoryError) {
      console.error('Error creating points_history:', pointsHistoryError)
      throw new Error(`Failed to create points_history: ${pointsHistoryError.message}`)
    }

    // 3. plansテーブルの作成
    const { error: plansError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS plans (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          price INTEGER NOT NULL,
          points INTEGER NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (plansError) {
      console.error('Error creating plans:', plansError)
      throw new Error(`Failed to create plans: ${plansError.message}`)
    }

    // 4. point_purchasesテーブルの作成
    const { error: purchasesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS point_purchases (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          plan_id UUID REFERENCES plans(id),
          amount INTEGER NOT NULL,
          points INTEGER NOT NULL,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
          stripe_payment_intent_id VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          completed_at TIMESTAMP WITH TIME ZONE
        );

        -- インデックスの作成
        CREATE INDEX IF NOT EXISTS idx_point_purchases_user_id ON point_purchases(user_id);
        CREATE INDEX IF NOT EXISTS idx_point_purchases_status ON point_purchases(status);
      `
    })

    if (purchasesError) {
      console.error('Error creating point_purchases:', purchasesError)
      throw new Error(`Failed to create point_purchases: ${purchasesError.message}`)
    }

    // 5. 基本プランデータの挿入
    const { error: insertPlansError } = await supabase
      .from('plans')
      .upsert([
        {
          name: 'スタータープラン',
          description: '500ポイント（お試し用）',
          price: 500,
          points: 500,
          is_active: true
        },
        {
          name: 'ベーシックプラン',
          description: '1,000ポイント',
          price: 1000,
          points: 1000,
          is_active: true
        },
        {
          name: 'プレミアムプラン',
          description: '2,500ポイント（25%ボーナス）',
          price: 2000,
          points: 2500,
          is_active: true
        },
        {
          name: 'プロフェッショナルプラン',
          description: '5,500ポイント（38%ボーナス）',
          price: 4000,
          points: 5500,
          is_active: true
        }
      ], {
        onConflict: 'name',
        ignoreDuplicates: false
      })

    if (insertPlansError) {
      console.error('Error inserting plans:', insertPlansError)
      throw new Error(`Failed to insert plans: ${insertPlansError.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'ポイント管理テーブルとプランデータの作成が完了しました。',
      data: {
        tablesCreated: [
          'profiles (current_points, role columns added)',
          'points_history',
          'plans',
          'point_purchases'
        ],
        plansCreated: 4
      }
    })

  } catch (error) {
    console.error('Table creation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
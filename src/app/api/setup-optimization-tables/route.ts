import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const supabase = supabaseServer;

    console.log('Setting up optimization tables...');

    // 1. 既存テーブル拡張
    console.log('1. Extending existing tables...');
    
    // botsテーブルに表示最適化用カラムを追加
    const alterQueries = [
      'ALTER TABLE bots ADD COLUMN IF NOT EXISTS featured_priority INTEGER DEFAULT 0',
      'ALTER TABLE bots ADD COLUMN IF NOT EXISTS is_pickup BOOLEAN DEFAULT false',
      'ALTER TABLE bots ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false',
      'ALTER TABLE bots ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT false',
      'ALTER TABLE bots ADD COLUMN IF NOT EXISTS manual_sort_order INTEGER DEFAULT 0'
    ];

    for (const query of alterQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error) {
        console.error(`Error executing query: ${query}`, error);
      }
    }

    // 2. 新規テーブル作成
    console.log('2. Creating new tables...');

    // bot_usage_stats テーブル
    const { error: usageStatsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS bot_usage_stats (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
          total_uses INTEGER DEFAULT 0,
          unique_users INTEGER DEFAULT 0,
          avg_session_duration INTEGER DEFAULT 0,
          completion_rate DECIMAL(5,2) DEFAULT 0.0,
          user_rating DECIMAL(3,2) DEFAULT 0.0,
          last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
    });

    if (usageStatsError) {
      console.error('Error creating bot_usage_stats table:', usageStatsError);
    }

    // bot_featured_settings テーブル
    const { error: featuredSettingsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS bot_featured_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
          display_type VARCHAR(50) NOT NULL,
          category_id VARCHAR(100),
          priority INTEGER DEFAULT 0,
          start_date DATE,
          end_date DATE,
          is_active BOOLEAN DEFAULT true,
          created_by UUID REFERENCES auth.users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
    });

    if (featuredSettingsError) {
      console.error('Error creating bot_featured_settings table:', featuredSettingsError);
    }

    // bot_user_interactions テーブル
    const { error: interactionsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS bot_user_interactions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id),
          bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
          interaction_type VARCHAR(50) NOT NULL,
          session_duration INTEGER,
          rating INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
    });

    if (interactionsError) {
      console.error('Error creating bot_user_interactions table:', interactionsError);
    }

    // bot_recommendations テーブル
    const { error: recommendationsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS bot_recommendations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          source_bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
          recommended_bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
          recommendation_type VARCHAR(50) NOT NULL,
          similarity_score DECIMAL(5,4) NOT NULL,
          confidence_score DECIMAL(5,4) NOT NULL,
          click_through_rate DECIMAL(5,4) DEFAULT 0.0,
          conversion_rate DECIMAL(5,4) DEFAULT 0.0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(source_bot_id, recommended_bot_id)
        )
      `
    });

    if (recommendationsError) {
      console.error('Error creating bot_recommendations table:', recommendationsError);
    }

    // user_recommendation_feedback テーブル
    const { error: feedbackError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_recommendation_feedback (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id),
          source_bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
          recommended_bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
          action_type VARCHAR(50) NOT NULL,
          session_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `
    });

    if (feedbackError) {
      console.error('Error creating user_recommendation_feedback table:', feedbackError);
    }

    // 3. サンプルデータ挿入
    console.log('3. Inserting sample data...');

    // 既存のボットに新着フラグを設定
    const { error: newFlagError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE bots 
        SET is_new = true 
        WHERE created_at >= NOW() - INTERVAL '7 days'
      `
    });

    if (newFlagError) {
      console.error('Error setting new flags:', newFlagError);
    }

    // 人気ボットにトレンドフラグを設定
    const { error: trendingFlagError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE bots 
        SET is_trending = true 
        WHERE id IN (
          SELECT id FROM bots 
          ORDER BY RANDOM() 
          LIMIT 10
        )
      `
    });

    if (trendingFlagError) {
      console.error('Error setting trending flags:', trendingFlagError);
    }

    // ピックアップボットを設定
    const { error: pickupFlagError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE bots 
        SET is_pickup = true, featured_priority = 100
        WHERE id IN (
          SELECT id FROM bots 
          ORDER BY RANDOM() 
          LIMIT 5
        )
      `
    });

    if (pickupFlagError) {
      console.error('Error setting pickup flags:', pickupFlagError);
    }

    console.log('Optimization tables setup completed successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Optimization tables setup completed successfully' 
    });

  } catch (error) {
    console.error('[SETUP_OPTIMIZATION_TABLES_ERROR]', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const supabase = supabaseServer;

    logger.info('Setting up optimization tables...');

    // 1. 既存テーブル拡張
    logger.info('1. Extending existing tables...');
    
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
        logger.error(`Error executing query: ${query}`, new Error(String(error)));
      }
    }

    // 2. 新規テーブル作成
    logger.info('2. Creating new tables...');

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
      logger.error('Error creating bot_usage_stats table', new Error(String(usageStatsError)));
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
      logger.error('Error creating bot_featured_settings table', new Error(String(featuredSettingsError)));
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
      logger.error('Error creating bot_user_interactions table', new Error(String(interactionsError)));
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
      logger.error('Error creating bot_recommendations table', new Error(String(recommendationsError)));
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
      logger.error('Error creating user_recommendation_feedback table', new Error(String(feedbackError)));
    }

    // 3. サンプルデータ挿入
    logger.info('3. Inserting sample data...');

    // 既存のボットに新着フラグを設定
    const { error: newFlagError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE bots 
        SET is_new = true 
        WHERE created_at >= NOW() - INTERVAL '7 days'
      `
    });

    if (newFlagError) {
      logger.error('Error setting new flags', new Error(String(newFlagError)));
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
      logger.error('Error setting trending flags', new Error(String(trendingFlagError)));
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
      logger.error('Error setting pickup flags', new Error(String(pickupFlagError)));
    }

    logger.info('Optimization tables setup completed successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Optimization tables setup completed successfully' 
    });

  } catch (error) {
    logger.error('[SETUP_OPTIMIZATION_TABLES_ERROR]', new Error(String(error)));
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}




-- ボット表示順序最適化システム用データベース設定
-- 実行順序: 1. 既存テーブル拡張 → 2. 新規テーブル作成 → 3. インデックス作成

-- ========================================
-- 1. 既存テーブル拡張
-- ========================================

-- botsテーブルに表示最適化用カラムを追加
ALTER TABLE bots ADD COLUMN IF NOT EXISTS featured_priority INTEGER DEFAULT 0;
ALTER TABLE bots ADD COLUMN IF NOT EXISTS is_pickup BOOLEAN DEFAULT false;
ALTER TABLE bots ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false;
ALTER TABLE bots ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT false;
ALTER TABLE bots ADD COLUMN IF NOT EXISTS manual_sort_order INTEGER DEFAULT 0;

-- ========================================
-- 2. 新規テーブル作成
-- ========================================

-- ボット利用統計テーブル
CREATE TABLE IF NOT EXISTS bot_usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
  total_uses INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0, -- 秒単位
  completion_rate DECIMAL(5,2) DEFAULT 0.0, -- 会話完了率
  user_rating DECIMAL(3,2) DEFAULT 0.0, -- 平均評価
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ボット特集設定テーブル
CREATE TABLE IF NOT EXISTS bot_featured_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
  display_type VARCHAR(50) NOT NULL, -- 'pickup', 'new', 'trending', 'category_featured'
  category_id VARCHAR(100), -- カテゴリ別設定用
  priority INTEGER DEFAULT 0, -- 表示優先度（高いほど上位）
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユーザー・ボット相互作用テーブル
CREATE TABLE IF NOT EXISTS bot_user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL, -- 'view', 'start_chat', 'complete_chat', 'rate', 'favorite'
  session_duration INTEGER, -- 秒単位
  rating INTEGER, -- 1-5の評価
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ボット推薦テーブル
CREATE TABLE IF NOT EXISTS bot_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
  recommended_bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(50) NOT NULL, -- 'collaborative', 'content_based', 'hybrid'
  similarity_score DECIMAL(5,4) NOT NULL,
  confidence_score DECIMAL(5,4) NOT NULL,
  click_through_rate DECIMAL(5,4) DEFAULT 0.0,
  conversion_rate DECIMAL(5,4) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(source_bot_id, recommended_bot_id)
);

-- ユーザー推薦フィードバックテーブル
CREATE TABLE IF NOT EXISTS user_recommendation_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  source_bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
  recommended_bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- 'view', 'click', 'use', 'dismiss'
  session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. インデックス作成
-- ========================================

-- bot_usage_stats インデックス
CREATE INDEX IF NOT EXISTS idx_bot_usage_stats_bot_id ON bot_usage_stats(bot_id);
CREATE INDEX IF NOT EXISTS idx_bot_usage_stats_total_uses ON bot_usage_stats(total_uses DESC);
CREATE INDEX IF NOT EXISTS idx_bot_usage_stats_user_rating ON bot_usage_stats(user_rating DESC);
CREATE INDEX IF NOT EXISTS idx_bot_usage_stats_last_used ON bot_usage_stats(last_used_at DESC);

-- bot_featured_settings インデックス
CREATE INDEX IF NOT EXISTS idx_bot_featured_settings_bot_id ON bot_featured_settings(bot_id);
CREATE INDEX IF NOT EXISTS idx_bot_featured_settings_display_type ON bot_featured_settings(display_type);
CREATE INDEX IF NOT EXISTS idx_bot_featured_settings_category ON bot_featured_settings(category_id);
CREATE INDEX IF NOT EXISTS idx_bot_featured_settings_priority ON bot_featured_settings(priority DESC);
CREATE INDEX IF NOT EXISTS idx_bot_featured_settings_active ON bot_featured_settings(is_active) WHERE is_active = true;

-- bot_user_interactions インデックス
CREATE INDEX IF NOT EXISTS idx_bot_user_interactions_user_id ON bot_user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_user_interactions_bot_id ON bot_user_interactions(bot_id);
CREATE INDEX IF NOT EXISTS idx_bot_user_interactions_type ON bot_user_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_bot_user_interactions_created_at ON bot_user_interactions(created_at DESC);

-- bot_recommendations インデックス
CREATE INDEX IF NOT EXISTS idx_bot_recommendations_source ON bot_recommendations(source_bot_id);
CREATE INDEX IF NOT EXISTS idx_bot_recommendations_score ON bot_recommendations(similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_bot_recommendations_type ON bot_recommendations(recommendation_type);

-- user_recommendation_feedback インデックス
CREATE INDEX IF NOT EXISTS idx_user_recommendation_feedback_user_id ON user_recommendation_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_recommendation_feedback_source ON user_recommendation_feedback(source_bot_id);
CREATE INDEX IF NOT EXISTS idx_user_recommendation_feedback_action ON user_recommendation_feedback(action_type);

-- ========================================
-- 4. RLS (Row Level Security) 設定
-- ========================================

-- bot_usage_stats RLS
ALTER TABLE bot_usage_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bot_usage_stats_select_policy" ON bot_usage_stats
  FOR SELECT USING (true);

CREATE POLICY "bot_usage_stats_insert_policy" ON bot_usage_stats
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "bot_usage_stats_update_policy" ON bot_usage_stats
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- bot_featured_settings RLS
ALTER TABLE bot_featured_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bot_featured_settings_select_policy" ON bot_featured_settings
  FOR SELECT USING (true);

CREATE POLICY "bot_featured_settings_admin_policy" ON bot_featured_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- bot_user_interactions RLS
ALTER TABLE bot_user_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bot_user_interactions_select_policy" ON bot_user_interactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "bot_user_interactions_insert_policy" ON bot_user_interactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- bot_recommendations RLS
ALTER TABLE bot_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bot_recommendations_select_policy" ON bot_recommendations
  FOR SELECT USING (true);

-- user_recommendation_feedback RLS
ALTER TABLE user_recommendation_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_recommendation_feedback_select_policy" ON user_recommendation_feedback
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user_recommendation_feedback_insert_policy" ON user_recommendation_feedback
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ========================================
-- 5. サンプルデータ挿入（テスト用）
-- ========================================

-- 既存のボットに新着フラグを設定（最近作成されたボット）
UPDATE bots 
SET is_new = true 
WHERE created_at >= NOW() - INTERVAL '7 days';

-- 人気ボットにトレンドフラグを設定（仮の条件）
UPDATE bots 
SET is_trending = true 
WHERE id IN (
  SELECT id FROM bots 
  ORDER BY RANDOM() 
  LIMIT 10
);

-- ピックアップボットを設定（仮の条件）
UPDATE bots 
SET is_pickup = true, featured_priority = 100
WHERE id IN (
  SELECT id FROM bots 
  ORDER BY RANDOM() 
  LIMIT 5
);

-- ========================================
-- 6. 確認クエリ
-- ========================================

-- 設定確認
SELECT 
  'bots' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN is_pickup = true THEN 1 END) as pickup_bots,
  COUNT(CASE WHEN is_new = true THEN 1 END) as new_bots,
  COUNT(CASE WHEN is_trending = true THEN 1 END) as trending_bots
FROM bots

UNION ALL

SELECT 
  'bot_usage_stats' as table_name,
  COUNT(*) as total_records,
  0 as pickup_bots,
  0 as new_bots,
  0 as trending_bots
FROM bot_usage_stats

UNION ALL

SELECT 
  'bot_featured_settings' as table_name,
  COUNT(*) as total_records,
  0 as pickup_bots,
  0 as new_bots,
  0 as trending_bots
FROM bot_featured_settings;


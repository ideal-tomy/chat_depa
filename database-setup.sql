-- ポイント管理システム データベースセットアップ
-- 以下のSQLをSupabaseのSQL Editorで実行してください

-- 1. profilesテーブルにポイント管理カラムを追加
DO $$ 
BEGIN
  -- current_points カラムを追加（存在しない場合）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'current_points'
  ) THEN
    ALTER TABLE profiles ADD COLUMN current_points INTEGER DEFAULT 1000;
    COMMENT ON COLUMN profiles.current_points IS 'ユーザーの現在のポイント残高';
  END IF;

  -- role カラムを追加（存在しない場合）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role VARCHAR(20) DEFAULT 'user';
    COMMENT ON COLUMN profiles.role IS 'ユーザーの権限（user, admin）';
  END IF;
END $$;

-- 2. ポイント履歴テーブルの作成
CREATE TABLE IF NOT EXISTS points_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'purchased', 'manual_grant')),
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ポイント履歴用インデックス
CREATE INDEX IF NOT EXISTS idx_points_history_user_id ON points_history(user_id);
CREATE INDEX IF NOT EXISTS idx_points_history_created_at ON points_history(created_at);
CREATE INDEX IF NOT EXISTS idx_points_history_type ON points_history(transaction_type);

COMMENT ON TABLE points_history IS 'ポイントの増減履歴';
COMMENT ON COLUMN points_history.transaction_type IS 'earned: 獲得, spent: 消費, purchased: 購入, manual_grant: 手動付与';

-- 3. プランテーブルの作成
CREATE TABLE IF NOT EXISTS plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  price INTEGER NOT NULL,
  points INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE plans IS 'ポイント購入プラン';
COMMENT ON COLUMN plans.price IS '価格（円単位）';
COMMENT ON COLUMN plans.points IS '付与されるポイント数';

-- 4. ポイント購入履歴テーブルの作成
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

-- 購入履歴用インデックス
CREATE INDEX IF NOT EXISTS idx_point_purchases_user_id ON point_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_point_purchases_status ON point_purchases(status);
CREATE INDEX IF NOT EXISTS idx_point_purchases_stripe_id ON point_purchases(stripe_payment_intent_id);

COMMENT ON TABLE point_purchases IS 'ポイント購入履歴';
COMMENT ON COLUMN point_purchases.status IS 'pending: 処理中, completed: 完了, failed: 失敗, refunded: 返金';

-- 5. 基本プランデータの挿入
INSERT INTO plans (name, description, price, points, is_active) VALUES
  ('スタータープラン', '500ポイント（お試し用）', 500, 500, true),
  ('ベーシックプラン', '1,000ポイント', 1000, 1000, true),
  ('プレミアムプラン', '2,500ポイント（25%ボーナス）', 2000, 2500, true),
  ('プロフェッショナルプラン', '5,500ポイント（38%ボーナス）', 4000, 5500, true)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  points = EXCLUDED.points,
  is_active = EXCLUDED.is_active;

-- 6. RLS（Row Level Security）ポリシーの設定

-- points_history テーブルのRLS
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のポイント履歴のみ閲覧可能
CREATE POLICY "Users can view their own point history" ON points_history
  FOR SELECT USING (auth.uid() = user_id);

-- システムのみがポイント履歴を挿入可能（API経由）
CREATE POLICY "Service role can insert point history" ON points_history
  FOR INSERT WITH CHECK (true);

-- point_purchases テーブルのRLS
ALTER TABLE point_purchases ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の購入履歴のみ閲覧可能
CREATE POLICY "Users can view their own purchase history" ON point_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- システムのみが購入履歴を挿入・更新可能（API経由）
CREATE POLICY "Service role can manage purchase history" ON point_purchases
  FOR ALL WITH CHECK (true);

-- plans テーブルのRLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- 全ユーザーがアクティブなプランを閲覧可能
CREATE POLICY "Everyone can view active plans" ON plans
  FOR SELECT USING (is_active = true);

-- 7. profilesテーブルのRLS更新（ポイント表示用）
-- 既存のポリシーがある場合は更新、ない場合は作成

-- 自分のプロフィールのみ閲覧可能
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 自分のプロフィールのみ更新可能
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 新規ユーザー登録時のプロフィール作成（トリガーで自動実行されるため）
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
CREATE POLICY "Enable insert for authenticated users only" ON profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 8. 管理者用ポリシー（将来の拡張用）
-- 管理者は全ユーザーのデータを閲覧・操作可能
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all point history" ON points_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all purchase history" ON point_purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- セットアップ完了の確認クエリ
SELECT 
  'セットアップ完了' as status,
  (SELECT COUNT(*) FROM plans) as plans_count,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('points_history', 'point_purchases')) as new_tables_count;
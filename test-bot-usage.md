# 🤖 ボット利用・ポイント管理テスト手順

## 📋 テスト準備完了

### ✅ 作成済みテストアカウント
1. **一般ユーザー**
   - Email: `test@example.com`
   - Password: `testpass123`
   - 初期ポイント: 1000P

2. **管理者ユーザー**
   - Email: `admin@example.com`
   - Password: `adminpass123`
   - 初期ポイント: 5000P

## 🧪 テスト手順

### Step 1: ログイン機能テスト
1. `http://localhost:3000/account/login` にアクセス
2. テストアカウントでログイン
3. マイページでポイント残高確認

### Step 2: 管理者機能テスト
1. 管理者アカウントでログイン
2. `http://localhost:3000/admin/dashboard` にアクセス
3. ユーザー一覧・統計情報確認
4. テストユーザーに手動ポイント付与

### Step 3: ボット利用テスト
```bash
# ボット利用API（要認証トークン）
curl -X POST http://localhost:3000/api/bot/use \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "bot_id": "SOME_BOT_ID",
    "message": "テストメッセージです"
  }'
```

### Step 4: ポイント履歴確認
1. ボット利用後、マイページで残高変更確認
2. `/account/transactions` でポイント履歴確認

## 🔧 追加設定が必要な項目

### Googleログイン設定
1. Supabaseダッシュボード → Authentication → Providers
2. Google Provider を有効化
3. Client ID・Client Secret設定

### GitHub OAuth設定（オプション）
1. GitHub Developer Settings でOAuth App作成
2. Supabaseに認証情報設定

## 🚀 本番デプロイ準備

### 環境変数確認
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Supabase設定確認
- [x] RLS（Row Level Security）設定
- [x] ポイント管理テーブル作成
- [x] 基本プランデータ挿入
- [ ] OAuth Provider設定

### 実装済み機能
- [x] メール/パスワード認証
- [x] ユーザー管理・プロフィール
- [x] ポイント管理・履歴
- [x] 管理者ダッシュボード
- [x] ボット利用・ポイント消費
- [x] 手動ポイント付与
- [x] レスポンシブUI

### 次のステップ
1. OAuth設定完了
2. 本番環境デプロイ
3. 実際のAI API連携（将来）
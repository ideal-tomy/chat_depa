# 🚀 デプロイ チェックリスト

## ✅ **事前準備（完了済み）**

### システム完成度
- [x] **認証システム**: メール/パスワード認証、OAuth対応
- [x] **ユーザー管理**: プロフィール、権限管理
- [x] **ポイント管理**: 残高、履歴、消費、付与
- [x] **ボット機能**: 一覧、利用、ポイント消費
- [x] **管理者機能**: ダッシュボード、ユーザー管理、ポイント付与
- [x] **レスポンシブUI**: PC・モバイル対応

### テストアカウント作成済み
- **一般ユーザー**: `test@example.com` / `testpass123` (1000P)
- **管理者**: `admin@example.com` / `adminpass123` (5000P)

## 🔧 **必要な手動作業**

### 1. Supabase設定（必須）
```sql
-- SQL Editorで実行
-- create-auth-trigger.sql の内容を実行
-- プロフィール自動作成トリガー設定
```

### 2. OAuth設定（推奨）
#### Google OAuth
1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクト作成
2. OAuth 2.0 クライアント ID作成
3. 認証済みリダイレクト URI: `YOUR_SUPABASE_URL/auth/v1/callback`
4. Supabase → Authentication → Providers → Google で設定

#### GitHub OAuth（オプション）
1. [GitHub Developer Settings](https://github.com/settings/developers) でOAuth App作成
2. Authorization callback URL: `YOUR_SUPABASE_URL/auth/v1/callback`
3. Supabase → Authentication → Providers → GitHub で設定

## 📦 **デプロイ手順**

### Vercel デプロイ（推奨）
```bash
# 1. Vercelアカウント作成・CLI インストール
npm i -g vercel

# 2. プロジェクトルートで
vercel

# 3. 環境変数設定
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SITE_URL

# 4. 再デプロイ
vercel --prod
```

### Netlify デプロイ
```bash
# 1. ビルド
npm run build

# 2. Netlify CLI
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=.next

# 3. 環境変数設定（Netlify管理画面で）
```

## 🔒 **環境変数設定**

### 本番環境で設定が必要
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🧪 **デプロイ後テスト**

### 1. 基本機能テスト
- [ ] ホームページ表示
- [ ] ユーザー登録・ログイン
- [ ] マイページ表示
- [ ] ボット一覧表示

### 2. ポイント機能テスト
- [ ] ポイント残高表示
- [ ] ボット利用・ポイント消費
- [ ] ポイント履歴表示
- [ ] ポイント購入画面

### 3. 管理者機能テスト
- [ ] 管理者ダッシュボード
- [ ] ユーザー一覧
- [ ] 手動ポイント付与

### 4. OAuth テスト（設定した場合）
- [ ] Googleログイン
- [ ] GitHubログイン

## 🚨 **重要な注意事項**

### セキュリティ
- [ ] 本番環境でRLS（Row Level Security）有効化確認
- [ ] Service Role Key の適切な設定
- [ ] OAuth リダイレクトURL の正確な設定

### パフォーマンス
- [ ] 画像最適化の確認
- [ ] API レスポンス時間の確認
- [ ] モバイル表示の確認

### 運用
- [ ] エラー監視設定（Sentry等）
- [ ] 分析ツール設定（Google Analytics等）
- [ ] バックアップ戦略の確認

## 📋 **完成後の機能一覧**

### ユーザー向け機能
- ✅ ユーザー登録・ログイン（メール/OAuth）
- ✅ プロフィール管理
- ✅ ポイント残高表示・履歴
- ✅ ボット一覧・検索・フィルター
- ✅ ボット利用・ポイント消費
- ✅ ポイント購入（UI準備済み、Stripe連携は将来）

### 管理者向け機能
- ✅ 管理者ダッシュボード
- ✅ ユーザー管理・検索
- ✅ 手動ポイント付与
- ✅ 統計情報表示

### 技術基盤
- ✅ Next.js 14 (App Router)
- ✅ Supabase (PostgreSQL + Auth)
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ レスポンシブデザイン

## 🔮 **将来の拡張計画**
- Stripe決済連携
- 実際のAI API連携（OpenAI等）
- チャット履歴保存
- ボットカスタマイズ機能
- 使用統計・分析機能

---

🎉 **チャットボット部門システム - デプロイ準備完了！**
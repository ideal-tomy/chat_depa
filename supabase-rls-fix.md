# Supabase Row Level Security (RLS) 修正方法

## 問題
`new row violates row-level security policy for table "bots"` エラーが発生

## 解決方法

### 方法1: 手動でSupabase管理画面から RLS を一時的に無効化

1. Supabaseの管理画面にアクセス
   - URL: https://fcwostmctjnekjymfinv.supabase.co
2. 「Database」タブ → 「Tables」
3. `bots` テーブルを選択
4. 「RLS」タブで一時的に無効化

### 方法2: サービスロールキーの追加

`.env.local` ファイルに以下を追加:
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 方法3: デバッグ用のテストボットで確認

最小限のテストボットでRLSポリシーをテスト

### 推奨する作業手順

1. まず既存のサンプルボットが存在するかSupabase管理画面で確認
2. RLSを一時的に無効化
3. ボットデータを登録
4. 登録完了後、必要に応じてRLSを再有効化
5. 適切なポリシーを設定

## 現在の状況確認用コマンド

```bash
# 既存データの確認
curl -X GET http://localhost:3000/api/debug-bots

# 単一ボットでのテスト登録
curl -X POST http://localhost:3000/api/register-single-bot
```
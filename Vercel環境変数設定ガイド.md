# Vercel環境変数設定ガイド

## 必要な環境変数

Vercelでデプロイを成功させるため、以下の環境変数を設定してください：

### 1. Supabase関連
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. OpenAI関連（チャット機能用）
```
OPENAI_API_KEY=sk-...
```

### 3. Next.js関連
```
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app.vercel.app
```

## 設定手順

### ステップ1: Vercel管理画面にアクセス
1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. プロジェクト「chat_depa」を選択

### ステップ2: 環境変数の設定
1. 「Settings」タブをクリック
2. 左サイドバーから「Environment Variables」を選択
3. 「Add New」ボタンをクリック
4. 上記の環境変数を一つずつ追加

### ステップ3: 注意点
- `NEXT_PUBLIC_`で始まる変数は、クライアント側でも利用可能です
- `SUPABASE_SERVICE_ROLE_KEY`は管理者権限のキーなので、慎重に扱ってください
- 全ての環境変数を設定後、再デプロイが必要です

### ステップ4: 値の取得方法

#### Supabase
1. [Supabase Dashboard](https://app.supabase.com/)にログイン
2. プロジェクトを選択
3. 「Settings」→「API」で以下を確認：
   - `NEXT_PUBLIC_SUPABASE_URL`: URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon public
   - `SUPABASE_SERVICE_ROLE_KEY`: service_role

#### OpenAI
1. [OpenAI Platform](https://platform.openai.com/)にログイン
2. 「API Keys」セクションで新しいキーを作成

#### NextAuth
- `NEXTAUTH_SECRET`: ランダムな文字列を生成（32文字以上推奨）
- `NEXTAUTH_URL`: デプロイ先のURL（例：https://chat-depa.vercel.app）

## 設定完了後の確認

環境変数設定後、以下を確認してください：

1. **デプロイ成功**: ビルドエラーがないか
2. **データベース接続**: ボット一覧が表示されるか
3. **認証機能**: ログイン・ログアウトが動作するか
4. **ポイント機能**: ポイント表示・消費が正常か

---

**重要**: 環境変数の値は外部に漏らさないよう注意してください。特にサービスロールキーは強力な権限を持ちます。

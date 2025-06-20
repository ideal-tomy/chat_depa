create-next-app の -e フラグを使うと、Next.js の公式 Examples リポジトリからテンプレートを丸ごとクローンしてプロジェクトを作成できます。with-supabase テンプレートを選ぶと、認証まわりのセットアップが一瞬で scaffold されます。

使い方例
bash
コピーする
編集する
# プロジェクトを with-supabase テンプレートで作成
npx create-next-app@latest my-chat-dept \
  -e with-supabase
cd my-chat-dept
-e with-supabase で “with-supabase” Example を指定

GitHub の vercel/next.js/examples/with-supabase がベース

scaffold される主な内容
@supabase/supabase-js の導入＆初期化

lib/supabaseClient.ts で createClient() を呼び出し

Auth フロー

/pages/api/auth/[...supabase].ts で認証用 API Route

サインイン／サインアップ／サインアウトのエンドポイント

Auth ガード付きサンプルページ

pages/profile.tsx など、ログイン必須ページの雛形

環境変数サンプル

.env.local.example に NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 設定例

セットアップ手順
環境変数の設定

env
コピーする
編集する
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
依存関係インストール & 起動

bash
コピーする
編集する
npm install
npm run dev
ブラウザで http://localhost:3000 を開くと、

サインアップ／サインインボタン

認証後に表示されるサンプルページ
がすでに動作します。

まとめ
npx create-next-app -e with-supabase で 認証まわりが丸ごと用意 される

あとは自分のチャットロジックや UI を追加していくだけ

これをベースに Supabase + Next.js の開発をスタートするのが超効率的ですよ！
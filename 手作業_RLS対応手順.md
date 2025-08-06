# 🚨 手作業必須：Supabase Row Level Security 対応

## 現在の状況
- ✅ Supabase接続OK
- ✅ データ読み取りOK  
- ❌ データ挿入でRLSエラー
- ✅ 既存ボット2件確認済み（サンプルBot、ハラスメント命名おじさん）

## 【手作業必須】Supabase管理画面での作業

### ステップ1: Supabase管理画面にアクセス
1. ブラウザで以下URLにアクセス：
   ```
   https://fcwostmctjnekjymfinv.supabase.co
   ```

### ステップ2: RLSの一時的な無効化
1. 左メニュー「Database」をクリック
2. 「Tables」タブを選択
3. `bots` テーブルをクリック
4. 右上の「⚙️ Settings」ボタンをクリック
5. 「Row Level Security」セクションで **「Enable RLS」を一時的にOFF** にする

### ステップ3: サービスロールキーの取得（推奨）
1. 左メニュー「Settings」→「API」
2. 「Project API keys」セクション
3. `service_role` キーをコピー
4. `.env.local` ファイルに以下を追加：
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5...
   ```

## 作業完了後の確認手順

以下のコマンドでデータ登録をテスト：

```bash
# 1. テストボット挿入の確認
curl -X POST http://localhost:3000/api/debug-supabase

# 2. 成功したら全117件のボット登録実行
curl -X POST http://localhost:3000/api/register-csv-bots

# 3. 登録結果の確認
curl -X GET http://localhost:3000/api/debug-supabase
```

## 完了チェックリスト

- [ ] Supabase管理画面にアクセス完了
- [ ] RLS一時無効化 または サービスロールキー追加
- [ ] テストボット挿入成功確認
- [ ] 全117件ボット登録実行
- [ ] サイトでボット表示確認
- [ ] 必要に応じてRLS再有効化

---

**重要**: セキュリティのため、データ登録完了後はRLSを再度有効化し、適切なポリシーを設定してください。

# Supabase設定仕様書

## 1. はじめに

本ドキュメントは、「chat_depa」プロジェクトにおけるSupabaseの各種設定を定義するものです。
データベース、認証、ストレージ、その他関連機能のセットアップと運用に関する指針を定めます。

---

## 2. プロジェクト基本設定

- **プロジェクト名**: `chat-depa`
- **リージョン**: アジアパシフィック (東京) `ap-northeast` を推奨
- **料金プラン**: Freeプランから開始し、利用状況に応じてProプランへの移行を検討

---

## 3. データベース (Database)

### 3.1. テーブル設計

主要なテーブルのスキーマを以下のように定義します。

#### a. `profiles`
Supabaseの`auth.users`テーブルと連動するユーザープロフィール情報。

| カラム名      | データ型                | 説明                                   | 制約                  |
| :------------ | :---------------------- | :------------------------------------- | :-------------------- |
| `id`          | `uuid`                  | ユーザーID                             | Primary Key, `auth.users.id`への参照 |
| `username`    | `text`                  | 表示名                                 | `NOT NULL`            |
| `avatar_url`  | `text`                  | アバター画像のURL                      |                       |
| `created_at`  | `timestamp with time zone` | 作成日時                               | `default now()`       |

#### b. `bots`
提供するチャットボットの情報。

| カラム名            | データ型                | 説明                                   | 制約                  |
| :------------------ | :---------------------- | :------------------------------------- | :-------------------- |
| `id`                | `uuid`                  | ボットID                               | Primary Key, `default gen_random_uuid()` |
| `name`              | `text`                  | ボット名                               | `NOT NULL`            |
| `description`       | `text`                  | ボットの説明文                         |                       |
| `avatar_url`        | `text`                  | ボットのアバター画像のURL              |                       |
| `category`          | `text`                  | カテゴリ（例: 仕事効率化, 娯楽）       |                       |
| `can_upload_image`  | `boolean`               | 画像アップロード機能の有無             | `default false`       |
| `can_send_file`     | `boolean`               | ファイル送信機能の有無                 | `default false`       |
| `created_at`        | `timestamp with time zone` | 作成日時                               | `default now()`       |

#### c. `chats`
ユーザーとボットのチャットセッション。

| カラム名      | データ型                | 説明                                   | 制約                  |
| :------------ | :---------------------- | :------------------------------------- | :-------------------- |
| `id`          | `uuid`                  | チャットID                             | Primary Key, `default gen_random_uuid()` |
| `user_id`     | `uuid`                  | ユーザーID                             | `profiles.id`へのFK   |
| `bot_id`      | `uuid`                  | ボットID                               | `bots.id`へのFK       |
| `title`       | `text`                  | チャットのタイトル（履歴表示用）       |                       |
| `created_at`  | `timestamp with time zone` | 作成日時                               | `default now()`       |

#### d. `chat_messages`
個別のチャットメッセージ。

| カラム名      | データ型                | 説明                                   | 制約                  |
| :------------ | :---------------------- | :------------------------------------- | :-------------------- |
| `id`          | `bigint`                | メッセージID                           | Primary Key, `identity` |
| `chat_id`     | `uuid`                  | チャットID                             | `chats.id`へのFK      |
| `role`        | `text`                  | 送信者 (`user` または `assistant`)     | `NOT NULL`            |
| `content`     | `text`                  | メッセージ内容                         |                       |
| `created_at`  | `timestamp with time zone` | 作成日時                               | `default now()`       |

### 3.2. 行単位セキュリティ (Row Level Security - RLS)

**原則として、すべてのテーブルでRLSを有効化します。**
これにより、デフォルトでデータへのアクセスが拒否され、意図しないデータ漏洩を防ぎます。

#### 設定ポリシー例

- **`profiles`テーブル:**
  - `SELECT`: ログインしているユーザーは、自身のプロフィール情報のみ閲覧可能。
  - `UPDATE`: ログインしているユーザーは、自身のプロフィール情報のみ更新可能。

- **`chats`テーブル:**
  - `SELECT`: ログインしているユーザーは、自身の`user_id`に紐づくチャットのみ閲覧可能。
  - `INSERT`: ログインしているユーザーは、自身の`user_id`を持つチャットのみ作成可能。

- **`chat_messages`テーブル:**
  - `SELECT`: ユーザーは、自身が参加しているチャットのメッセージのみ閲覧可能。（`chats`テーブルとのJOINが必要）
  - `INSERT`: ユーザーは、自身が参加しているチャットにのみメッセージを投稿可能。

- **`bots`テーブル:**
  - `SELECT`: 全てのユーザー（非ログイン含む）が閲覧可能。（ボット一覧表示のため）

---

## 4. 認証 (Authentication)

### 4.1. 認証プロバイダー

- **Email/Password**: 標準のサインアップ、ログイン、パスワードリセット機能を有効化。
- **Social Providers (推奨)**:
  - **Google**: 有効化を推奨。多くのユーザーが利用可能。
  - **GitHub**: 開発者向けに有効化を検討。

### 4.2. 認証設定

- **メールテンプレート**: 必要に応じて、確認メールやパスワードリセットメールの文面をカスタマイズ。
- **リダイレクトURL**:
  - 開発環境: `http://localhost:3000/**`
  - 本番環境: `https://<本番ドメイン>/**`
  を適宜追加する。

---

## 5. ストレージ (Storage)

### 5.1. バケット (Buckets)

- **`bot_avatars` (公開バケット)**
  - **目的**: ボットのアイコン画像を格納。
  - **公開設定**: Public（URLを知っていれば誰でもアクセス可能）。
  - **RLS**: 不要。

- **`user_uploads` (非公開バケット)**
  - **目的**: ユーザーがチャットでアップロードした画像やファイル（領収書など）を格納。
  - **公開設定**: Private。
  - **RLS**: 必須。

### 5.2. ストレージポリシー (RLS for Storage)

- **`user_uploads`バケットのポリシー:**
  - `SELECT`: ログインしているユーザーは、自身の`user_id`に紐づくフォルダ/ファイルのみ閲覧可能。
  - `INSERT`: ログインしているユーザーは、自身の`user_id`に紐づくフォルダにのみアップロード可能。
  - `UPDATE`/`DELETE`: ログインしているユーザーは、自身のファイルのみ更新・削除可能。

---

## 6. 環境変数設定 (.env.local)

Next.jsアプリケーションのルートディレクトリに`.env.local`ファイルを作成し、以下の変数を設定します。
**このファイルは`.gitignore`に必ず含め、Gitリポジトリにコミットしないでください。**

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

- `YOUR_SUPABASE_PROJECT_URL`: SupabaseプロジェクトのURL (`Project Settings` > `API`で確認)
- `YOUR_SUPABASE_ANON_KEY`: Supabaseプロジェクトの`anon` (public) キー (`Project Settings` > `API`で確認)

---

## 7. 開発と運用

- **ローカル開発**: Supabase CLIの利用を推奨。DBマイグレーションをローカルで管理し、本番環境への適用を安全に行う。
- **バックアップ**: 定期的にSupabaseのダッシュボードから手動バックアップを取得、またはGitHub Actions等で自動化する。

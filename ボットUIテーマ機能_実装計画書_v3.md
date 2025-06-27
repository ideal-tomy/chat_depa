# ボットUIテーマ機能 実装計画書 v3

## 1. はじめに

### 1.1. 目的
本文書は、`ボットUIテーマ機能_実装手順書_v2.md`の実現に向けて、2日間の実装停滞の原因を分析し、より確実で段階的な実装アプローチを提案するものである。

### 1.2. 根本的な課題と方針
停滞の主な原因は、既存のUI構造に新しいアーキテクチャを後付けしようとしたことによる複雑性の増大にあると推測される。

そこで、以下の方針で実装を進める。

- **方針1: 問題の切り分け**: まず、機能の核となる「`ui_theme`に応じたUI切り替え」だけを最小限のコンポーネントで検証し、データ取得と状態伝達を確実にする。
- **方針2: 段階的な構築**: 検証済みの土台の上に、レイアウト、コンポーネント、サービス層を一つずつ段階的に追加していく。

---

## 2. 実装ステップ

### Step 1: データ取得とテーマ切り替えの最小検証

**目的**: 複雑なUIを一旦排除し、「Supabaseから`ui_theme`を取得し、その値に応じて表示内容が変わる」ことだけを確認する。

1.  **ページコンポーネントの準備**
    `app/bots/[botId]/page.tsx` の内容を、以下のようなシンプルなサーバーコンポーネントに置き換える（既存のコードは念のためバックアップを推奨）。

    ```tsx
    // app/bots/[botId]/page.tsx
    import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
    import { cookies } from 'next/headers';

    // 仮の型定義。実際の型に合わせて修正してください。
    type Bot = {
      id: string;
      name: string;
      ui_theme: 'business' | 'variety' | null;
    };

    async function getBot(botId: string): Promise<Bot | null> {
      const supabase = createServerComponentClient({ cookies });
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('id', botId)
        .single();

      if (error) {
        console.error('Error fetching bot:', error);
        return null;
      }
      return data;
    }

    export default async function BotChatPage({ params }: { params: { botId: string } }) {
      const bot = await getBot(params.botId);

      if (!bot) {
        return <div>ボットが見つかりません。</div>;
      }

      // ここでUIテーマを検証
      console.log(`UI Theme for bot ${bot.id}:`, bot.ui_theme);

      return (
        <div>
          <h1>ボット: {bot.name}</h1>
          <p>現在のUIテーマ: <strong>{bot.ui_theme || 'standard'}</strong></p>
          <hr />
          {
            bot.ui_theme === 'business' ? (
              <div style={{ border: '2px solid blue', padding: '10px' }}>
                <h2>Compact UI (仮)</h2>
                <p>ビジネス向けのコンパクトなUIがここに表示されます。</p>
              </div>
            ) : (
              <div style={{ border: '2px solid green', padding: '10px' }}>
                <h2>Standard UI (仮)</h2>
                <p>通常（サイドパネル付き）のUIがここに表示されます。</p>
              </div>
            )
          }
        </div>
      );
    }
    ```

2.  **動作確認**
    -   `ui_theme`が`'business'`のボットと、それ以外のボットのページにそれぞれアクセスする。
    -   ブラウザに「Compact UI (仮)」「Standard UI (仮)」が正しく切り替わって表示されることを確認する。
    -   VSCodeのターミナル（サーバーログ）に`console.log`の内容が出力されていることを確認する。

> **このステップが成功すれば、データ取得とテーマ判定という最も重要な基盤が完成したことになります。**

---

### Step 2: クライアントコンポーネントへの分離

**目的**: 実際のチャット機能（インタラクティブな操作）を実装するために、UI部分をクライアントコンポーネントに切り出す。

1.  **`ChatUI`コンポーネントの作成**
    `src/components/chat/ChatUI.tsx` を作成し、テーマに応じたUIの骨格を実装する。

    ```tsx
    // src/components/chat/ChatUI.tsx
    'use client';

    import { useState } from 'react';

    type ChatUIProps = {
      uiTheme: 'business' | 'variety' | null;
    };

    // 各UIコンポーネントの仮実装
    const ChatWindow = () => <div style={{ flex: 1, backgroundColor: '#f0f0f0' }}>チャットウィンドウ</div>;
    const HistoryPanel = () => <div style={{ width: '300px', backgroundColor: '#e0e0e0' }}>履歴パネル</div>;
    const HistoryToggle = ({ onClick }: { onClick: () => void }) => <button onClick={onClick}>履歴表示</button>;
    const HistoryModal = ({ onClose }: { onClose: () => void }) => (
      <div style={{ position: 'fixed', top: '20%', left: '40%', border: '1px solid black', backgroundColor: 'white', padding: '20px' }}>
        <h2>履歴モーダル</h2>
        <button onClick={onClose}>閉じる</button>
      </div>
    );


    export default function ChatUI({ uiTheme }: ChatUIProps) {
      const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);

      if (uiTheme === 'business') {
        // Compact UI
        return (
          <div>
            <HistoryToggle onClick={() => setHistoryModalOpen(true)} />
            <ChatWindow />
            {isHistoryModalOpen && <HistoryModal onClose={() => setHistoryModalOpen(false)} />}
          </div>
        );
      }

      // Standard UI
      return (
        <div style={{ display: 'flex', height: '100vh' }}>
          <HistoryPanel />
          <ChatWindow />
        </div>
      );
    }
    ```

2.  **ページコンポーネントの更新**
    `page.tsx` から `ChatUI` を呼び出すように変更する。

    ```tsx
    // app/bots/[botId]/page.tsx (更新後)
    // ... (getBot関数などはそのまま)
    import ChatUI from '@/components/chat/ChatUI';

    export default async function BotChatPage({ params }: { params: { botId: string } }) {
      const bot = await getBot(params.botId);

      if (!bot) {
        return <div>ボットが見つかりません。</div>;
      }

      // サーバーコンポーネントで取得したテーマをクライアントコンポーネントに渡す
      return <ChatUI uiTheme={bot.ui_theme} />;
    }
    ```

3.  **動作確認**
    -   ブラウザで、テーマに応じて `Standard UI`（履歴パネルとチャットウィンドウが横並び）と `Compact UI`（履歴表示ボタンとチャットウィンドウ）が切り替わることを確認する。
    -   Compact UIでボタンを押すとモーダルが表示され、閉じれることを確認する。

---

### Step 3: サービス層とContextの導入

**目的**: `ChatUI`とその子コンポーネントがチャット機能（メッセージ送受信など）を利用できるようにする。

1.  **サービスとContextの実装**
    `ボットUIテーマ機能_実装手順書_v2.md` に記載の `ChatService.ts`, `chatServiceImpl.ts`, `ChatProvider.tsx` を実装する。

2.  **`ChatProvider`の適用**
    `ChatUI` コンポーネントを `ChatProvider` でラップする。

    ```tsx
    // src/components/chat/ChatUI.tsx (更新後)
    'use client';

    import { ChatProvider } from '@/contexts/ChatContext';
    // ... 他のimport

    export default function ChatUI({ uiTheme }: ChatUIProps) {
      return (
        <ChatProvider>
          {/* 以前のUIロジックはここに入る */}
          { uiTheme === 'business' ? ( ... ) : ( ... ) }
        </ChatProvider>
      );
    }
    ```

3.  **機能実装**
    -   `ChatWindow`, `HistoryPanel` などのコンポーネント内で `useChat()` フックを使い、メッセージ送信や履歴取得のロジックを実装していく。

---

## 4. 次のアクション

まずは **Step 1** を実行し、テーマの切り替えが正しく動作するかをご確認ください。
このステップが成功すれば、残りの実装はコンポーネントを一つずつ詳細化していく作業となり、見通しが格段に良くなります。

この計画書に沿って進めることで、問題を切り分けながら着実に実装を完了できるはずです。

'use client';

import { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

/**
 * Compact UIで履歴モーダルを開くためのボタンコンポーネント。
 * Hydration Mismatchを回避するための対策が施されている。
 */
export default function HistoryToggle({ onToggle }: { onToggle: () => void; }) {
  const [mounted, setMounted] = useState(false);

  // クライアントサイドでのみ実行されるuseEffectを使い、マウント後に`mounted`をtrueにする
  useEffect(() => setMounted(true), []);

  // mountedがfalseの間（サーバーサイドレンダリング時およびクライアントの初回描画前）は、
  // 実際のボタンと同じ高さを持つプレースホルダーを描画する。
  // これにより、サーバーとクライアントのHTML構造が一致し、エラーを防ぐ。
  if (!mounted) {
    return <div className="h-12 p-2 border-b" aria-hidden="true" />;
  }

  return (
    <div className="border-b">
        <button 
            onClick={onToggle} 
            className="p-3 w-full flex items-center text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
        <span>チャット履歴</span>
        </button>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useChatService } from '../ChatProvider';
import { Message } from '../../../types/types';

interface HistoryPanelProps {
  sessionId: string;
}

export default function HistoryPanel({ sessionId }: HistoryPanelProps) {
  const chatService = useChatService();
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    setIsLoading(true);
    chatService.fetchHistory(sessionId)
      .then(setHistory)
      .catch((err: unknown) => {
        console.error('Failed to fetch history:', err);
        // ここでエラーメッセージをUIに表示することも可能
      })
      .finally(() => setIsLoading(false));
  }, [sessionId, chatService]);

  return (
    <div className="w-1/3 max-w-xs border-r bg-gray-50 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">チャット履歴</h2>
      {isLoading ? (
        <div>履歴を読み込んでいます...</div>
      ) : (
        <ul className="space-y-4">
          {history.map(msg => (
            <li key={msg.id} className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>
              <p className="text-sm text-gray-800">{msg.text}</p>
              <p className="text-xs text-gray-500 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

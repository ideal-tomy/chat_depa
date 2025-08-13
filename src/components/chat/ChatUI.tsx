'use client';

import { useState, useEffect, useCallback } from 'react'; // useCallbackをインポート
import { useSearchParams } from 'next/navigation';
import { useChatService } from './ChatProvider';
import { Message } from '@/types';
import ChatWindow from './ChatWindow';
import HistoryModal from './history/HistoryModal';
import HistoryPanel from './history/HistoryPanel';
import HistoryToggle from './history/HistoryToggle';

interface ChatUIProps {
  botId: string;
  uiTheme: 'business' | 'variety' | null;
}

export default function ChatUI({ botId, uiTheme }: ChatUIProps) {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('message') || '';
  const chatService = useChatService();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);

  // 1. セッションを開始するためのuseEffect
  useEffect(() => {
    let isMounted = true;
    const start = async () => {
      try {
        const id = await chatService.startSession();
        if (isMounted) {
          setSessionId(id);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to initialize session:", error);
        }
      }
    };

    start();

    return () => {
      isMounted = false;
    };
  }, [botId, chatService]);

  // 2. 履歴を取得またはクリアするためのuseEffect
  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;
    const loadHistory = async () => {
      if (uiTheme === 'business') {
        if (isMounted) setMessages([]);
        return;
      }

      try {
        const history = await chatService.fetchHistory(sessionId);
        if (isMounted) {
          setMessages(history);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch history:", error);
        }
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [sessionId, uiTheme, chatService]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!sessionId) return;
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      role: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const botMessage = await chatService.sendMessage(sessionId, text);
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'bot',
        text: 'エラーが発生しました。メッセージを送信できませんでした。',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [chatService, sessionId]); // 依存関係を明記

  if (!sessionId) {
    return <div className="w-full h-[80vh] flex items-center justify-center">セッションを初期化中...</div>;
  }

  // UIテーマに応じたレンダリング
  if (uiTheme === 'business') {
    // Compact UI
    return (
      <div className="flex flex-col h-[80vh] border rounded-lg bg-white shadow-lg">
        <HistoryToggle onToggle={() => setHistoryModalOpen(true)} />
        <div className="flex-grow overflow-hidden">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            initialMessage={initialMessage}
          />
        </div>
        <HistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setHistoryModalOpen(false)}
          sessionId={sessionId}
        />
      </div>
    );
  }

  // Standard UI
  return (
    <div className="flex h-[80vh] border rounded-lg bg-white shadow-lg overflow-hidden">
      <HistoryPanel sessionId={sessionId} />
      <div className="flex-grow">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          initialMessage={initialMessage}
        />
      </div>
    </div>
  );
}

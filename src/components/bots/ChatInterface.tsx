'use client';

import { Bot } from '@/types';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PaperAirplaneIcon, StopIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { supabaseBrowser as supabase } from '@/lib/supabase/browser';
import Link from 'next/link';

interface ChatInterfaceProps {
  bot: Bot;
}

export default function ChatInterface({ bot }: ChatInterfaceProps) {
  const [session, setSession] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setQuestion(message);
    setAnswer('');
    setInputMessage('');
    setIsLoading(true);
    setCurrentResponse('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: message }],
          botId: bot.id,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      if (!response.body) {
        throw new Error('ReadableStream not available');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullResponse = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        setCurrentResponse(fullResponse);
      }

      setAnswer(fullResponse);

    } catch (error) {
      console.error('Error sending message:', error);
      setAnswer('エラーが発生しました。');
    } finally {
      setIsLoading(false);
      setCurrentResponse('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoadingSession(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsLoadingSession(false);

      // セッションチェック後にURLパラメータを処理
      if (session) {
        const initialMessage = searchParams.get('message');
        if (initialMessage) {
          setInputMessage(initialMessage);
        }
      }
    };
    fetchSession();
  }, []); // 依存配列を空にして初回マウント時のみ実行

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [question, answer, currentResponse]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  if (isLoadingSession) {
    return <div className="flex items-center justify-center h-full">読み込み中...</div>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm h-[75vh] max-h-[800px] text-center p-8">
        <h2 className="text-xl font-bold mb-4">ログインが必要です</h2>
        <p className="text-gray-600 mb-6">このボットとチャットするには、ログインまたはアカウント登録が必要です。</p>
        <Link href="/login" legacyBehavior>
          <a className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
            ログイン / 新規登録
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm h-[75vh] max-h-[800px]">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">チャット</h2>
      </div>

      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
        {question && (
          <div className="flex justify-end">
            <div className="px-4 py-2 rounded-lg bg-primary text-white rounded-br-none max-w-lg">
              <p className="text-sm whitespace-pre-wrap">{question}</p>
            </div>
          </div>
        )}

        {(answer || currentResponse) && (
          <div className="flex justify-start">
             <img src={bot.imageUrl || '/images/placeholder.png'} alt={bot.name} className="h-8 w-8 rounded-full mr-2 self-start" />
            <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none max-w-lg">
              <p className="text-sm whitespace-pre-wrap">
                {answer || currentResponse}
                {isLoading && <span className="animate-pulse">▌</span>}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`${bot.name}に質問する...`}
            className="w-full border rounded-lg pr-12 pl-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary resize-none overflow-hidden max-h-40"
            rows={1}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <button 
              type="submit" 
              disabled={!inputMessage.trim() || isLoading}
              className="p-1 rounded-full text-primary disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
         <p className="text-xs text-gray-500 text-center mt-2">
            {bot.costPoints || 0}ポイントが消費されます
          </p>
      </div>
    </div>
  );
}

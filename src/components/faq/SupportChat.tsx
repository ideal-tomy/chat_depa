'use client';

import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { logger } from '@/lib/logger';

interface SupportChatProps {
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function SupportChat(props: any): JSX.Element {
  const { onClose } = props;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      content: 'こんにちは！サポートBotです。どのようなことでお困りですか？お手伝いします。',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 入力フォーカス
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // メッセージ送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // ここでは簡易的な応答をシミュレート
      // 実際の実装ではAPIを呼び出す
      setTimeout(() => {
        let botResponse = '';
        
        // キーワードに基づいた簡易レスポンス
        const userMsg = inputMessage.toLowerCase();
        if (userMsg.includes('ポイント') || userMsg.includes('point')) {
          botResponse = 'ポイントは各ボットの利用やファイル出力機能で消費されます。無料トライアルでは100ポイント、ベーシックプランでは毎月500ポイント、プレミアムプランでは1,200ポイントが付与されます。マイページでポイント残高をご確認いただけます。';
        } else if (userMsg.includes('登録') || userMsg.includes('アカウント作成')) {
          botResponse = '会員登録は簡単です！トップページ右上の「無料登録」ボタンをクリックし、メールアドレスを入力するか、GoogleやGitHubアカウントでのソーシャルログインを選択できます。無料トライアルでは30日間、100ポイントが提供されます。';
        } else if (userMsg.includes('解約') || userMsg.includes('退会')) {
          botResponse = '退会はマイページのアカウント設定から手続きできます。有料プランをご利用中の場合は、まずプランの解約が必要です。解約後も期間終了までサービスをご利用いただけます。';
        } else {
          botResponse = 'ご質問ありがとうございます。より詳しい情報は、FAQページをご確認いただくか、お問い合わせフォームからサポートチームにご連絡ください。具体的な内容があれば、詳しくお答えできます。';
        }
        
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          role: 'bot',
          content: botResponse,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      logger.error('Error sending message', new Error(String(error)));
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* チャットヘッダー */}
      <div className="flex justify-between items-center p-4 bg-primary text-white">
        <h3 className="font-medium">サポートBot</h3>
        <button
          onClick={onClose}
          className="text-white hover:bg-primary-dark rounded-full p-1"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* メッセージエリア */}
      <div className="h-80 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'bot' && (
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center mr-2 flex-shrink-0">
                <span className="text-sm font-bold">B</span>
              </div>
            )}
            
            <div
              className={`max-w-[75%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-primary-light' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            
            {message.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center ml-2 flex-shrink-0">
                <span className="text-sm font-bold">U</span>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-sm font-bold">B</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* 入力フォーム */}
      <div className="p-3 border-t">
        <form onSubmit={handleSubmit} className="flex">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="質問を入力..."
            className="flex-grow border rounded-l-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}


'use client';

import { Bot } from '@/types/types';
import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, PlusIcon, StopIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  bot: Bot;
}

export default function ChatInterface({ bot }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自動スクロール関数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // メッセージが追加されたら自動スクロール
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  // テキストエリアの高さ自動調整
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  // 新しいチャットを開始
  const startNewChat = () => {
    setMessages([]);
    setCurrentResponse('');
    setInputMessage('');
  };

  // ストリーミングを停止
  const stopStreaming = () => {
    // 実装時はAPI接続を中断する処理を追加
    setIsStreaming(false);
    
    // 現在の応答を保存
    if (currentResponse) {
      setMessages(prev => [
        ...prev, 
        { 
          id: `bot-${Date.now()}`, 
          role: 'bot', 
          content: currentResponse, 
          timestamp: new Date() 
        }
      ]);
      setCurrentResponse('');
    }
  };

  // メッセージ送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;
    
    // ユーザーメッセージをチャット履歴に追加
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsStreaming(true);
    
    try {
      // 実際の実装ではここでAPIを呼び出す
      // 今はモックのストリーミングレスポンスをシミュレート
      const mockResponse = `こんにちは！${bot.name}です。あなたのご質問にお答えします。${bot.description}`;
      
      // 文字ごとにストリーミング表示をシミュレート
      let displayedResponse = '';
      
      for (let i = 0; i < mockResponse.length; i++) {
        if (!isStreaming) break;
        
        await new Promise(resolve => setTimeout(resolve, 30));
        displayedResponse += mockResponse[i];
        setCurrentResponse(displayedResponse);
      }
      
      // ストリーミングが完了したらメッセージに追加
      if (isStreaming) {
        setMessages(prev => [
          ...prev, 
          { 
            id: `bot-${Date.now()}`, 
            role: 'bot', 
            content: displayedResponse, 
            timestamp: new Date() 
          }
        ]);
        setCurrentResponse('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm h-[75vh] max-h-[800px]">
      {/* チャットヘッダー */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">チャット</h2>
        <button
          onClick={startNewChat}
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          新規チャット
        </button>
      </div>
      
      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="bg-gray-100 rounded-full p-3 mb-3">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.5 20 9.07 19.714 7.8 19.2L3 20L4.3 16.1C3.5 14.9 3 13.5 3 12C3 7.582 7.03 4 12 4C16.97 4 21 7.582 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-center max-w-sm">
              {bot.name}に質問を入力してください。{bot.instructions}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
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
            </div>
          ))
        )}
        
        {/* ストリーミング中のレスポンス表示 */}
        {currentResponse && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-gray-100 text-gray-800 rounded-lg rounded-tl-none px-4 py-2">
              <div className="whitespace-pre-wrap break-words">{currentResponse}</div>
              <div className="text-xs mt-1 text-gray-500">
                {new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* 自動スクロール用の参照ポイント */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* 入力フォーム */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`${bot.name}に質問する...`}
              className="w-full border rounded-lg pr-16 pl-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary resize-none overflow-hidden max-h-32"
              rows={1}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="absolute right-2 bottom-2">
              {isStreaming ? (
                <button
                  type="button"
                  onClick={stopStreaming}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <StopIcon className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            {bot.costPoints}ポイントが消費されます
          </p>
        </form>
      </div>
    </div>
  );
}

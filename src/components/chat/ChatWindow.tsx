'use client';

import React, { useState, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { Message } from '@/types';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  initialMessage?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading, initialMessage }) => {
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (initialMessage) {
      setInputText(initialMessage);
    }
  }, [initialMessage]);

  const handleSend = () => {
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  // メッセージの有無に応じてチャットエリアの高さを調整
  const hasMessages = messages.length > 0;
  const chatAreaHeight = hasMessages 
    ? 'min-h-[400px] sm:min-h-[500px] md:min-h-[600px]' 
    : 'min-h-[200px] sm:min-h-[250px]';

  return (
    <div className={`flex-1 flex flex-col bg-gray-50 ${chatAreaHeight} transition-all duration-300 ease-in-out`}>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-lg font-medium">チャットを開始しましょう</p>
              <p className="text-sm mt-2">メッセージを送信してボットと会話を始めてください</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border'}`}>
                <p>{msg.text}</p>
                <span className="text-xs text-gray-400 mt-1 block">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        )}
        {isLoading && (
            <div className="flex justify-start mb-4">
                <div className="max-w-md p-3 rounded-lg bg-white border">
                    <p className='animate-pulse'>...</p>
                </div>
            </div>
        )}
      </div>

      <div className="border-t p-4 bg-white">
        <div className="relative flex items-center">
          <textarea
            className="w-full p-4 pr-20 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-200 ease-in-out text-base resize-none shadow-sm"
            rows={2}
            placeholder="メッセージを入力..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className="absolute right-3 bottom-2.5 flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-110 shadow-lg disabled:shadow-none"
            aria-label="メッセージを送信"
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatWindow);

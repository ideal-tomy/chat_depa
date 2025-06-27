'use client';

import { ChatService } from '@/services/chatService';
import { ChatServiceImpl } from '@/services/chatServiceImpl';
import { createContext, useContext, ReactNode, useMemo } from 'react';

const ChatContext = createContext<ChatService | null>(null);

export const ChatProvider = ({ children, botId }: { children: ReactNode; botId: string }) => {
  const service = useMemo(() => new ChatServiceImpl(botId), [botId]);

  return <ChatContext.Provider value={service}>{children}</ChatContext.Provider>;
};

export const useChatService = (): ChatService => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatService must be used within a ChatProvider');
  }
  return context;
};

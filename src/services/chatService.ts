import { Message } from '@/types/types';

export interface ChatService {
  startSession(): Promise<string>;
  sendMessage(sessionId: string, text: string): Promise<Message>;
  fetchHistory(sessionId: string): Promise<Message[]>;
}

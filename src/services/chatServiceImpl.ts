import { ChatService } from './chatService';
import { Message } from '@/types';

/**
 * ChatServiceの汎用的な実装クラス。
 * 実際のAPIエンドポイントと通信する責務を持つ。
 */
export class ChatServiceImpl implements ChatService {
  private botId: string;

  constructor(botId: string) {
    this.botId = botId;
  }

  /**
   * 新しいチャットセッションを開始します。
   * @param botId - 対象のボットID
   * @returns セッションID
   */
  async startSession(): Promise<string> {
    // TODO: 実際のAPIエンドポイントを実装する
    await new Promise(res => setTimeout(res, 200)); // 擬似的なネットワーク遅延
    const sessionId = `session-${Date.now()}`;
    return sessionId;
  }

  /**
   * メッセージを送信し、ボットからの応答を取得します。
   * @param sessionId - 現在のセッションID
   * @param text - ユーザーが入力したテキスト
   * @returns ボットからの応答メッセージ
   */
  async sendMessage(sessionId: string, text: string): Promise<Message> {
    try {
      // TODO: 実際のAPIエンドポイントを実装する
      await new Promise(res => setTimeout(res, 500)); // 擬似的なネットワーク遅延

      const botResponse: Message = {
        id: `msg-${Date.now()}`,
        text: `「${text}」に対するボットからの返信です。`,
        role: 'bot',
        timestamp: new Date(),
      };

      return botResponse;
    } catch (error) {
      // エラーが発生した場合、エラーメッセージを含むMessageオブジェクトを返すか、例外を再スローするかを選択できます。
      // ここでは、ユーザーにエラーを通知するために、エラーメッセージを返します。
      const errorResponse: Message = {
        id: `err-${Date.now()}`,
        text: 'メッセージの送信中にエラーが発生しました。しばらくしてからもう一度お試しください。',
        role: 'system',
        timestamp: new Date(),
      };
      return errorResponse;
    }
  }

  /**
   * 指定されたセッションのチャット履歴を取得します。
   * @param sessionId - 履歴を取得するセッションID
   * @returns メッセージの配列
   */
  async fetchHistory(sessionId: string): Promise<Message[]> {
    // TODO: 実際のAPIエンドポイントを実装する
    await new Promise(res => setTimeout(res, 800)); // 擬似的なネットワーク遅延
    return [
      {
        id: 'hist-1',
        role: 'user',
        text: 'これは過去の質問です。',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
      },
      {
        id: 'hist-2',
        role: 'bot',
        text: 'これは過去の回答です。',
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
      },
    ];
  }
}

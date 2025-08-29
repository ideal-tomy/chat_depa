import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';
export const dynamic = 'force-dynamic'

// OpenAI APIクライアントを作成
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// EdgeランタイムからNode.jsランタイムに変更
// export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // リクエストボディからメッセージとbotIdを取得
    const { messages, botId } = await req.json();

    if (!botId) {
      return new Response('botId is required', { status: 400 });
    }
    if (!messages) {
        return new Response('messages are required', { status: 400 });
    }

    // サーバーサイドでSupabaseクライアントを作成
    const supabase = createRouteHandlerClient({ cookies });

    // Supabaseからボットの指示（システムプロンプト）を取得
    const { data: bot, error } = await supabase
      .from('bots')
      .select('instructions')
      .eq('id', botId)
      .single();

    if (error) {
      logger.error('Error fetching bot from Supabase', new Error(error.message));
      return new Response(`Error fetching bot: ${error.message}`, { status: 500 });
    }
    if (!bot) {
      logger.error(`Bot with id ${botId} not found.`);
      return new Response(`Bot with id ${botId} not found.`, { status: 404 });
    }

    const systemPrompt = {
      role: 'system',
      content: bot.instructions,
    };

    // OpenAIにストリーミング形式でチャット補完をリクエスト
    const response = await openai.chat.completions.create({
      model: "gpt-5-nano", // 正しいモデル名に修正
      stream: true,
      messages: [systemPrompt, ...messages],
    });

    // レスポンスをテキストストリームに変換
    // 型互換性のため一時的にキャスト（ai@3.0.0以降で解決予定）
    const stream = OpenAIStream(response as any);
    
    // ストリームをレスポンスとして返す
    return new StreamingTextResponse(stream);

  } catch (error) {
    logger.error('[CHAT_API_ERROR]', new Error(String(error)));
    // エラー発生時は500エラーを返す
    if (error instanceof OpenAI.APIError) {
        return new Response(error.message, { status: error.status });
    }
    return new Response('An internal error occurred', { status: 500 });
  }
}

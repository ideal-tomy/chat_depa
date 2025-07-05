import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

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
      console.error('Error fetching bot from Supabase:', error);
      return new Response(`Error fetching bot: ${error.message}`, { status: 500 });
    }
    if (!bot) {
      console.error(`Bot with id ${botId} not found.`);
      return new Response(`Bot with id ${botId} not found.`, { status: 404 });
    }

    const systemPrompt = {
      role: 'system',
      content: bot.instructions,
    };

    // OpenAIにストリーミング形式でチャット補完をリクエスト
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // または 'gpt-3.5-turbo'
      stream: true,
      messages: [systemPrompt, ...messages],
    });

    // レスポンスをテキストストリームに変換
    const stream = OpenAIStream(response);
    
    // ストリームをレスポンスとして返す
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error('[CHAT_API_ERROR]', error);
    // エラー発生時は500エラーを返す
    if (error instanceof OpenAI.APIError) {
        return new Response(error.message, { status: error.status });
    }
    return new Response('An internal error occurred', { status: 500 });
  }
}

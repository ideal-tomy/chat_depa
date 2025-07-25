import BotInfoCard from '@/components/bots/BotInfoCard';
import ChatInterface from '@/components/bots/ChatInterface';
import RelatedBots from '@/components/bots/RelatedBots';
import { Bot } from '@/types/types';
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';

interface BotDetailPageProps {
  params: {
    id: string;
  };
}



// DBからBotデータを取得する関数
async function getBotData(id: string): Promise<Bot | null> {
  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    ...data,
    authorIcon: data.author_icon,
    imageUrl: data.image_url,
    useCases: data.use_cases,
    can_upload_image: data.can_upload_image,
    can_send_file: data.can_send_file,
  } as Bot;
}

// DBから関連Botデータを取得する関数
async function getRelatedBots(category: string, currentBotId: string): Promise<Bot[]> {
  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .eq('category', category)
    .neq('id', currentBotId)
    .limit(3);

  if (error || !data) {
    return [];
  }

  return data.map(bot => ({
    ...bot,
    authorIcon: bot.author_icon,
    imageUrl: bot.image_url,
    useCases: bot.use_cases,
  })) as Bot[];
}

export async function generateMetadata(
  { params }: BotDetailPageProps
): Promise<Metadata> {
  const bot = await getBotData(params.id);

  if (!bot) {
    return {
      title: 'Botが見つかりません | Chatbot Department',
      description: 'お探しのBotは見つかりませんでした。',
    };
  }

  return {
    title: `${bot.name} | Chatbot Department`,
    description: bot.description,
  };
}

export default async function BotDetailPage({ params }: BotDetailPageProps) {
  const bot = await getBotData(params.id);

  if (!bot) {
    notFound();
  }

  const relatedBots = await getRelatedBots(bot.category, bot.id);

  return (
    <main className="bg-gray-50 min-h-screen pb-16">
      {/* ヒーローセクション（Bot情報） - スマホ表示用 */}
      <div className="lg:hidden">
        <BotInfoCard bot={bot} />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* サイド情報エリア - PC表示用 */}
          <div className="hidden lg:block order-2 lg:order-1 lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <BotInfoCard bot={bot} />
              <RelatedBots bots={relatedBots} />
            </div>
          </div>

          {/* チャットインターフェースエリア */}
          <div className="order-1 lg:order-2 lg:col-span-2">
            <ChatInterface bot={bot} />
          </div>
        </div>
      </div>
    </main>
  );
}

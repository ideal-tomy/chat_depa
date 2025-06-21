import BotInfoCard from '@/components/bots/BotInfoCard';
import ChatInterface from '@/components/bots/ChatInterface';
import ExportPanel from '@/components/bots/ExportPanel';
import RelatedBots from '@/components/bots/RelatedBots';
import { Bot } from '@/types/types';
import { Metadata } from 'next';

interface BotDetailPageProps {
  params: {
    id: string;
  };
}

// ダミーデータ（実際の実装ではAPIからfetchする）
const dummyBot: Bot = {
  id: "bot1",
  name: "ビジネスメール作成Bot",
  author: "AI Dev Inc.",
  authorIcon: "/icons/author1.png",
  description: "簡単に丁寧なビジネスメールを作成します。挨拶から結びまで、ビジネスシーンに適したメールを各種シチュエーション別に作成できます。",
  category: "ビジネス",
  points: 100,
  imageUrl: "/images/sumple01.png",
  useCases: [
    "取引先へのアポイント依頼",
    "納品遅延の謝罪メール",
    "見積もり提案の送付",
    "会議招集のメール"
  ],
  instructions: "希望する内容、送信相手、目的などを入力してください。より詳細な情報をいただくほど、適切なメールを作成できます。",
  isNew: true,
  isPopular: true
};

// 関連Botのダミーデータ
const relatedBots: Bot[] = [
  {
    id: "bot2",
    name: "議事録作成Bot",
    author: "AI Dev Inc.",
    authorIcon: "/icons/author1.png",
    description: "会議の音声や箇条書きメモから整形された議事録を作成します。",
    category: "ビジネス",
    points: 120,
    imageUrl: "/images/sumple01.png"
  },
  {
    id: "bot3",
    name: "プレゼン資料作成Bot",
    author: "AI Dev Inc.",
    authorIcon: "/icons/author1.png",
    description: "キーポイントから美しいプレゼンテーション資料の構成を提案します。",
    category: "ビジネス",
    points: 150,
    imageUrl: "/images/sumple01.png"
  },
  {
    id: "bot4",
    name: "ビジネス企画書Bot",
    author: "AI Dev Inc.",
    authorIcon: "/icons/author1.png",
    description: "新規事業や企画のアイディアを整理して企画書形式にまとめます。",
    category: "ビジネス",
    points: 200,
    imageUrl: "/images/sumple01.png"
  }
];

export async function generateMetadata(
  { params }: BotDetailPageProps
): Promise<Metadata> {
  // 実際の実装では、paramsのidを使ってBotの情報をfetchする
  const bot = dummyBot;
  
  return {
    title: `${bot.name} | Chatbot Department`,
    description: bot.description,
  };
}

export default function BotDetailPage({ params }: BotDetailPageProps) {
  // 実際の実装では、paramsのidを使ってBotの情報をfetchする
  const botId = params.id;
  const bot = dummyBot;

  return (
    <main className="bg-gray-50 min-h-screen pb-16">
      <BotInfoCard bot={dummyBot} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* サイド情報エリア */}
          <div className="order-2 lg:order-1 lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <BotInfoCard bot={bot} />
              <ExportPanel botId={bot.id} />
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

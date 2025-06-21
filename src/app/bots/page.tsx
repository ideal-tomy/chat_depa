import FilterBarWrapper from '@/components/wrappers/FilterBarWrapper';
import BotCard from '@/components/ui/BotCard';
import { Bot } from '@/types/types';
import { supabase } from '@/lib/supabase/client';

export const metadata = {
  title: 'Bot一覧 | Chatbot Department',
  description: '様々な専門分野のBotをご用意しています。目的に合わせてお選びください。',
};

type CategoryOption = { id: string; name: string };
const categories: CategoryOption[] = [
  { id: 'all', name: 'すべて' },
  { id: 'ビジネス', name: 'ビジネス' },
  { id: 'マーケティング', name: 'マーケティング' },
  { id: 'ライフスタイル', name: 'ライフスタイル' },
  { id: 'プログラミング', name: 'プログラミング' },
  { id: '旅行', name: '旅行' },
  { id: 'デザイン', name: 'デザイン' },
  { id: '学習', name: '学習' },
  { id: 'フィットネス', name: 'フィットネス' },
];

type PointRangeOption = { id: string; name: string; range: [number, number] };
const pointRanges: PointRangeOption[] = [
  { id: '0-99', name: '0-99P', range: [0, 99] },
  { id: '100-199', name: '100-199P', range: [100, 199] },
  { id: '200+', name: '200P〜', range: [200, 100000] },
];

export default async function BotsPage() {
  const { data: botsData, error } = await supabase
    .from('bots')
    .select('*')
    .order('created_at', { ascending: true });

  if (error || !botsData) {
    console.error('Error fetching bots:', error);
    return <div className="text-center py-10">ボットの読み込みに失敗しました。</div>;
  }

  const bots: Bot[] = botsData.map(bot => ({
    ...bot,
    authorIcon: bot.author_icon,
    imageUrl: bot.image_url,
    useCases: bot.use_cases,
  })) as Bot[];
  
  // カテゴリーごとにボットをグループ化
  const botsByCategory: Record<string, Bot[]> = {};
  categories.slice(1).forEach(category => {
    botsByCategory[category.id] = bots.filter(bot => bot.category === category.id);
  });
  
  const pageSize = 12; // 1ページあたりの表示数
  const initialBots = bots.slice(0, pageSize);

  return (
    <main className="bg-gray-50 text-gray-800">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Botストア</h1>
        
        {/* フィルターバー */}
        <div className="mb-8">
          <FilterBarWrapper categories={categories} pointRanges={pointRanges} />
        </div>
        
        {/* Bot一覧（初期表示） */}
        <section className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {initialBots.map((bot) => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
          
          {/* ページネーションコントロール */}
          <div className="mt-10 flex justify-center">
            <nav className="inline-flex space-x-1" aria-label="Pagination">
              <a
                href="#page=1"
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-primary rounded-l hover:bg-primary-dark"
              >
                1
              </a>
              <a
                href="#page=2"
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 hover:bg-gray-50"
              >
                2
              </a>
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300">
                ...
              </span>
            </nav>
          </div>
        </section>
        
        {/* おすすめカテゴリセクション */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center">カテゴリから探す</h2>
          <div className="space-y-16">
            {categories.slice(1, 5).map((category) => (
              <div key={category.id} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold">{category.name}</h3>
                  <a href={`#category=${category.id}`} className="text-primary hover:underline">
                    もっと見る &rarr;
                  </a>
                </div>
                
                {/* カテゴリー別ボットのスライド（横スクロール） */}
                <div className="flex overflow-x-auto pb-6 scrollbar-hide space-x-6">
                  {botsByCategory[category.id]?.map((bot) => (
                    <div key={bot.id} className="w-64 flex-shrink-0">
                      <BotCard bot={bot} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

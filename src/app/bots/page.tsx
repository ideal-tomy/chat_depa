import FilterBarWrapper from '@/components/wrappers/FilterBarWrapper';
import BotCard from '@/components/ui/BotCard';
import CategorySection from '@/components/ui/CategorySection';
import CategoryCarousel from '@/components/ui/CategoryCarousel';
import { Bot, CategoryOption as CategoryType } from '@/types/types';
import { supabase } from '@/lib/supabase/client';

export const metadata = {
  title: 'Bot一覧 | Chatbot Department',
  description: '様々な専門分野のBotをご用意しています。目的に合わせてお選びください。',
};

const categories: CategoryType[] = [
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
    isNew: bot.created_at && new Date(bot.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1週間以内は新着
    isPopular: bot.points > 150, // 仮の基準: 150ポイント以上は人気
    complexity: bot.complexity || 'medium',
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
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 mb-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Botストア</h1>
            <p className="text-xl max-w-2xl mx-auto">あなたの目的に合わせた最適なBotを見つけましょう</p>
          </div>
        </div>
      </section>
    
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* フィルターバー - よりコンパクトに */}
        <div className="mb-6 sticky top-0 z-30 bg-white rounded-lg shadow-md p-3">
          <FilterBarWrapper categories={categories} pointRanges={pointRanges} />
        </div>
        
        {/* 注目のBotセクション - より大きなカード */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">今週のピックアップ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots
              .filter(bot => bot.isPopular)
              .slice(0, 3)
              .map(bot => (
                <div key={bot.id} className="transform transition-all hover:scale-105">
                  <BotCard 
                    bot={bot} 
                    size="large" 
                    isPopular={true}
                    showPreview={true}
                  />
                </div>
              ))}
          </div>
        </section>
        
        {/* 新着Botカルーセル */}
        <section className="mb-6 pb-2">
          <CategorySection
            title="新着Bot"
            viewAllLink="/bots?category=new"
            variant="standard"
          >
            <CategoryCarousel 
              bots={bots.filter(bot => bot.isNew).slice(0, 10)}
              showPreview={true}
            />
          </CategorySection>
        </section>
        
        {/* カテゴリーセクション - 交互に背景色を変えて視覚的メリハリを出す */}
        {categories.slice(1).map((category, index) => {
          // カテゴリーごとに背景色を微妙に変える
          const bgColorClass = index % 2 === 0 ? 'bg-gray-50' : 'bg-white';
          // 各カテゴリーのボット（最大10個まで表示）
          const categoryBots = botsByCategory[category.id]?.slice(0, 10) || [];
          const variant = index % 3 === 0 ? 'compact' : 'standard'; // バリエーションを持たせる
          
          return (
            <CategorySection 
              key={category.id}
              title={category.name}
              viewAllLink={`/bots?category=${category.id}`}
              bgColorClass={bgColorClass}
              variant={variant}
            >
              <CategoryCarousel 
                bots={categoryBots}
                variant={variant}
                showPreview={true}
              />
            </CategorySection>
          );
        })}
        
        {/* スマートなBotたち（レコメンデーションセクション） */}
        <section className="mt-12 mb-10">
          <CategorySection
            title="あなたにおすすめのBot"
            viewAllLink="/bots?recommended=true"
            variant="standard"
            bgColorClass="bg-white"
          >
            <CategoryCarousel 
              bots={bots.slice(0, 12)}
              showPreview={true}
            />
          </CategorySection>
          
          {/* ページネーションコントロール - よりモダンに */}
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
              <a
                href="#page=1"
                className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-l hover:bg-indigo-700"
              >
                1
              </a>
              <a
                href="#page=2"
                className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              >
                2
              </a>
              <span className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                ...
              </span>
            </nav>
          </div>
        </section>
      </div>
      
      {/* UGCセクション（クリエイター作成ボット）の予定地 */}
      <section className="bg-purple-900 py-12 text-white mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bot作成者になりませんか？</h2>
          <p className="mb-6 max-w-2xl mx-auto">あなたのアイデアでBotを作成し、みんなに使ってもらいましょう。利用されるとポイントが還元されます！</p>
          <button className="bg-white text-purple-900 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
            クリエイター登録（準備中）
          </button>
        </div>
      </section>
    </main>
  );
}

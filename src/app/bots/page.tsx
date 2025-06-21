import FilterBarWrapper from '@/components/wrappers/FilterBarWrapper';
import BotCard from '@/components/ui/BotCard';
import { Bot } from '@/types/types';

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

// データ生成用ヘルパー関数
function generateBots(): Bot[] {
  const botData: Bot[] = [
    { id: 'b1', name: 'ビジネスメール作成Bot', description: '丁寧なビジネスメールを瞬時に作成します。', category: 'ビジネス', author: 'AI Dev Inc.', authorIcon: '/icons/author1.png', points: 100, imageUrl: '/images/bot1.jpg', isPopular: true },
    { id: 'b2', name: 'SNS投稿アイデアBot', description: 'バズる投稿のアイデアを無限に生成。', category: 'マーケティング', author: 'Creative AI', authorIcon: '/icons/author2.png', points: 150, imageUrl: '/images/bot2.jpg' },
    { id: 'b3', name: '献立提案Bot', description: '冷蔵庫の中身から今夜の献立を提案します。', category: 'ライフスタイル', author: 'Home Helper', authorIcon: '/icons/author3.png', points: 50, imageUrl: '/images/bot3.jpg', isNew: true },
    { id: 'b4', name: 'Pythonコードデバッガー', description: 'Pythonコードのエラーを特定し修正案を提示。', category: 'プログラミング', author: 'Code Master', authorIcon: '/icons/author4.png', points: 200, imageUrl: '/images/bot4.jpg', isPopular: true },
    { id: 'b5', name: '旅行プランナーBot', description: '予算と日数から最適な旅行プランを作成。', category: '旅行', author: 'Travel AI', authorIcon: '/icons/author5.png', points: 120, imageUrl: '/images/bot5.jpg' },
    { id: 'b6', name: 'ロゴデザインBot', description: '簡単なキーワードからロゴデザインを複数提案。', category: 'デザイン', author: 'Design AI', authorIcon: '/icons/author6.png', points: 300, imageUrl: '/images/bot6.jpg', isNew: true },
    { id: 'b7', name: '英語学習チューター', description: '英会話の練習相手や文法チェックをします。', category: '学習', author: 'Edu AI', authorIcon: '/icons/author7.png', points: 80, imageUrl: '/images/bot7.jpg' },
    { id: 'b8', name: '筋トレメニュー作成Bot', description: 'あなたの目標に合わせた筋トレメニューを作成。', category: 'フィットネス', author: 'Fit AI', authorIcon: '/icons/author8.png', points: 90, imageUrl: '/images/bot8.jpg' },
    // ダミーデータ追加（ページネーション表示用）
    { id: 'b9', name: 'ビジネス分析Bot', description: '会社データを分析しインサイトを抽出します。', category: 'ビジネス', author: 'Analytics Inc', authorIcon: '/icons/author1.png', points: 180, imageUrl: '/images/bot9.jpg', isNew: true },
    { id: 'b10', name: 'インスタポストBot', description: 'インスタ映えする投稿文とハッシュタグ生成。', category: 'マーケティング', author: 'Social Media Pro', authorIcon: '/icons/author2.png', points: 120, imageUrl: '/images/bot10.jpg' },
    { id: 'b11', name: '家計簿アドバイザー', description: '支出を分析して節約アドバイスを提供。', category: 'ライフスタイル', author: 'Finance Helper', authorIcon: '/icons/author3.png', points: 70, imageUrl: '/images/bot11.jpg' },
    { id: 'b12', name: 'JavaScriptヘルパー', description: 'JavaScriptコードの最適化とデバッグを支援。', category: 'プログラミング', author: 'JS Expert', authorIcon: '/icons/author4.png', points: 150, imageUrl: '/images/bot12.jpg' },
    { id: 'b13', name: 'ローカル体験ガイド', description: '観光地の穴場スポットを現地人目線で紹介。', category: '旅行', author: 'Local Guide AI', authorIcon: '/icons/author5.png', points: 110, imageUrl: '/images/bot13.jpg', isPopular: true },
    { id: 'b14', name: 'UIデザイン評価Bot', description: 'UIデザインの使いやすさを評価し改善案を提示。', category: 'デザイン', author: 'UX Master', authorIcon: '/icons/author6.png', points: 200, imageUrl: '/images/bot14.jpg' },
    { id: 'b15', name: '数学問題解決Bot', description: '数学の問題を解き方とともに解説します。', category: '学習', author: 'Math Tutor', authorIcon: '/icons/author7.png', points: 90, imageUrl: '/images/bot15.jpg', isPopular: true },
    { id: 'b16', name: '食事アドバイザー', description: '目標に合わせた食事メニューとアドバイス提供。', category: 'フィットネス', author: 'Nutrition Pro', authorIcon: '/icons/author8.png', points: 85, imageUrl: '/images/bot16.jpg' },
  ];
  
  return botData;
}

export default function BotsPage() {
  // サーバーコンポーネントなのでここでは静的にボットを生成
  // 実際はDBから取得する
  const bots = generateBots();
  
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

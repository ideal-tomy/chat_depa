import HeroSection from '@/components/ui/HeroSection';
import PickUpCarousel from '@/components/ui/PickUpCarousel';
import FilterBarWrapper from '@/components/wrappers/FilterBarWrapper';
import BotCard from '@/components/ui/BotCard';
import FAQAccordion from '@/components/ui/FAQAccordion';
import BlogCard from '@/components/ui/BlogCard';
import { Bot, FaqItem, Post } from '@/types/types';

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

const pickupBots: Bot[] = [
  { id: 'p1', name: 'ビジネスメール作成Bot', description: '丁寧なビジネスメールを瞬時に作成します。', category: 'ビジネス', author: 'AI Dev Inc.', authorIcon: '/icons/author1.png', points: 100, imageUrl: '/images/bot1.jpg' },
  { id: 'p2', name: 'SNS投稿アイデアBot', description: 'バズる投稿のアイデアを無限に生成。', category: 'マーケティング', author: 'Creative AI', authorIcon: '/icons/author2.png', points: 150, imageUrl: '/images/bot2.jpg' },
  { id: 'p3', name: '献立提案Bot', description: '冷蔵庫の中身から今夜の献立を提案します。', category: 'ライフスタイル', author: 'Home Helper', authorIcon: '/icons/author3.png', points: 50, imageUrl: '/images/bot3.jpg' },
  { id: 'p4', name: 'Pythonコードデバッガー', description: 'Pythonコードのエラーを特定し修正案を提示。', category: 'プログラミング', author: 'Code Master', authorIcon: '/icons/author4.png', points: 200, imageUrl: '/images/bot4.jpg' },
];

const allBots: Bot[] = [
  ...pickupBots,
  { id: 'a5', name: '旅行プランナーBot', description: '予算と日数から最適な旅行プランを作成。', category: '旅行', author: 'Travel AI', authorIcon: '/icons/author5.png', points: 120, imageUrl: '/images/bot5.jpg' },
  { id: 'a6', name: 'ロゴデザインBot', description: '簡単なキーワードからロゴデザインを複数提案。', category: 'デザイン', author: 'Design AI', authorIcon: '/icons/author6.png', points: 300, imageUrl: '/images/bot6.jpg' },
  { id: 'a7', name: '英語学習チューター', description: '英会話の練習相手や文法チェックをします。', category: '学習', author: 'Edu AI', authorIcon: '/icons/author7.png', points: 80, imageUrl: '/images/bot7.jpg' },
  { id: 'a8', name: '筋トレメニュー作成Bot', description: 'あなたの目標に合わせた筋トレメニューを作成。', category: 'フィットネス', author: 'Fit AI', authorIcon: '/icons/author8.png', points: 90, imageUrl: '/images/bot8.jpg' },
];

const faqItems: FaqItem[] = [
  { id: 'f1', question: 'ポイントとは何ですか？', answer: 'Botを利用するために必要なポイントです。購入するか、特定のタスクを完了することで獲得できます。' },
  { id: 'f2', question: '無料でも使えますか？', answer: 'はい、一部のBotは無料でご利用いただけます。また、新規登録時にボーナスポイントが付与されます。' },
  { id: 'f3', question: '作成した内容は保存されますか？', answer: 'チャット履歴はアカウントに保存され、いつでも見返すことができます。' },
];

const blogPosts: Post[] = [
  { id: 'b1', title: '最新AIトレンド2024', category: '技術解説', date: '2024-07-20', imageUrl: '/images/blog1.jpg' },
  { id: 'b2', title: 'Chat Depa活用事例集', category: '活用事例', date: '2024-07-18', imageUrl: '/images/blog2.jpg' },
  { id: 'b3', title: 'ポイントのお得な貯め方', category: 'お知らせ', date: '2024-07-15', imageUrl: '/images/blog3.jpg' },
];

export default function Home() {
  return (
    <main className="bg-gray-50 text-gray-800">
      <HeroSection
        title="あなたのAIアシスタントを探そう"
        description="Chat Depaでは、仕事や学習、生活をサポートする多彩なAI Botを提供しています。今すぐお気に入りのBotを見つけましょう。"
        primaryButtonText="無料で始める"
        primaryButtonLink="/signup"
        secondaryButtonText="詳しく見る"
        secondaryButtonLink="/about"
      />

      <div className="container mx-auto px-4 py-16">
        <section id="pickup-bots" className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">おすすめのBot</h2>
          <PickUpCarousel bots={pickupBots} />
        </section>

        <section id="bot-store" className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">Botストア</h2>
          <FilterBarWrapper categories={categories} pointRanges={pointRanges} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
            {allBots.map((bot) => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
        </section>

        <section id="how-to-use" className="mb-20 bg-white p-12 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-10">Chat Depaのかんたんご利用方法</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">1. Botを選ぶ</h3>
              <p>豊富なBotの中から、目的に合ったものを見つけましょう。</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">2. チャットする</h3>
              <p>Botに話しかけるだけで、タスクを自動で実行してくれます。</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">3. 結果を活用</h3>
              <p>生成された文章やデータを、あなたのビジネスや学習に活用できます。</p>
            </div>
          </div>
        </section>

        <section id="news" className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">お知らせ・ブログ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        <section id="faq">
          <h2 className="text-3xl font-bold text-center mb-10">よくある質問</h2>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqItems} />
          </div>
        </section>
      </div>
    </main>
  );
}

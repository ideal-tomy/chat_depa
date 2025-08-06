"use client";

import { useEffect, useState } from 'react';
import HeroSection from '@/components/ui/HeroSection';
import PickUpCarousel from '@/components/ui/PickUpCarousel';
import FilterBarWrapper from '@/components/wrappers/FilterBarWrapper';
import BotCard from '@/components/ui/BotCard';
import CategoryCarousel from '@/components/ui/CategoryCarousel';
import CategorySection from '@/components/ui/CategorySection';
import FAQAccordion from '@/components/ui/FAQAccordion';
import BlogCard from '@/components/ui/BlogCard';
import { Bot, FaqItem, Post } from '@/types/types';
import { supabase } from '@/lib/supabase/client';

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



const faqItems: FaqItem[] = [
  { id: 'f1', question: 'ポイントとは何ですか？', answer: 'Botを利用するために必要なポイントです。購入するか、特定のタスクを完了することで獲得できます。' },
  { id: 'f2', question: '無料でも使えますか？', answer: 'はい、一部のBotは無料でご利用いただけます。また、新規登録時にボーナスポイントが付与されます。' },
  { id: 'f3', question: '作成した内容は保存されますか？', answer: 'チャット履歴はアカウントに保存され、いつでも見返すことができます。' },
];

const blogPosts: Post[] = [
  { id: 'b1', title: '最新AIトレンド2024', category: '技術解説', date: '2024-07-20', imageUrl: '/images/sumple01.png' },
  { id: 'b2', title: 'Chat Depa活用事例集', category: '活用事例', date: '2024-07-18', imageUrl: '/images/sumple02.png' },
  { id: 'b3', title: 'ポイントのお得な貯め方', category: 'お知らせ', date: '2024-07-15', imageUrl: '/images/sumple03.png' },
];

export default function Home() {
  const [pickupBots, setPickupBots] = useState<Bot[]>([]);
  const [allBots, setAllBots] = useState<Bot[]>([]);
  const [categoryBots, setCategoryBots] = useState<Record<string, Bot[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: null as string | null,
    search: '',
    pointRange: null as [number, number] | null,
  });

  useEffect(() => {
    const fetchBots = async () => {
      setLoading(true);
      setError(null);
      let formattedData: Bot[] = [];
      try {
        const { data, error } = await supabase
          .from('bots')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          formattedData = data.map((bot: any) => ({
            ...bot,
            authorIcon: bot.author_icon,
            imageUrl: bot.image_url,
            complexity: ['simple', 'medium', 'advanced'][Math.floor(Math.random() * 3)] as 'simple' | 'medium' | 'advanced',
            isNew: new Date(bot.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
            isPopular: bot.points > 150,
            isUGC: bot.id % 5 === 0
          }));
          
          setAllBots(formattedData);
          setPickupBots(formattedData.slice(0, 6));
          
          const botsByCategory: Record<string, Bot[]> = {};
          formattedData.forEach((bot: Bot) => {
            const category = bot.category || 'その他';
            if (!botsByCategory[category]) {
              botsByCategory[category] = [];
            }
            botsByCategory[category].push(bot);
          });
          
          setCategoryBots(botsByCategory);
        } else {
          console.log('No data from database, using mock data for home page');
          // データベースにデータがない場合はモックデータを使用
          const mockBots: Bot[] = [
            {
              id: 'mock-1',
              name: '補助金書類を提出直前まで作ってくれる君',
              description: '◯年度版の様式2、最新版でいい？」と毎回確認してくる慎重派。実際に叩き台まで作ってくれる。',
              category: 'ビジネス',
              author: 'システム',
              authorIcon: '/images/sumple01.png',
              imageUrl: '/images/sumple01.png',
              points: 120,
              costPoints: 120,
              can_upload_image: false,
              can_send_file: true,
              isNew: true,
              isPopular: false,
              complexity: 'medium'
            },
            {
              id: 'mock-2',
              name: 'SNS投稿アイデアBot',
              description: 'バズる投稿のアイデアを無限に生成。ハッシュタグやトレンドを分析して効果的な投稿をサポート。',
              category: 'マーケティング',
              author: 'システム',
              authorIcon: '/images/sumple02.png',
              imageUrl: '/images/sumple02.png',
              points: 150,
              costPoints: 150,
              can_upload_image: true,
              can_send_file: false,
              isNew: false,
              isPopular: true,
              complexity: 'medium'
            },
            {
              id: 'mock-3',
              name: 'プログラミング学習Bot',
              description: 'コードレビューから学習プランまで、プログラミング学習を総合サポート。初心者から上級者まで対応。',
              category: 'プログラミング',
              author: 'システム',
              authorIcon: '/images/sumple03.png',
              imageUrl: '/images/sumple03.png',
              points: 180,
              costPoints: 180,
              can_upload_image: false,
              can_send_file: true,
              isNew: false,
              isPopular: true,
              complexity: 'advanced'
            }
          ];
          
          setAllBots(mockBots);
          setPickupBots(mockBots.slice(0, 3));
          
          const botsByCategory: Record<string, Bot[]> = {};
          mockBots.forEach((bot: Bot) => {
            const category = bot.category || 'その他';
            if (!botsByCategory[category]) {
              botsByCategory[category] = [];
            }
            botsByCategory[category].push(bot);
          });
          
          setCategoryBots(botsByCategory);
        }
      } catch (err) {
        console.error('Error fetching bots:', err);
        setError('データの取得に失敗しました。モックデータを表示しています。');
        
        // エラーの場合もモックデータを使用
        const mockBots: Bot[] = [
          {
            id: 'mock-1',
            name: '補助金書類を提出直前まで作ってくれる君',
            description: '◯年度版の様式2、最新版でいい？」と毎回確認してくる慎重派。実際に叩き台まで作ってくれる。',
            category: 'ビジネス',
            author: 'システム',
            authorIcon: '/images/sumple01.png',
            imageUrl: '/images/sumple01.png',
            points: 120,
            costPoints: 120,
            can_upload_image: false,
            can_send_file: true,
            isNew: true,
            isPopular: false,
            complexity: 'medium'
          },
          {
            id: 'mock-2',
            name: 'SNS投稿アイデアBot',
            description: 'バズる投稿のアイデアを無限に生成。ハッシュタグやトレンドを分析して効果的な投稿をサポート。',
            category: 'マーケティング',
            author: 'システム',
            authorIcon: '/images/sumple02.png',
            imageUrl: '/images/sumple02.png',
            points: 150,
            costPoints: 150,
            can_upload_image: true,
            can_send_file: false,
            isNew: false,
            isPopular: true,
            complexity: 'medium'
          },
          {
            id: 'mock-3',
            name: 'プログラミング学習Bot',
            description: 'コードレビューから学習プランまで、プログラミング学習を総合サポート。初心者から上級者まで対応。',
            category: 'プログラミング',
            author: 'システム',
            authorIcon: '/images/sumple03.png',
            imageUrl: '/images/sumple03.png',
            points: 180,
            costPoints: 180,
            can_upload_image: false,
            can_send_file: true,
            isNew: false,
            isPopular: true,
            complexity: 'advanced'
          }
        ];
        
        setAllBots(mockBots);
        setPickupBots(mockBots.slice(0, 3));
        
        const botsByCategory: Record<string, Bot[]> = {};
        mockBots.forEach((bot: Bot) => {
          const category = bot.category || 'その他';
          if (!botsByCategory[category]) {
            botsByCategory[category] = [];
          }
          botsByCategory[category].push(bot);
        });
        
        setCategoryBots(botsByCategory);
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, []);
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

        <section id="bot-store" className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Botストア</h2>
            <a href="/bots" className="text-indigo-600 hover:underline">すべて見る →</a>
          </div>
          <FilterBarWrapper 
            categories={categories} 
            pointRanges={pointRanges} 
            filters={filters}
            onFilterChange={setFilters}
          />
          
          {/* 新着ボット */}
          <div className="mt-6 mb-12">
            <CategorySection 
              title="新着のBot" 
              viewAllLink="/bots?category=new"
              variant="standard"
            >
              <CategoryCarousel 
                bots={allBots.filter(bot => bot.isNew).slice(0, 10)} 
                variant="standard" 
              />
            </CategorySection>
          </div>
          
          {/* カテゴリー別ボット */}
          {Object.entries(categoryBots).slice(0, 3).map(([category, bots], index) => (
            <div key={category} className={`mt-10 ${index % 2 === 1 ? 'py-8 bg-gray-100' : ''}`}>
              <CategorySection 
                title={category} 
                viewAllLink={`/bots?category=${category}`}
                variant="standard"
              >
                <CategoryCarousel 
                  bots={bots.slice(0, 8)} 
                  variant="standard" 
                />
              </CategorySection>
            </div>
          ))}
          
          {/* 人気のボット */}
          <div className="mt-10 mb-12">
            <CategorySection 
              title="人気のBot" 
              viewAllLink="/bots?category=popular"
              variant="standard"
            >
              <CategoryCarousel 
                bots={allBots.filter(bot => bot.isPopular).slice(0, 10)} 
                variant="standard" 
              />
            </CategorySection>
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

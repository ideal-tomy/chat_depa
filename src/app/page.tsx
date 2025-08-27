"use client";

import { useEffect, useState } from 'react';
import HeroSection from '@/components/ui/HeroSection';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import PickUpCarousel from '@/components/ui/PickUpCarousel';
import FilterBarWrapper from '@/components/wrappers/FilterBarWrapper';
import BotCard from '@/components/ui/BotCard';
import CategoryCarousel from '@/components/ui/CategoryCarousel';
import DynamicCarousel from '@/components/ui/DynamicCarousel';
import { getNewCategory } from '@/lib/bot-classification';
import CategorySection from '@/components/ui/CategorySection';
import FAQAccordion from '@/components/ui/FAQAccordion';
import BlogCard from '@/components/ui/BlogCard';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { Bot, FaqItem, Post } from '@/types';
import { supabaseBrowser as supabase } from '@/lib/supabase/browser';

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
      
      try {
        // 最適化された表示順序APIを使用
        const response = await fetch('/api/bots/optimized-order?limit=50');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch bots');
        }

        if (data.success && data.bots) {
          const formattedData = data.bots.map((bot: any) => ({
            ...bot,
            authorIcon: bot.author_icon,
            imageUrl: bot.image_url,
            complexity: ['simple', 'medium', 'advanced'][Math.floor(Math.random() * 3)] as 'simple' | 'medium' | 'advanced',
            isNew: new Date(bot.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
            isPopular: bot.points > 150,
            isUGC: bot.id % 5 === 0
          }));
          
          setAllBots(formattedData);
          
          // 注目ボット（管理者指定）を最初に表示
          const featuredBots = formattedData.filter((bot: Bot) => bot.is_pickup);
          setPickupBots(featuredBots.length > 0 ? featuredBots.slice(0, 6) : formattedData.slice(0, 6));
          
          // カテゴリ別に分類
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
          console.log('No data from optimized API, using fallback');
          // フォールバック処理（既存のロジック）
          const { data: fallbackData, error } = await supabase
            .from('bots')
            .select('*')
            .order('created_at', { ascending: true });

          if (error) {
            throw error;
          }

          if (fallbackData && fallbackData.length > 0) {
            const formattedData = fallbackData.map((bot: any) => ({
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
          }
        }
      } catch (error) {
        console.error('Error fetching bots:', error);
        setError('ボットの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, []);
  return (
    <main className="bg-white text-gray-800 relative">
      {/* アニメーション背景 */}
      <AnimatedBackground />
      
      <HeroSection
        title="あなたのAIアシスタントを探そう"
        description="Chat Depaでは、仕事や学習、生活をサポートする多彩なAI Botを提供しています。今すぐお気に入りのBotを見つけましょう。"
        primaryButtonText="無料で始める"
        primaryButtonLink="/signup"
        secondaryButtonText="詳しく見る"
        secondaryButtonLink="/about"
      />

      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 relative z-10">
        <section id="pickup-bots" className="mb-8 sm:mb-12 md:mb-20 bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-10">おすすめのBot</h2>
          <ErrorBoundary>
            <DynamicCarousel 
              displayType="pickup" 
              maxItems={6} 
              showRanking={true}
              title="厳選されたおすすめBot"
              subtitle="管理者が厳選した高品質なボット"
            />
          </ErrorBoundary>
        </section>

        <section id="bot-store" className="mb-6 sm:mb-8 md:mb-10 bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Botストア</h2>
            <a href="/bots" className="text-indigo-600 hover:underline">すべて見る →</a>
          </div>
          <FilterBarWrapper 
            categories={categories} 
            pointRanges={pointRanges} 
            filters={filters}
            onFilterChange={setFilters}
          />
          
          {/* 新着ボット */}
          <div className="mt-2 sm:mt-3 mb-4 sm:mb-6 md:mb-8">
            <ErrorBoundary>
              <DynamicCarousel 
                displayType="new" 
                maxItems={8}
                title="新着のBot"
                subtitle="最近追加されたボット"
              />
            </ErrorBoundary>
          </div>
          
          {/* カテゴリー別ボット（占い系、健康系、偏見系、ビジネス系） */}
          <ErrorBoundary>
            {['占い・スピ系', '健康・運動系', '偏見丸出し系', 'ビジネス系'].map((catName, index) => {
              const bots = allBots.filter(b => getNewCategory(b.category) === catName)
              if (catName === 'ビジネス系') {
                // 真面目のみ
                const { determineDisplayCategory } = require('@/lib/bot-classification')
                return (
                  <div key={catName} className="mt-2 sm:mt-3 md:mt-6">
                    <CategorySection title={catName} viewAllLink={`/bots?category=${encodeURIComponent(catName)}`} variant="standard">
                      <CategoryCarousel bots={bots.filter((b:any)=> determineDisplayCategory(b) === '真面目').slice(0,8)} variant="standard" />
                    </CategorySection>
                  </div>
                )
              }
              return (
                <div key={catName} className="mt-2 sm:mt-3 md:mt-6">
                  <CategorySection title={catName} viewAllLink={`/bots?category=${encodeURIComponent(catName)}`} variant="standard">
                    <CategoryCarousel bots={bots.slice(0,8)} variant="standard" />
                  </CategorySection>
                </div>
              )
            })}
          </ErrorBoundary>
          
          {/* 人気のボット */}
          <div className="mt-2 sm:mt-3 md:mt-6 mb-4 sm:mb-6 md:mb-8">
            <ErrorBoundary>
              <DynamicCarousel 
                displayType="trending" 
                maxItems={10}
                showRanking={true}
                title="人気のBot"
                subtitle="多くのユーザーに利用されているボット"
              />
            </ErrorBoundary>
          </div>
        </section>

        <section id="how-to-use" className="mb-8 sm:mb-12 md:mb-20 bg-white/80 backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-10">Chat Depaのかんたんご利用方法</h2>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">1. Botを選ぶ</h3>
              <p className="text-sm sm:text-base">豊富なBotの中から、目的に合ったものを見つけましょう。</p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">2. チャットする</h3>
              <p className="text-sm sm:text-base">Botに話しかけるだけで、タスクを自動で実行してくれます。</p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">3. 結果を活用</h3>
              <p className="text-sm sm:text-base">生成された文章やデータを、あなたのビジネスや学習に活用できます。</p>
            </div>
          </div>
        </section>

        <section id="news" className="mb-8 sm:mb-12 md:mb-20 bg-white/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-10">お知らせ・ブログ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        <section id="faq" className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-10">よくある質問</h2>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqItems} />
          </div>
        </section>
      </div>
    </main>
  );
}

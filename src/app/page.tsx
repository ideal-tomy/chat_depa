"use client";

import { useState, useEffect } from 'react';
import { Bot } from '@/types';
import { supabaseBrowser as supabase } from '@/lib/supabase/browser';
import PickUpCarousel from '@/components/ui/PickUpCarousel';
import HorizontalCarousel from '@/components/ui/HorizontalCarousel';
import DynamicCarousel from '@/components/ui/DynamicCarousel';

// カテゴリマッピング（旧カテゴリ名 → 新カテゴリ名）
const categoryMapping: Record<string, string> = {
  '占い系': '占い・スピ系',
  'スピリチュアル系': '占い・スピ系',
  '健康系': '健康・運動系',
  '運動系': '健康・運動系',
  'ビジネス系': 'ビジネス系',
  '学習系': '学習系',
  'エンタメ系': 'エンタメ系',
  '生活系': '生活系',
  'その他': 'その他'
};

// 静的ポイント範囲
const staticPointRanges = [
  { id: 'all', name: 'すべてのポイント', range: [0, Infinity] },
  { id: 'free', name: '無料', range: [0, 0] },
  { id: 'low', name: '1-50ポイント', range: [1, 50] },
  { id: 'medium', name: '51-100ポイント', range: [51, 100] },
  { id: 'high', name: '101ポイント以上', range: [101, Infinity] }
];

// 静的並び順
const staticSortOrders = [
  { id: 'popular', name: '人気順' },
  { id: 'newest', name: '新着順' },
  { id: 'points', name: 'ポイント順' }
];

// カテゴリ表示判定関数
function determineDisplayCategory(bot: any): string {
  const category = bot.category || '';
  
  // ビジネス系の判定
  if (category.includes('ビジネス') || 
      category.includes('仕事') || 
      category.includes('業務') ||
      category.includes('契約') ||
      category.includes('申請') ||
      category.includes('行政')) {
    return '真面目';
  }
  
  // その他の判定
  if (category.includes('占い') || category.includes('スピリチュアル')) {
    return '占い・スピ系';
  }
  if (category.includes('健康') || category.includes('運動') || category.includes('栄養')) {
    return '健康・運動系';
  }
  if (category.includes('偏見') || category.includes('丸出し')) {
    return '偏見丸出し系';
  }
  
  return category || 'その他';
}

export default function Home() {
  const [pickupBots, setPickupBots] = useState<Bot[]>([]);
  const [popularBots, setPopularBots] = useState<Bot[]>([]);
  const [newBots, setNewBots] = useState<Bot[]>([]);
  const [allBots, setAllBots] = useState<Bot[]>([]);
  const [categoryBots, setCategoryBots] = useState<Record<string, Bot[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          
          // 人気ボット（利用頻度ベース）
          const trendingBots = formattedData.filter((bot: Bot) => bot.is_trending);
          setPopularBots(trendingBots.length > 0 ? trendingBots.slice(0, 6) : formattedData.slice(6, 12));
          
          // 新着ボット
          const recentBots = formattedData.filter((bot: Bot) => bot.isNew);
          setNewBots(recentBots.length > 0 ? recentBots.slice(0, 6) : formattedData.slice(12, 18));
          
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
            setPopularBots(formattedData.slice(6, 12));
            setNewBots(formattedData.slice(12, 18));
            
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">エラーが発生しました</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* おすすめのBot */}
        {pickupBots.length > 0 && (
          <section className="mb-12">
            <PickUpCarousel title="おすすめのBot" bots={pickupBots} />
          </section>
        )}

        {/* 人気のBot */}
        {popularBots.length > 0 && (
          <section className="mb-12">
            <DynamicCarousel
              displayType="trending"
              title="人気のBot"
              subtitle="多くのユーザーに利用されているボット"
              maxItems={6}
              className="mb-8"
            />
          </section>
        )}

        {/* 新着Bot */}
        {newBots.length > 0 && (
          <section className="mb-12">
            <DynamicCarousel
              displayType="new"
              title="新着Bot"
              subtitle="最近追加されたボット"
              maxItems={6}
              className="mb-8"
            />
          </section>
        )}

        {/* カテゴリ別セクション */}
        {Object.entries(categoryBots).map(([category, bots]) => (
          bots.length > 0 && (
            <section key={category} className="mb-12">
              <HorizontalCarousel
                title={category}
                bots={bots.slice(0, 10)}
                autoScroll={false}
              />
            </section>
          )
        ))}

        {/* 利用方法セクション */}
        <section className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Chat Depaのかんたんご利用方法</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Botを選ぶ</h3>
              <p className="text-gray-600">目的に合ったBotをカテゴリやキーワードから探します</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">チャットする</h3>
              <p className="text-gray-600">Botと対話して、必要な情報やサポートを受けます</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">結果を活用</h3>
              <p className="text-gray-600">Botからの回答や提案を実際の業務や生活に活用します</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

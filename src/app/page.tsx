"use client";

import { useState, useEffect } from 'react';
import { Bot } from '@/types';
import { supabaseBrowser as supabase } from '@/lib/supabase/browser';
import PickUpCarousel from '@/components/ui/PickUpCarousel';
import HorizontalCarousel from '@/components/ui/HorizontalCarousel';
import DynamicCarousel from '@/components/ui/DynamicCarousel';

// カテゴリマッピング（データベースのカテゴリ名 → 表示用カテゴリ名）
const categoryMapping: Record<string, string> = {
  'プレゼン改善系': 'プレゼンテーション',
  '数学特化': '学習・教育',
  '言語化トレーニング系': 'コミュニケーション',
  '申請系': '手続き・申請',
  '栄養管理': '健康・栄養',
  '契約系': 'ビジネス・契約',
  '法解釈系': '法律・法務',
  '食事指導': '健康・栄養',
  '栄養素解説': '健康・栄養',
  '栄養偏重系': '健康・栄養',
  '行政書士系': '手続き・申請',
  '学習': '学習・教育',
  'テスト': 'その他'
};

// 表示用カテゴリに変換する関数
function mapToDisplayCategory(dbCategory: string): string {
  return categoryMapping[dbCategory] || 'その他';
}

// 表示用カテゴリをグループ化する関数
function groupByDisplayCategory(bots: Bot[]): Record<string, Bot[]> {
  const grouped: Record<string, Bot[]> = {};
  
            bots.forEach((bot: Bot) => {
    const displayCategory = mapToDisplayCategory(bot.category || '');
    if (!grouped[displayCategory]) {
      grouped[displayCategory] = [];
    }
    grouped[displayCategory].push(bot);
  });
  
  return grouped;
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
          
          // おすすめボット（最初の6件）
          setPickupBots(formattedData.slice(0, 6));
          
          // 人気ボット（次の6件）
          setPopularBots(formattedData.slice(6, 12));
          
          // 新着ボット（1週間以内のもの）
          const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const recentBots = formattedData.filter(bot => new Date(bot.created_at) > oneWeekAgo);
          setNewBots(recentBots.slice(0, 6));
          
          // カテゴリ別に分類（表示用カテゴリ名でグループ化）
          const groupedBots = groupByDisplayCategory(formattedData);
          setCategoryBots(groupedBots);
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
            
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const recentBots = formattedData.filter(bot => new Date(bot.created_at) > oneWeekAgo);
            setNewBots(recentBots.slice(0, 6));
            
            const groupedBots = groupByDisplayCategory(formattedData);
            setCategoryBots(groupedBots);
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

"use client";

import { useState, useEffect } from 'react';
import { Bot } from '@/types';
import { supabaseBrowser as supabase } from '@/lib/supabase/browser';
import { logger } from '@/lib/logger';
import PickUpCarousel from '@/components/ui/PickUpCarousel';
import HorizontalCarousel from '@/components/ui/HorizontalCarousel';
import DynamicCarousel from '@/components/ui/DynamicCarousel';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import ActionArea from '@/components/ui/ActionArea';

export default function Home(): JSX.Element {
  const [pickupBots, setPickupBots] = useState<Bot[]>([]);
  const [popularBots, setPopularBots] = useState<Bot[]>([]);
  const [newBots, setNewBots] = useState<Bot[]>([]);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBots = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 最適化された表示順序APIを使用
        const response = await fetch('/api/bots/optimized-order?limit=100');
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
          
          // おすすめボット（最初の6件）
          setPickupBots(formattedData.slice(0, 6));
          
          // 人気ボット（次の6件、おすすめと重複しない）
          setPopularBots(formattedData.slice(6, 12));
          
          // 新着ボット（1週間以内のもの、他のセクションと重複しない）
          const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const recentBots = formattedData.filter((bot: any) => new Date(bot.created_at) > oneWeekAgo);
          
          // おすすめと人気で使用されていないボットから選択
          const usedBotIds = new Set([...formattedData.slice(0, 12).map((bot: any) => bot.id)]);
          
          // 指定された新着ボットを優先的に表示
          const specifiedNewBots = [
            'ハラスメント命名おじさん',
            '九星気学の方位ガチ勢',
            '食事を全肯定する管理栄養士（自称）'
          ];
          
          // 指定されたボットを最初に追加
          let finalNewBots = formattedData
            .filter((bot: any) => specifiedNewBots.includes(bot.name) && !usedBotIds.has(bot.id))
            .slice(0, 3);
          
          // 新着ボットが少ない場合は、作成日順で上位のボットを追加
          if (finalNewBots.length < 6) {
            const remainingBots = formattedData
              .filter((bot: any) => !usedBotIds.has(bot.id) && !finalNewBots.some((newBot: any) => newBot.id === bot.id))
              .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .slice(0, 6 - finalNewBots.length);
            finalNewBots = [...finalNewBots, ...remainingBots];
          }
          
          setNewBots(finalNewBots);
          

        } else {
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
            
            setPickupBots(formattedData.slice(0, 6));
            setPopularBots(formattedData.slice(6, 12));
            
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const recentBots = formattedData.filter((bot: any) => new Date(bot.created_at) > oneWeekAgo);
            setNewBots(recentBots.slice(0, 6));
            

          }
        }
      } catch (error) {
        logger.error('Error fetching bots', error instanceof Error ? error : new Error(String(error)));
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
    <main className="min-h-screen bg-gray-50 relative">
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* おすすめのBot */}
        {pickupBots.length > 0 && (
          <section className="mb-2">
            <PickUpCarousel title="おすすめのBot" bots={pickupBots} />
          </section>
        )}

        {/* 仕切り線 */}
        <div className="border-t border-gray-200 mb-2"></div>

        {/* 人気のBot */}
        {popularBots.length > 0 && (
          <section className="mb-2">
            <DynamicCarousel
              displayType="trending"
              title="人気のBot"
              subtitle="多くのユーザーに利用されているボット"
              maxItems={6}
              className="mb-4"
              bots={popularBots}
              isLarge={true}
            />
          </section>
        )}

        {/* 仕切り線 */}
        <div className="border-t border-gray-200 mb-2"></div>

        {/* 新着Bot */}
        {newBots.length > 0 && (
          <section className="mb-2">
            <DynamicCarousel
              displayType="new"
              title="新着Bot"
              subtitle="最近追加されたボット"
              maxItems={6}
              className="mb-4"
              bots={newBots}
              isLarge={true}
              isNew={true}
            />
          </section>
        )}

        {/* 仕切り線 */}
        <div className="border-t border-gray-200 mb-2"></div>

        {/* アクションエリア */}
        <ActionArea />
      </div>
    </main>
  );
}

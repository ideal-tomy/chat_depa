'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import BotCard from '@/components/ui/BotCard';
import { Bot } from '@/types/types';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/Skeleton';

interface BotListProps {
  initialBots?: Bot[]; // initialBotsをオプショナルに変更
  filters: {
    category: string;
    pointRange: string;
    sortOrder: string;
  };
}

const BOTS_PER_PAGE = 20;

const BotList: React.FC<BotListProps> = ({ initialBots = [], filters }) => { // デフォルト値を空配列に
  const [bots, setBots] = useState<Bot[]>(initialBots);
  const [offset, setOffset] = useState(BOTS_PER_PAGE);
  const [hasMore, setHasMore] = useState(initialBots.length === BOTS_PER_PAGE);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  // フィルターが変更されたらボットリストをリセット
  useEffect(() => {
    // initialBotsがundefinedやnullの場合でも安全に動作するようにデフォルト値を設定
    const currentInitialBots = initialBots || [];
    setBots(currentInitialBots);
    setOffset(BOTS_PER_PAGE);
    setHasMore(currentInitialBots.length === BOTS_PER_PAGE);
  }, [filters, initialBots]);

  const loadMoreBots = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    let query = supabase
      .from('bots')
      .select(`
        *,
        profiles (
          username
        )
      `)
      .range(offset, offset + BOTS_PER_PAGE - 1);

    // Apply filters
    if (filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    // TODO: Add pointRange filter logic if points are stored in the bots table

    // Apply sort order
    if (filters.sortOrder === 'popular') {
      query = query.order('usage_count', { ascending: false });
    } else if (filters.sortOrder === 'newest') {
      query = query.order('created_at', { ascending: false });
    }
    
    const { data: newBots, error } = await query;

    if (error) {
      console.error("Error fetching more bots:", error);
    } else if (newBots) {
      setBots((prev: Bot[]) => [...(prev || []), ...newBots]); // prevも安全に処理
      setOffset((prev: number) => prev + newBots.length);
      setHasMore(newBots.length === BOTS_PER_PAGE);
    }
    setLoading(false);
  }, [offset, hasMore, loading, filters]);

  useEffect(() => {
    if (inView) {
      loadMoreBots();
    }
  }, [inView, loadMoreBots]);

  // botsがまだ空の状態で初期ロード中を示す
  if (!bots && loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-4">
        {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {bots && bots.map((bot: Bot) => (
          <BotCard key={bot.id} bot={bot} />
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
        </div>
      )}

      <div ref={ref} style={{ height: '1px' }} />

      {!hasMore && !loading && bots && bots.length > 0 && (
        <div className="text-center text-gray-500 py-8 col-span-full">
          これ以上ボットはありません
        </div>
      )}

      {!loading && bots && bots.length === 0 && (
         <div className="text-center text-gray-500 py-8 col-span-full">
           表示するボットがありません。
         </div>
      )}
    </>
  );
};

export default BotList;
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Bot } from '@/types/types';
import BotCard from '@/components/ui/BotCard';
import { Skeleton } from '@/components/ui/Skeleton';

const BOTS_PER_PAGE = 12;

interface BotListProps {
  filters: {
    category: string | null;
    search: string;
    pointRange: [number, number] | null;
  };
}

// ボットデータの型変換ヘルパー
const formatBot = (botData: any): Bot => ({
  ...botData,
  authorIcon: botData.author_icon,
  imageUrl: botData.image_url,
  useCases: botData.use_cases,
  isNew: botData.created_at && new Date(botData.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  isPopular: botData.points > 150,
  complexity: botData.complexity || 'medium',
});

export default function BotList({ filters }: BotListProps) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [groupedBots, setGroupedBots] = useState<Record<string, Bot[]>>({});
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const isFiltered = !!(filters.category || filters.search || filters.pointRange);

  const fetchFilteredBots = useCallback(async (currentPage: number) => {
    if (isLoading) return;
    setIsLoading(true);

    const from = currentPage * BOTS_PER_PAGE;
    const to = from + BOTS_PER_PAGE - 1;

    let query = supabase.from('bots').select('*').order('created_at', { ascending: true }).range(from, to);

    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    if (filters.pointRange) {
      query = query.gte('points', filters.pointRange[0]).lte('points', filters.pointRange[1]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching filtered bots:', error);
      setHasMore(false);
    } else if (data) {
      const newBots = data.map(formatBot);
      setBots((prev) => (currentPage === 0 ? newBots : [...prev, ...newBots]));
      setPage(currentPage + 1);
      setHasMore(data.length === BOTS_PER_PAGE);
    }
    setIsLoading(false);
  }, [filters, isLoading]);

  const fetchGroupedBots = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('bots').select('*').order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all bots:', error);
    } else if (data) {
      const allBots = data.map(formatBot);
      const botsByCategory = allBots.reduce((acc, bot) => {
        const category = bot.category || 'その他';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(bot);
        return acc;
      }, {} as Record<string, Bot[]>);
      setGroupedBots(botsByCategory);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setBots([]);
    setGroupedBots({});
    setPage(0);
    setHasMore(true);
    if (isFiltered) {
      fetchFilteredBots(0);
    } else {
      fetchGroupedBots();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isLoading && isFiltered) {
      fetchFilteredBots(page);
    }
  }, [hasMore, isLoading, isFiltered, page, fetchFilteredBots]);

  useEffect(() => {
    const option = { root: null, rootMargin: '20px', threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, option);
    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }
    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [handleObserver]);

  if (isLoading && !bots.length && Object.keys(groupedBots).length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
      </div>
    );
  }

  return (
    <div>
      {isFiltered ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bots.map((bot) => <BotCard key={bot.id} bot={bot} />)}
          </div>
          <div ref={loader} />
          {isLoading && (
             <div className="flex justify-center items-center p-4 col-span-full">
                <p>読み込み中...</p>
             </div>
          )}
        </>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedBots).map(([category, categoryBots]) => (
            <section key={category}>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryBots.map((bot) => <BotCard key={bot.id} bot={bot} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

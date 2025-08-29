'use client';

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import BotCard from '@/components/ui/BotCard';
import { Bot } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';

interface BotListProps {
  bots: Bot[];
  loading: boolean;
  hasMore: boolean;
  loadMoreBots: () => void;
}

const BotList: React.FC<BotListProps> = ({ bots, loading, hasMore, loadMoreBots }) => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !loading) {
      loadMoreBots();
    }
  }, [inView, loading, loadMoreBots]);

  if (loading && bots.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-4">
        {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-[200px] w-full" />)}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {bots.map((bot) => (
          <BotCard key={bot.id} bot={bot} />
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-4">
          {[...Array(5)].map((_, i) => <Skeleton key={`loading-${i}`} className="h-[200px] w-full" />)}
        </div>
      )}

      {hasMore && !loading && (
        <div ref={ref} className="h-10" />
      )}

      {!hasMore && !loading && bots.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-8">
          表示するボットがありません。
        </div>
      )}
      
      {!hasMore && !loading && bots.length > 0 && (
        <div className="col-span-full text-center text-gray-500 py-8">
          これ以上ボットはありません
        </div>
      )}
    </>
  );
};

export default BotList;

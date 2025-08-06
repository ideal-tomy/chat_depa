'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import BotCard from '@/components/ui/BotCard';
import { Bot } from '@/types/types';
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
    triggerOnce: false,
    onChange: (inView) => {
      if (inView) {
        loadMoreBots();
      }
    },
  });

  // 初期ロード中で、ボットがまだない場合
  if (loading && bots.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-4">
        {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
      </div>
    );
  }

  // ボットが1件もない場合
  if (!loading && bots.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 col-span-full">
        表示するボットがありません。
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

      {/* 追加ロード中のスケルトン */}
      {loading && bots.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-4">
          {[...Array(5)].map((_, i) => <Skeleton key={`loading-${i}`} className="h-96 w-full" />)}
        </div>
      )}

      {/* これ以上ない場合の表示 */}
      {!hasMore && !loading && bots.length > 0 && (
        <div className="text-center text-gray-500 py-8 col-span-full">
          これ以上ボットはありません
        </div>
      )}

      {/* Intersection Observerのトリガー */}
      <div ref={ref} style={{ height: '1px' }} />
    </>
  );
};

export default BotList;
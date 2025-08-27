'use client';

import React from 'react';
import { Bot } from '@/types';
import BotCard from './BotCard';

interface DynamicCarouselProps {
  displayType?: 'pickup' | 'new' | 'trending' | 'category_featured';
  categoryId?: string;
  maxItems?: number;
  showRanking?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
  bots?: Bot[]; // 外部から渡されるボットデータ
}

export default function DynamicCarousel({ 
  displayType, 
  categoryId, 
  maxItems = 10,
  showRanking = false,
  title,
  subtitle,
  className = '',
  bots = [] // デフォルトで空配列
}: DynamicCarouselProps) {

  const getDefaultTitle = () => {
    switch (displayType) {
      case 'pickup':
        return 'おすすめのBot';
      case 'new':
        return '新着のBot';
      case 'trending':
        return '人気のBot';
      case 'category_featured':
        return `${categoryId || 'カテゴリ'}のBot`;
      default:
        return 'Bot一覧';
    }
  };

  const getDefaultSubtitle = () => {
    switch (displayType) {
      case 'pickup':
        return '厳選されたおすすめボット';
      case 'new':
        return '最近追加されたボット';
      case 'trending':
        return '多くのユーザーに利用されているボット';
      case 'category_featured':
        return `${categoryId || 'カテゴリ'}で人気のボット`;
      default:
        return '';
    }
  };

  // ボットがない場合は何も表示しない
  if (!bots || bots.length === 0) {
    return null;
  }

  // maxItemsで制限
  const displayBots = bots.slice(0, maxItems);

  return (
    <div className={`dynamic-carousel ${className}`}>
      <div className="section-header mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {title || getDefaultTitle()}
        </h2>
        {subtitle && (
          <p className="text-gray-600">{subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {displayBots.map((bot, index) => (
          <div key={bot.id} className="relative">
            {showRanking && index < 3 && (
              <div className="absolute top-2 left-2 z-10">
                <RankingBadge rank={index + 1} />
              </div>
            )}
            <BotCard bot={bot} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ランキングバッジコンポーネント
function RankingBadge({ rank }: { rank: number }) {
  const getBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500 text-white';
      case 2:
        return 'bg-gray-400 text-white';
      case 3:
        return 'bg-orange-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getRankText = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank;
    }
  };

  return (
    <div className={`
      ${getBadgeColor(rank)}
      px-2 py-1 rounded-full text-xs font-bold shadow-md
    `}>
      {getRankText(rank)}
    </div>
  );
}


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
  isLarge?: boolean; // 大きなカード表示フラグ
  isNew?: boolean; // 新着ボットフラグ
}

export default function DynamicCarousel({ 
  displayType, 
  categoryId, 
  maxItems = 10,
  showRanking = false,
  title,
  subtitle,
  className = '',
  bots = [], // デフォルトで空配列
  isLarge = false, // デフォルトで通常サイズ
  isNew = false // デフォルトで通常サイズ
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

  const getTitleStyle = () => {
    switch (displayType) {
      case 'new':
        return 'text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent animate-pulse text-center';
      default:
        return 'text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse';
    }
  };

  // ボットがない場合は何も表示しない
  if (!bots || bots.length === 0) {
    return null;
  }

  // maxItemsで制限
  const displayBots = bots.slice(0, maxItems);

  // グリッドクラスを決定
  const gridClass = isLarge 
    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" 
    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6";

  return (
    <div className={`dynamic-carousel ${className}`}>
      <div className="section-header mb-4">
        <h2 className={getTitleStyle()}>
          {title || getDefaultTitle()}
        </h2>
        {subtitle && (
          <p className="text-gray-600 text-lg">{subtitle}</p>
        )}
      </div>

      <div className={gridClass}>
        {displayBots.map((bot, index) => (
          <div key={bot.id} className="relative">
            {showRanking && index < 3 && (
              <div className="absolute top-2 left-2 z-10">
                <RankingBadge rank={index + 1} />
              </div>
            )}
            <BotCard bot={bot} isLarge={isLarge} isNew={isNew} />
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


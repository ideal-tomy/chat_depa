'use client';

import React from 'react';
import { Bot } from '@/types';
import BotCard from './BotCard';
import Link from 'next/link';
import Image from 'next/image';

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
      
      {/* CTAボタン */}
      <div className="text-center mt-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Image
            src={displayType === 'trending' ? "/images/studentgirl.png" : "/images/otaku.png"}
            alt={displayType === 'trending' ? "studentgirl" : "otaku"}
            width={80}
            height={80}
            className="w-20 h-20 object-contain z-10 relative"
          />
          <Link 
            href="/bots" 
            className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-10 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-3xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)',
              backgroundSize: '200% 100%',
              animation: 'flash 2s ease-in-out infinite'
            }}
          >
            <span className="mr-3">🤖</span>
            ボット一覧はこちら
            <span className="ml-3">→</span>
          </Link>
          <Image
            src={displayType === 'trending' ? "/images/sumple01.png" : "/images/sumple03.png"}
            alt={displayType === 'trending' ? "sumple01" : "sumple03"}
            width={80}
            height={80}
            className="w-20 h-20 object-contain z-10 relative"
          />
        </div>
      </div>
    </div>
  );
}

// ランキングバッジコンポーネント
function RankingBadge({ rank }: { rank: number }): JSX.Element {
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


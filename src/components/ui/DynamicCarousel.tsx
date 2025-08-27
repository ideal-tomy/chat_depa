'use client';

import React, { useState, useEffect } from 'react';
import { Bot } from '@/types';
import BotCard from './BotCard';
import { Skeleton } from './Skeleton';

interface DynamicCarouselProps {
  displayType: 'pickup' | 'new' | 'trending' | 'category_featured';
  categoryId?: string;
  maxItems?: number;
  showRanking?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function DynamicCarousel({ 
  displayType, 
  categoryId, 
  maxItems = 10,
  showRanking = false,
  title,
  subtitle,
  className = ''
}: DynamicCarouselProps) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDynamicBots();
  }, [displayType, categoryId, maxItems]);

  const fetchDynamicBots = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        type: displayType,
        limit: maxItems.toString()
      });

      if (categoryId) {
        params.append('category', categoryId);
      }

      const response = await fetch(`/api/bots/dynamic?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bots');
      }

      const data = await response.json();
      setBots(data.bots || []);
    } catch (err) {
      console.error('Error fetching dynamic bots:', err);
      setError('ボットの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
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
          {[...Array(Math.min(maxItems, 5))].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`dynamic-carousel ${className}`}>
        <div className="text-center py-8">
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (bots.length === 0) {
    return null; // ボットがない場合は何も表示しない
  }

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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {bots.map((bot, index) => (
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


'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BotRecommendation } from '@/types';

import { Skeleton } from '@/components/ui/Skeleton';
import { logger } from '@/lib/logger';

interface RelatedBotsRecommendationProps {
  currentBotId: string;
  maxItems?: number;
  displayType?: 'sidebar' | 'carousel' | 'grid';
  showReason?: boolean;
  className?: string;
}

export default function RelatedBotsRecommendation({
  currentBotId,
  maxItems = 6,
  displayType = 'carousel',
  showReason = true,
  className = ''
}: RelatedBotsRecommendationProps) {
  const [recommendations, setRecommendations] = useState<BotRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [currentBotId, maxItems]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        botId: currentBotId,
        limit: maxItems.toString(),
        type: 'hybrid'
      });

      const response = await fetch(`/api/bot/recommendations?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      logger.error('Error fetching recommendations', new Error(String(err)));
      setError('関連ボットの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleBotClick = async (recommendedBotId: string) => {
    try {
      // 推薦フィードバックを記録
      await fetch('/api/bot/recommendation-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceBotId: currentBotId,
          recommendedBotId,
          actionType: 'click',
          sessionId: generateSessionId()
        })
      });
    } catch (error) {
      logger.error('Error recording feedback', new Error(String(error)));
    }
  };

  const generateSessionId = () => {
    return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  };

  if (loading) {
    return (
      <div className={`related-bots-recommendation ${className}`}>
        <div className="recommendation-header mb-4">
          <h3 className="text-lg font-semibold mb-2">
            <span className="text-primary">💡</span> 関連するBot
          </h3>
          {showReason && (
            <p className="text-sm text-gray-600">
              このボットを使った人は、こんなボットも使っています
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(Math.min(maxItems, 3))].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`related-bots-recommendation ${className}`}>
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null; // 推薦がない場合は何も表示しない
  }

  return (
    <div className={`related-bots-recommendation ${className}`}>
      <div className="recommendation-header mb-4">
        <h3 className="text-lg font-semibold mb-2">
          <span className="text-primary">💡</span> このボットを使った人は、こんなボットも使っています
        </h3>
        {showReason && (
          <p className="text-sm text-gray-600 mb-4">
            あなたの利用パターンと他のユーザーの行動から、関連性の高いボットをおすすめしています
          </p>
        )}
      </div>

      {displayType === 'carousel' && (
        <div className="recommendation-carousel">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="relative">
                <BotRecommendationCard
                  bot={rec.bot!}
                  {...(rec.reason && { reason: rec.reason })}
                  similarityScore={rec.similarity_score}
                  onClick={() => handleBotClick(rec.recommended_bot_id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {displayType === 'grid' && (
        <div className="recommendation-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <BotRecommendationCard
              key={rec.id}
              bot={rec.bot!}
              {...(rec.reason && { reason: rec.reason })}
              similarityScore={rec.similarity_score}
              onClick={() => handleBotClick(rec.recommended_bot_id)}
            />
          ))}
        </div>
      )}

      {displayType === 'sidebar' && (
        <div className="recommendation-sidebar space-y-3">
          {recommendations.map((rec) => (
            <BotRecommendationSidebarItem
              key={rec.id}
              bot={rec.bot!}
              {...(rec.reason && { reason: rec.reason })}
              onClick={() => handleBotClick(rec.recommended_bot_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 推薦ボットカードコンポーネント
function BotRecommendationCard({
  bot,
  reason,
  similarityScore,
  onClick
}: {
  bot: any;
  reason?: string;
  similarityScore: number;
  onClick: () => void;
}) {
  return (
    <div 
      className="bot-recommendation-card bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Image 
              src={bot.imageUrl || '/images/sumple01.png'} 
              alt={bot.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {bot.name}
            </h4>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {bot.description}
            </p>
            <div className="flex items-center justify-between mt-2">
              {reason && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {reason}
                </span>
              )}
              <span className="text-xs text-gray-400">
                {Math.round(similarityScore * 100)}% マッチ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// サイドバー用推薦アイテムコンポーネント
function BotRecommendationSidebarItem({
  bot,
  reason,
  onClick
}: {
  bot: any;
  reason?: string;
  onClick: () => void;
}) {
  return (
    <div 
      className="bot-recommendation-sidebar-item bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer p-3"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <Image 
          src={bot.imageUrl || '/images/sumple01.png'} 
          alt={bot.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {bot.name}
          </h4>
          {reason && (
            <p className="text-xs text-gray-500 mt-1">
              {reason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


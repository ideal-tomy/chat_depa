'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import BotCard from './BotCard';
import { Bot, CarouselProps, CarouselState } from '@/types';
import { logger } from '@/lib/logger';
import Link from 'next/link';
import Image from 'next/image';

const PickUpCarousel: React.FC<CarouselProps> = ({ 
  title = '注目のBot', 
  bots, 
  onBotClick,
  loading = false,
  error = null,
  className = ''
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CarouselState>({
    currentIndex: 0,
    isScrolling: false,
    scrollDirection: null
  });
  
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  
  // スクロール位置とコンテナの全体幅を監視
  useEffect(() => {
    const updateScrollInfo = (): void => {
      if (carouselRef.current) {
        const container = carouselRef.current;
        setScrollPosition(container.scrollLeft);
        setMaxScroll(container.scrollWidth - container.clientWidth);
      }
    };
    
    const container = carouselRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollInfo);
      // 初回とリサイズ時に更新
      updateScrollInfo();
      window.addEventListener('resize', updateScrollInfo);
      
      return () => {
        container.removeEventListener('scroll', updateScrollInfo);
        window.removeEventListener('resize', updateScrollInfo);
      };
    }
    return undefined;
  }, [bots]);

  // スクロール関数をメモ化
  const scroll = useCallback((direction: 'left' | 'right'): void => {
    if (carouselRef.current) {
      setState(prev => ({ 
        ...prev, 
        isScrolling: true, 
        scrollDirection: direction 
      }));

      const container = carouselRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      const targetScroll = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });

      // スクロール完了後に状態をリセット
      setTimeout(() => {
        setState(prev => ({ 
          ...prev, 
          isScrolling: false, 
          scrollDirection: null 
        }));
      }, 500);
    }
  }, []);



  // ローディング状態の表示
  if (loading) {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="mb-4">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            {title}
          </h2>
          <p className="text-gray-600 text-lg text-center">厳選されたおすすめボット</p>
        </div>
        <div className="flex gap-4 md:gap-6 pb-2 pt-4 overflow-x-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-[450px] sm:w-[500px] md:w-[550px] flex-shrink-0 animate-pulse">
              <div className="h-[320px] bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // エラー状態の表示
  if (error) {
    logger.error('PickUpCarousel error', new Error(String(error)));
    return (
      <div className={`relative w-full ${className}`}>
        <div className="mb-4">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            {title}
          </h2>
        </div>
        <div className="text-center text-red-500 py-8">
          データの読み込みに失敗しました
        </div>
      </div>
    );
  }

  // ボットが存在しない場合
  if (!bots || bots.length === 0) {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="mb-4">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            {title}
          </h2>
        </div>
        <div className="text-center text-gray-500 py-8">
          表示するボットがありません
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      {title && (
        <div className="mb-4">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse text-center">
            {title}
          </h2>
          <p className="text-gray-600 text-lg text-center">厳選されたおすすめボット</p>
        </div>
      )}
      
      {/* スクロールボタン - 左 */}
      {scrollPosition > 10 && (
        <button 
          onClick={() => scroll('left')}
          disabled={state.isScrolling}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}
      
      {/* カルーセルコンテナ */}
      <div className="relative overflow-visible">
        <div 
          ref={carouselRef}
          className="flex gap-4 md:gap-6 pb-2 pt-6 snap-x snap-mandatory scrollbar-hide overflow-x-auto overflow-y-visible"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* カスタムスクロールバースタイル */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {/* カルーセルアイテム - 注目のBotは大きく表示 */}
          {bots.map((bot) => (
            <div key={bot.id} className="w-[450px] sm:w-[500px] md:w-[550px] flex-shrink-0 snap-start">
              <div className="transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="relative overflow-visible">
                  {/* 特別な注目バッジ */}
                  <div className="absolute top-2 right-2 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                    ⭐ 注目
                  </div>
                  <BotCard
                    bot={bot}
                    isLarge={true}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* スクロールボタン - 右 */}
      {maxScroll > 0 && scrollPosition < maxScroll - 10 && (
        <button 
          onClick={() => scroll('right')}
          disabled={state.isScrolling}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}
      
      {/* CTAボタン */}
      <div className="text-center mt-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Image
            src="/images/sumple04.png"
            alt="sumple04"
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
            src="/images/uranai01.png"
            alt="uranai01"
            width={80}
            height={80}
            className="w-20 h-20 object-contain z-10 relative"
          />
        </div>
      </div>
    </div>
  );
};

export default PickUpCarousel;

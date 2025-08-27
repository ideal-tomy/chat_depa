'use client';

import { useState, useRef, useEffect } from 'react';
import BotCard from './BotCard';

import { Bot } from '@/types';

interface PickUpCarouselProps {
  title?: string;
  bots: Bot[];
}

export default function PickUpCarousel({ title = '注目のBot', bots }: PickUpCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  
  // スクロール位置とコンテナの全体幅を監視
  useEffect(() => {
    const updateScrollInfo = () => {
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
  }, [bots]);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      const targetScroll = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full">
      {title && (
        <div className="mb-8">
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
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}
      
      {/* カルーセルコンテナ */}
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto gap-6 md:gap-8 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* カスタムスクロールバースタイル */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {/* カルーセルアイテム - 注目のBotは大きく表示 */}
        {bots.map(bot => (
          <div key={bot.id} className="w-[450px] sm:w-[500px] md:w-[550px] flex-shrink-0 snap-start">
            <div className="transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="relative">
                {/* 特別な注目バッジ */}
                <div className="absolute top-2 right-2 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                  ⭐ 注目
                </div>
                <BotCard bot={bot} isLarge={true} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* スクロールボタン - 右 */}
      {maxScroll > 0 && scrollPosition < maxScroll - 10 && (
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}
    </div>
  );
}

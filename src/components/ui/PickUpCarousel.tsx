'use client';

import { useState, useRef, useEffect } from 'react';
import BotCard from './BotCard';

import { Bot } from '@/types/types';

interface PickUpCarouselProps {
  title?: string;
  bots: Bot[];
}

export default function PickUpCarousel({ title = 'ピックアップBot', bots }: PickUpCarouselProps) {
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
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">{title}</h2>
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
        className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* カスタムスクロールバースタイル */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {/* カルーセルアイテム */}
        {bots.map(bot => (
          <div key={bot.id} className="min-w-[280px] sm:min-w-[320px] flex-shrink-0 snap-start">
            <BotCard bot={bot} />
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

'use client';

import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Bot } from '@/types';
import BotCard from './BotCard';

interface HorizontalCarouselProps {
  title: string;
  bots: Bot[];
  autoScroll?: boolean;
  autoScrollSpeed?: number;
}

export default function HorizontalCarousel({ 
  title, 
  bots, 
  autoScroll = true, 
  autoScrollSpeed = 3000 
}: HorizontalCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // 入力フォーカスの監視
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        setIsInputFocused(true);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        setIsInputFocused(false);
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // 自動スクロール
  useEffect(() => {
    if (!autoScroll || isHovered || isInputFocused || bots.length === 0) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        // 右端に到達したら左端に戻る
        if (scrollLeft >= scrollWidth - clientWidth - 1) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, autoScrollSpeed);

    return () => clearInterval(interval);
  }, [autoScroll, autoScrollSpeed, isHovered, isInputFocused, bots.length]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();

      return () => {
        scrollElement.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, [bots]);

  if (bots.length === 0) return null;

  return (
    <div className="relative group mb-8">
      {/* セクションタイトル */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-6">
        {title}
      </h2>

      {/* カルーセルコンテナ */}
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 左スクロールボタン */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="前へ"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* 右スクロールボタン */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="次へ"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* スクロールコンテナ */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 md:px-6 pb-4"
          style={{
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth'
          }}
        >
          {bots.map((bot) => (
            <div
              key={bot.id}
              className="flex-none w-64 md:w-72 lg:w-80"
              style={{ scrollSnapAlign: 'start' }}
            >
              <BotCard bot={bot} compact />
            </div>
          ))}
        </div>

        {/* グラデーションオーバーレイ */}
        <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}


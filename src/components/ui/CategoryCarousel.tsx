"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Bot } from '@/types/types';
import BotCard from './BotCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryCarouselProps {
  bots: Bot[];
  variant?: 'standard' | 'compact';
  showPreview?: boolean;
}

/**
 * カテゴリーボットのカルーセル表示コンポーネント
 * Amazonプライム風の横スクロールセクション
 */
const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  bots,
  variant = 'standard',
  showPreview = false,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps'
  });
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(false);
  
  // ボタンスタイル定義
  const buttonBaseClass = "rounded-full p-1 bg-white shadow-md transition-all hover:bg-gray-100";
  const buttonDisabledClass = "opacity-30 cursor-not-allowed bg-gray-100";

  // カードの間隔とサイズを設定
  const gapClass = variant === 'compact' ? 'gap-2' : 'gap-3';
  const slideSizeClass = variant === 'compact' ? 'w-[160px] md:w-[180px]' : 'w-[200px] md:w-[240px]';

  // ナビゲーションボタンの状態を更新
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  // 前へボタンの処理
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  // 次へボタンの処理
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // カルーセルの初期化時とスライド切り替え時にイベントリスナーを設定
  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();

    // 画面サイズに応じてナビゲーションボタンの表示・非表示を切り替え
    const handleResize = () => {
      setShowNavButtons(window.innerWidth >= 768); // md以上のサイズでボタン表示
    };
    handleResize(); // 初期状態を設定
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* カルーセルのヘッダーは親コンポーネントで管理 */}
      
      {/* カルーセルのメインコンテナ */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className={`flex ${gapClass}`}>
          {bots.map((bot) => (
            <div key={bot.id} className={`flex-shrink-0 ${slideSizeClass}`}>
              <BotCard 
                bot={bot} 
                showPreview={showPreview} 
                isNew={bot.isNew}
                isPopular={bot.isPopular}
                isUGC={bot.isUGC}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* ナビゲーションボタン - デスクトップのみ表示 */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 carousel-buttons">
            <button 
              className={`${buttonBaseClass} ${!prevBtnEnabled ? buttonDisabledClass : ''}`}
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              aria-label="前のアイテムへ"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className={`${buttonBaseClass} ${!nextBtnEnabled ? buttonDisabledClass : ''}`}
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              aria-label="次のアイテムへ"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCarousel;

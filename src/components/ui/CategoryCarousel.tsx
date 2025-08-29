"use client";

import React from 'react';
import { Bot } from '@/types';
import HorizontalCarousel from './HorizontalCarousel';
import { getDisplayCategoryIcon } from '@/lib/category-icons';
import Image from 'next/image';

interface CategoryCarouselProps {
  bots: Bot[];
  variant?: 'standard' | 'compact';
  showPreview?: boolean;
  categoryTitle?: string; // カテゴリタイトルを追加
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ 
  bots, 
  categoryTitle 
}) => {
  // カテゴリ別アイコンを自動割り当て
  const categoryIcon = categoryTitle ? getDisplayCategoryIcon(categoryTitle) : 'sumple01';
  
  return (
    <div className="category-carousel">
      {/* カテゴリアイコン表示 */}
      {categoryTitle && (
        <div className="category-icon-display mb-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg border-2 border-primary">
            <Image 
              src={`/images/${categoryIcon}.png`}
              alt={`${categoryTitle}アイコン`}
              width={40}
              height={40}
              className="object-contain"
              onError={(e) => {
                e.currentTarget.src = '/images/sumple01.png';
              }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 font-medium">{categoryTitle}</p>
        </div>
      )}
      
      <HorizontalCarousel bots={bots} />
    </div>
  );
};

export default CategoryCarousel;

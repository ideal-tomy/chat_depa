'use client';

import React from 'react';
import { Bot } from '@/types';
import HorizontalCarousel from './HorizontalCarousel';
import { 
  fortuneSubCategories, 
  categorizeFortuneBots, 
  getSubCategoryDisplayName 
} from '@/lib/fortune-subcategories';

interface FortuneCategoryCarouselProps {
  bots: Bot[];
  categoryTitle?: string;
}

const FortuneCategoryCarousel: React.FC<FortuneCategoryCarouselProps> = ({ 
  bots, 
  categoryTitle 
}) => {
  // 占いボットをサブカテゴリ別に分類
  const categorizedBots = categorizeFortuneBots(bots);
  
  return (
    <div className="fortune-category-carousel">
      {/* メインカテゴリタイトル */}
      {categoryTitle && (
        <div className="category-header mb-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{categoryTitle}</h3>
          <p className="text-gray-600">面白い系・ガチ系・気軽系の3つのタイプからお選びください</p>
        </div>
      )}
      
      {/* サブカテゴリ別カルーセル */}
      <div className="space-y-8">
        {fortuneSubCategories.map((subCategory) => {
          const subCategoryBots = categorizedBots[subCategory.id];
          
          if (subCategoryBots.length === 0) return null;
          
          return (
            <div key={subCategory.id} className="sub-category-section">
              {/* サブカテゴリヘッダー */}
              <div className="sub-category-header mb-4">
                <div className="flex items-center justify-center space-x-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${subCategory.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                    {subCategory.icon}
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-gray-800">{subCategory.name}</h4>
                    <p className="text-sm text-gray-600">{subCategory.description}</p>
                  </div>
                </div>
              </div>
              
              {/* ボットカルーセル */}
              <div className="sub-category-content">
                <HorizontalCarousel 
                  bots={subCategoryBots} 
                  isLarge={true}
                  isNew={false}
                />
              </div>
              
              {/* サブカテゴリ間の区切り線 */}
              <div className="border-t border-gray-200 mt-6"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FortuneCategoryCarousel;

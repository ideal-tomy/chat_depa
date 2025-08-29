import React, { ReactNode } from 'react';


interface CategorySectionProps {
  title: string;
  viewAllLink?: string;
  variant?: 'standard' | 'compact';
  bgColorClass?: string; // 背景色のカスタマイズ用
  children: ReactNode;
}

/**
 * カテゴリーセクション全体を管理するコンポーネント
 * ヘッダーとカルーセルをまとめ、セクションの統一感を提供
 */
const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  viewAllLink,
  variant = 'standard',
  bgColorClass = 'bg-transparent',
  children
}) => {
  // セクションとの間隔
  const paddingClass = variant === 'compact' ? 'py-3' : 'py-4';

  return (
    <section className={`${bgColorClass} ${paddingClass} w-full`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold ${variant === 'compact' ? 'text-lg' : 'text-xl'}`}>
            {title}
          </h3>
          {viewAllLink && (
            <a 
              href={viewAllLink} 
              className="text-indigo-600 hover:underline text-sm"
            >
              すべて見る →
            </a>
          )}
        </div>
        {children}
      </div>
    </section>
  );
};

export default CategorySection;

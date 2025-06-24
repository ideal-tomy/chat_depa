"use client";

import React from 'react';
import Image from 'next/image';

// アイコンタイプの定義（BotCardから渡される型）
export type CharacterType = 
  | 'business' 
  | 'lifestyle' 
  | 'creative' 
  | 'technical' 
  | 'entertainment' 
  | 'fortune' 
  | 'other';

interface CharacterIconProps {
  type: CharacterType;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// サイズごとの幅と高さのマッピング
const sizeMapping = {
  small: { width: 40, height: 40 },
  medium: { width: 56, height: 56 },
  large: { width: 72, height: 72 },
};

/**
 * ボットのカテゴリに応じたキャラクターアイコンを表示するコンポーネント
 */
const CharacterIcon: React.FC<CharacterIconProps> = ({ 
  type, 
  size = 'medium',
  className = '',
}) => {
  // カテゴリに基づいて表示する画像パスを決定
  const getImagePath = (charType: CharacterType): string => {
    switch (charType) {
      case 'business':
      case 'entertainment':
        return '/images/icons/sample/sumple04.png';
      case 'technical':
      case 'fortune':
        return '/images/icons/sample/sumple03.png';
      case 'lifestyle':
      case 'creative':
      case 'other':
      default:
        return '/images/icons/sample/sumple01.png';
    }
  };

  const imagePath = getImagePath(type);
  const { width, height } = sizeMapping[size];

  return (
    <div className={`character-icon ${className}`}>
      <Image
        src={imagePath}
        alt={`${type} character icon`}
        width={width}
        height={height}
        className="drop-shadow-md"
      />
    </div>
  );
};

export default CharacterIcon;

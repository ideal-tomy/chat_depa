"use client";

import React from 'react';
import Image from 'next/image';
import PlaceholderSVG from './PlaceholderSVG';

// アイコンタイプの定義
export type CharacterType = 
  | 'business' 
  | 'lifestyle' 
  | 'creative' 
  | 'technical' 
  | 'entertainment' 
  | 'fortune' 
  | 'other';

// 複雑さレベルの定義
export type ComplexityLevel = 'simple' | 'medium' | 'advanced';

interface CharacterIconProps {
  type: CharacterType;
  complexity?: ComplexityLevel;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// 各タイプとレベルに対応するアイコンパスのマッピング
const iconMapping: Record<CharacterType, Record<ComplexityLevel, string>> = {
  business: {
    simple: '/images/icons/business_simple.svg',
    medium: '/images/icons/business_medium.svg',
    advanced: '/images/icons/business_advanced.svg',
  },
  lifestyle: {
    simple: '/images/icons/lifestyle_simple.svg',
    medium: '/images/icons/lifestyle_medium.svg',
    advanced: '/images/icons/lifestyle_advanced.svg',
  },
  creative: {
    simple: '/images/icons/creative_simple.svg',
    medium: '/images/icons/creative_medium.svg',
    advanced: '/images/icons/creative_advanced.svg',
  },
  technical: {
    simple: '/images/icons/technical_simple.svg',
    medium: '/images/icons/technical_medium.svg',
    advanced: '/images/icons/technical_advanced.svg',
  },
  entertainment: {
    simple: '/images/icons/entertainment_simple.svg',
    medium: '/images/icons/entertainment_medium.svg',
    advanced: '/images/icons/entertainment_advanced.svg',
  },
  fortune: {
    simple: '/images/icons/fortune_simple.svg',
    medium: '/images/icons/fortune_medium.svg',
    advanced: '/images/icons/fortune_advanced.svg',
  },
  other: {
    simple: '/images/icons/other_simple.svg',
    medium: '/images/icons/other_medium.svg',
    advanced: '/images/icons/other_advanced.svg',
  },
};

// サイズごとの幅と高さのマッピング
const sizeMapping = {
  small: { width: 40, height: 40 },
  medium: { width: 56, height: 56 },
  large: { width: 72, height: 72 },
};

// 複雑さに応じた色のマッピング
const colorMapping: Record<ComplexityLevel, string> = {
  simple: '#6366F1', // インディゴ
  medium: '#8B5CF6', // 紫
  advanced: '#EC4899', // ピンク
};

/**
 * ボットの種類と複雑さに応じたキャラクターアイコンを表示するコンポーネント
 */
const CharacterIcon: React.FC<CharacterIconProps> = ({ 
  type, 
  complexity = 'medium',
  size = 'medium',
  className = '',
}) => {
  // サンプル画像の配列を定義
  const sampleImages = [
    '/images/icons/sample/sumple02.png',
    '/images/icons/sample/sumple03.png',
    '/images/icons/sample/sumple04.png'
  ];
  
  // ランダムなサンプル画像を選択
  const getRandomSampleImage = (): string => {
    const randomIndex = Math.floor(Math.random() * sampleImages.length);
    return sampleImages[randomIndex];
  };

  // 実際の画像を使用するかプレースホルダーSVGを使用するかを決定
  const useSampleImages = true; // サンプル画像を使用するフラグ
  const sampleImagePath = getRandomSampleImage();
  
  // アイコン関連の設定
  const iconPath = iconMapping[type][complexity];
  const iconColor = colorMapping[complexity];
  
  // サンプル画像を使用する場合
  if (useSampleImages) {
    return (
      <div className={`character-icon ${className}`}>
        <Image
          src={sampleImagePath}
          alt={`${type} character`}
          width={sizeMapping[size].width}
          height={sizeMapping[size].height}
          className="drop-shadow-md"
        />
      </div>
    );
  }
  
  // サンプル画像がない場合はPlaceholderSVGを返す
  return (
    <div className={`character-icon ${className}`}>
      <PlaceholderSVG 
        type={type} 
        color={iconColor}
        size={sizeMapping[size].width} 
      />
    </div>
  );
};

export default CharacterIcon;

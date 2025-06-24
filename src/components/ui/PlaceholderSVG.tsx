"use client";

import React from 'react';
import { CharacterType } from './CharacterIcon';

interface PlaceholderSVGProps {
  type: CharacterType;
  color?: string;
  size?: number;
}

/**
 * プレースホルダーSVGアイコンを生成するコンポーネント
 * 本番用の漫画風アイコンができるまでの代替品として使用
 */
const PlaceholderSVG: React.FC<PlaceholderSVGProps> = ({ 
  type, 
  color = '#6366F1', 
  size = 40 
}) => {
  // タイプ別のアイコン形状
  const icons: Record<CharacterType, React.ReactNode> = {
    business: (
      <path d="M10,0 V40 H30 V0 Z M15,15 H25 V25 H15 Z" strokeWidth="2" fill="none" stroke={color} />
    ),
    lifestyle: (
      <path d="M20,5 L35,20 L20,35 L5,20 Z" strokeWidth="2" fill="none" stroke={color} />
    ),
    creative: (
      <>
        <circle cx="20" cy="20" r="15" strokeWidth="2" fill="none" stroke={color} />
        <path d="M15,15 L25,25 M25,15 L15,25" strokeWidth="2" fill="none" stroke={color} />
      </>
    ),
    technical: (
      <>
        <rect x="10" y="10" width="20" height="20" strokeWidth="2" fill="none" stroke={color} />
        <path d="M10,10 L30,30 M30,10 L10,30" strokeWidth="2" fill="none" stroke={color} />
      </>
    ),
    entertainment: (
      <>
        <circle cx="20" cy="20" r="15" strokeWidth="2" fill="none" stroke={color} />
        <path d="M15,20 H25 M20,15 V25" strokeWidth="2" fill="none" stroke={color} />
      </>
    ),
    fortune: (
      <>
        <path d="M20,5 L25,20 L40,20 L30,30 L35,45 L20,35 L5,45 L10,30 L0,20 L15,20 Z" 
          strokeWidth="2" fill="none" stroke={color} transform="scale(0.7) translate(8, 8)" />
      </>
    ),
    other: (
      <circle cx="20" cy="20" r="15" strokeWidth="2" fill="none" stroke={color} />
    ),
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      xmlns="http://www.w3.org/2000/svg"
      className="placeholder-svg"
    >
      <circle cx="20" cy="20" r="18" strokeWidth="2" fill="white" fillOpacity="0.85" stroke={color} />
      {icons[type]}
    </svg>
  );
};

export default PlaceholderSVG;

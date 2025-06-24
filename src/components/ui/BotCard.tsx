"use client";

import Image from 'next/image';
import { Bot } from '@/types/types';
import { useState } from 'react';
import CharacterIcon, { CharacterType } from './CharacterIcon';

interface BotCardProps {
  bot: Bot;
  size?: 'standard' | 'large';
  showPreview?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  isUGC?: boolean;
}

// カテゴリーからキャラクタータイプへのマッピング
const categoryToCharacterType: Record<string, CharacterType> = {
  'business': 'business',
  'creative': 'creative',
  'entertainment': 'entertainment',
  'technical': 'technical',
  'lifestyle': 'lifestyle',
  'fortune': 'fortune',
  // デフォルトマッピング
  'default': 'other'
};

const BotCard: React.FC<BotCardProps> = ({ 
  bot, 
  size = 'standard',
  showPreview = false,
  isNew = false,
  isPopular = false,
  isUGC = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // カテゴリーからキャラクタータイプを取得
  const characterType = categoryToCharacterType[bot.category] || categoryToCharacterType.default;
  
  // サイズに応じてカードのスタイルを変更
  const cardSizeClass = size === 'large' ? 'w-full' : 'w-full';
  const imageAspectRatioClass = 'aspect-[16/9]'; // 16:9のアスペクト比
  
  return (
    <div 
      className={`relative bg-white rounded-lg shadow-md transition-all duration-300 ease-in-out ${cardSizeClass}
      ${isHovered ? 'shadow-xl scale-[1.03] z-10' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* キャラクターアイコン - 左上に飛び出して配置 */}
      <div className="absolute top-0 left-0 z-20 -translate-y-3 -translate-x-3">
        <CharacterIcon 
          type={characterType} 
          complexity={bot.complexity || 'medium'} 
          size={size === 'large' ? 'large' : 'medium'} 
        />
      </div>
      
      {/* バッジ - 右上に配置 */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
        {isNew && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            NEW
          </span>
        )}
        {isPopular && (
          <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            人気
          </span>
        )}
        {isUGC && (
          <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            クリエイター
          </span>
        )}
      </div>
      
      {/* メイン画像 */}
      <div className={`relative w-full ${imageAspectRatioClass} overflow-hidden mt-3`}>
        <Image
          src={bot.imageUrl}
          alt={bot.name}
          layout="fill"
          objectFit="cover"
          className={`transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}
        />
      </div>
      
      {/* ボット情報 */}
      <div className="p-3">
        <h3 className="text-lg font-bold text-gray-800 mb-1 pl-4">{bot.name}</h3>
        <p className="text-sm text-gray-600 mb-2 h-10 overflow-hidden">{bot.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="bg-gray-200 rounded-full px-2 py-1">{bot.category}</span>
          <div className="flex items-center">
            <Image
              src={bot.authorIcon}
              alt={bot.author}
              width={20}
              height={20}
              className="rounded-full mr-1"
            />
            <span>{bot.author}</span>
          </div>
        </div>
        
        <div className="text-right font-bold text-indigo-600">
          {bot.points.toLocaleString()} P
        </div>
      </div>
      
      {/* ホバー時のプレビュー表示 - showPreviewがtrueの場合のみ表示 */}
      {showPreview && isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="text-white">
            <h4 className="text-lg font-bold mb-2">{bot.name}</h4>
            <p className="text-sm mb-2">{bot.description}</p>
            <p className="text-xs">使用例: {bot.useCases?.[0]}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotCard;

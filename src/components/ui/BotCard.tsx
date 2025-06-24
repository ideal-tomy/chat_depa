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

  if (!bot || !bot.id) {
    return null;
  }

  const characterType = categoryToCharacterType[bot.category || ''] || categoryToCharacterType.default;
  const botName = bot.name || '無名のボット';
  const botDescription = bot.description || '説明がありません。';
  const botImageUrl = bot.imageUrl || '/images/placeholder.png';

  const cardSizeClass = size === 'large' ? 'w-full' : 'w-full';
  const imageAspectRatioClass = 'aspect-[16/9]';

  const handleSendClick = () => {
    try {
      const inputValue = localStorage.getItem(`chat_input_${bot.id}`) || '';
      window.location.href = `/bots/${bot.id}?message=${encodeURIComponent(inputValue)}`;
    } catch (e) {
      console.error('Navigation or LocalStorage error:', e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      localStorage.setItem(`chat_input_${bot.id}`, e.target.value);
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  };

  return (
    <div 
      className={`relative bg-white rounded-lg shadow-md transition-all duration-300 ease-in-out ${cardSizeClass} ${isHovered ? 'shadow-xl scale-[1.03] z-20' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* キャラクターアイコン: z-30 */}
      <div className="absolute top-1 left-1 z-30 -translate-y-1/3 -translate-x-1/3">
        <CharacterIcon 
          type={characterType} 
          complexity={bot.complexity || 'medium'} 
          size={'large'} 
        />
      </div>
      
      {/* バッジ: z-20 */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
        {isNew && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">NEW</span>}
        {isPopular && <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">人気</span>}
        {isUGC && <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">クリエイター</span>}
      </div>
      
      {/* タイトル: z-10 */}
      <div className="absolute top-3 left-20 z-10">
        <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg shadow-black">{botName}</h3>
      </div>
      
      {/* メイン画像 */}
      <div className={`relative w-full ${imageAspectRatioClass} overflow-hidden rounded-t-lg`}>
        <Image
          src={botImageUrl}
          alt={botName}
          fill={true}
          style={{ objectFit: 'cover' }}
          className={`transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('placeholder.png')) {
              target.src = '/images/placeholder.png';
            }
          }}
        />
      </div>
      
      {/* カード下部コンテンツ */}
      <div className="p-3">
        <div className="relative mt-2">
          <input 
            type="text" 
            placeholder="メッセージを入力..."
            className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onChange={handleInputChange}
          />
          <button
            className="absolute right-0 top-0 h-full bg-indigo-600 text-white px-4 rounded-r-full hover:bg-indigo-700 transition-colors"
            onClick={handleSendClick}
          >
            送信
          </button>
        </div>
        
        <div className="text-right font-bold text-indigo-600 mt-2">
          {bot.points !== undefined ? `${bot.points} P` : '0 P'}
        </div>
      </div>
      
      {/* ホバー時のプレビュー表示: z-40 */}
      {showPreview && isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 rounded-lg transition-opacity duration-300 z-40">
          <p className="text-white text-center">{botDescription}</p>
        </div>
      )}
    </div>
  );
};

export default BotCard;

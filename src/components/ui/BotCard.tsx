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
  compact?: boolean;
}

// カテゴリーからキャラクタータイプへのマッピング
const categoryToCharacterType: Record<string, CharacterType> = {
  'ビジネス': 'business',
  'マーケティング': 'entertainment', // businessと同じアイコンを割り当て
  'プログラミング': 'technical',
  '学習': 'fortune', // technicalと同じアイコンを割り当て
  'ライフスタイル': 'lifestyle',
  '旅行': 'lifestyle',
  'デザイン': 'creative',
  'フィットネス': 'lifestyle',
  // デフォルトマッピング
  'default': 'other'
};

const BotCard: React.FC<BotCardProps> = ({ 
  bot,
  size = 'standard',
  showPreview = false, // このプロパティはもう使用しません
  isNew = false,
  isPopular = false,
  isUGC = false,
  compact = false
}) => {

  if (!bot || !bot.id) {
    return null;
  }

  const characterType = categoryToCharacterType[bot.category || ''] || categoryToCharacterType.default;
  const botName = bot.name || '無名のボット';
  const botImageUrl = bot.imageUrl || '/images/placeholder.png';

  const cardSizeClass = size === 'large' ? 'w-full' : 'w-full';
  const imageAspectRatioClass = 'aspect-[16/9]';

  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // カードクリックイベントの伝播を停止
    if (bot && bot.id) {
      window.location.href = `/bots/${bot.id}?message=${encodeURIComponent(message)}`;
    }
  };

  const handleCardClick = () => {
    if (bot && bot.id) {
      window.location.href = `/bots/${bot.id}`;
    }
  };

  return (
    <div className={`relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${cardSizeClass} ${compact ? 'max-w-xs h-96' : 'max-w-md h-[28rem]'}`}
      onClick={handleCardClick}
    >
      {/* キャラクターアイコン: z-30 - はみ出し表示 */}
      <div className="absolute -top-2 -left-2 z-30">
        <CharacterIcon 
          type={characterType} 
          size={compact ? 'medium' : 'large'} 
        />
      </div>
      

      
      {/* 機能アイコン表示エリア */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {bot.can_upload_image && <span className="text-2xl" title="画像アップロード対応">🖼️</span>}
        {bot.can_send_file && <span className="text-2xl" title="ファイル送信対応">📎</span>}
      </div>

      {/* メイン画像 */}
      <div className={`relative w-full ${compact ? 'h-52' : 'h-64'} overflow-hidden rounded-t-lg`}>
        <Image
          src={botImageUrl}
          alt={botName}
          fill={true}
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('placeholder.png')) {
              target.src = '/images/placeholder.png';
            }
          }}
        />
      </div>
      
      {/* カード下部コンテンツ */}
      <div className={`${compact ? 'p-2' : 'p-3'}`}>
        {/* タイトル */}
        <h3 className={`${compact ? 'text-sm' : 'text-lg'} font-bold text-gray-800 mb-2`}>
          {botName}
        </h3>
        
        {/* 説明文 */}
        {bot.description && (
          <div className={`mb-2 ${compact ? 'mb-1' : 'mb-2'}`}>
            <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-700 font-medium line-clamp-2 leading-relaxed`}>
              {bot.description}
            </p>
          </div>
        )}
        
        <div className="relative mt-2">
          <input
            type="text"
            className={`w-full border-gray-300 rounded-full ${compact ? 'py-1 pl-3 pr-16 text-xs' : 'py-2 pl-4 pr-24 text-sm'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
            placeholder="メッセージを入力..."
            value={message}
            onChange={handleInputChange}
            onClick={(e) => e.stopPropagation()} // 親要素へのクリックイベント伝播を停止
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // フォーム送信を防止
                handleSendClick();
              }
            }}
          />
          <button
            className={`absolute right-0 top-0 h-full bg-indigo-600 text-white ${compact ? 'px-2 text-xs' : 'px-4'} rounded-r-full hover:bg-indigo-700 transition-colors`}
            onClick={handleSendClick}
          >
            送信
          </button>
        </div>
        
        <div className={`flex justify-between items-center ${compact ? 'mt-1' : 'mt-2'}`}>
          <div className="flex gap-1">
            {isNew && <span className={`bg-red-500 text-white font-bold rounded-full shadow-md ${compact ? 'text-xs px-1 py-0.5' : 'text-xs px-2 py-1'}`}>NEW</span>}
            {isPopular && <span className={`bg-yellow-500 text-white font-bold rounded-full shadow-md ${compact ? 'text-xs px-1 py-0.5' : 'text-xs px-2 py-1'}`}>人気</span>}
            {isUGC && <span className={`bg-purple-500 text-white font-bold rounded-full shadow-md ${compact ? 'text-xs px-1 py-0.5' : 'text-xs px-2 py-1'}`}>クリエイター</span>}
          </div>
          <div className={`font-bold text-indigo-600 ${compact ? 'text-xs' : 'text-sm'}`}>
            {bot.points !== undefined ? `${bot.points} P` : '0 P'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotCard;

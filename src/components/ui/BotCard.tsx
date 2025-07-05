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
  isUGC = false
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

  const handleSendClick = () => {
    if (bot && bot.id) {
      window.location.href = `/bots/${bot.id}?message=${encodeURIComponent(message)}`;
    }
  };

  return (
    <div className={`relative bg-white rounded-lg shadow-md ${cardSizeClass}`}>
      {/* キャラクターアイコン: z-30 */}
      <div className="absolute top-1 left-1 z-30 -translate-y-1/3 -translate-x-1/3">
        <CharacterIcon 
          type={characterType} 
          size={'large'} 
        />
      </div>
      
      {/* タイトル: z-10 */}
      <div className="absolute top-3 left-20 z-10">
        <h3 className="text-lg font-bold text-white mb-1" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>{botName}</h3>
      </div>
      
      {/* 機能アイコン表示エリア */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {bot.can_upload_image && <span className="text-2xl" title="画像アップロード対応">🖼️</span>}
        {bot.can_send_file && <span className="text-2xl" title="ファイル送信対応">📎</span>}
      </div>

      {/* メイン画像 */}
      <div className={`relative w-full ${imageAspectRatioClass} overflow-hidden rounded-t-lg`}>
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
      <div className="p-3">
        <div className="relative mt-2">
          <input
            type="text"
            className="w-full border-gray-300 rounded-full py-2 pl-4 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
            className="absolute right-0 top-0 h-full bg-indigo-600 text-white px-4 rounded-r-full hover:bg-indigo-700 transition-colors"
            onClick={handleSendClick}
          >
            送信
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2">
            {isNew && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">NEW</span>}
            {isPopular && <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">人気</span>}
            {isUGC && <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">クリエイター</span>}
          </div>
          <div className="font-bold text-indigo-600">
            {bot.points !== undefined ? `${bot.points} P` : '0 P'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotCard;

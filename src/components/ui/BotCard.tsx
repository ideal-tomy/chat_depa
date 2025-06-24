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
      <div className="absolute top-1 left-1 z-30 -translate-y-1/3 -translate-x-1/3">
        <CharacterIcon 
          type={characterType} 
          complexity={bot.complexity || 'medium'} 
          size={size === 'large' ? 'large' : 'large'} 
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
      
      {/* タイトル - アイコンの横に配置し、画像に重なるように */}
      <div className="absolute top-3 left-20 z-10">
        <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg shadow-black">{bot.name}</h3>
      </div>
      
      {/* メイン画像 */}
      <div className={`relative w-full ${imageAspectRatioClass} overflow-hidden`}>
        <Image
          src={bot.imageUrl}
          alt={bot.name}
          layout="fill"
          objectFit="cover"
          className={`transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}
        />
      </div>
      
      {/* チャット入力欄 */}
      <div className="p-3">
        {/* 入力欄と送信ボタン */}
        <div className="relative mt-2">
          <input 
            type="text" 
            placeholder="メッセージを入力..."
            className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onChange={(e) => {
              // 入力値をローカルストレージなどに保存することも可能
              try {
                if (bot.id) {
                  localStorage.setItem(`chat_input_${bot.id}`, e.target.value);
                }
              } catch (e) {
                console.error('LocalStorage error:', e);
              }
            }}
          />
          <button
            className="absolute right-0 top-0 h-full bg-indigo-600 text-white px-4 rounded-r-full hover:bg-indigo-700 transition-colors"
            onClick={() => {
              try {
                // ポップアップを開く前に現在の入力値を保存
                const inputValue = bot.id ? (localStorage.getItem(`chat_input_${bot.id}`) || '') : '';
                
                // チャットボットの詳細ページにURLパラメータとして入力値を渡す
                if (bot.id) {
                  window.location.href = `/bots/${bot.id}?message=${encodeURIComponent(inputValue)}`;
                } else {
                  console.error('Bot ID is missing');
                }
              } catch (e) {
                console.error('Navigation error:', e);
              };
            }}
          >
            送信
          </button>
        </div>
        
        {/* ポイント表示 - 右下に配置 */}
        <div className="text-right font-bold text-indigo-600 mt-2">
          {bot.points !== undefined ? `${bot.points} P` : '0 P'}
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

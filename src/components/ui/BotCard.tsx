"use client";

import Image from 'next/image';
import { Bot } from '@/types/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CharacterIcon, { CharacterType } from './CharacterIcon';
import { getCurrentUser } from '@/lib/auth';

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
  // React Hooksは条件分岐の前に呼び出す必要がある
  const [message, setMessage] = useState('');
  const router = useRouter();

  if (!bot || !bot.id) {
    return null;
  }

  const characterType = categoryToCharacterType[bot.category || ''] || categoryToCharacterType.default;
  const botName = bot.name || '無名のボット';
  const botImageUrl = bot.imageUrl || '/images/placeholder.png';

  const cardSizeClass = size === 'large' ? 'w-full' : 'w-full';
  const imageAspectRatioClass = 'aspect-[16/9]';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // カードクリックイベントの伝播を停止
    if (!message.trim()) return;

    try {
      // ユーザー認証確認
      const user = await getCurrentUser();
      if (!user) {
        alert('ログインが必要です');
        router.push('/account/login');
        return;
      }

      // セッション取得
      const { supabase } = await import('@/lib/auth');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        alert('認証情報が見つかりません。再ログインしてください。');
        router.push('/account/login');
        return;
      }

      // ボット利用APIを呼び出し
      const response = await fetch('/api/bot/use', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          bot_id: bot.id,
          message: message.trim()
        })
      });

      const result = await response.json();

      if (!result.success) {
        if (result.error === 'Insufficient points') {
          alert(`ポイント不足です。\n\n${bot.name}の利用には${result.data?.required_points}ポイントが必要です。\n現在のポイント: ${result.data?.current_points}P\n\nポイントを購入しますか？`);
          // ポイント購入ページへリダイレクト
          router.push('/account/points/purchase');
          return;
        }
        throw new Error(result.error);
      }

      // 成功時の処理
      alert(`✅ ${bot.name}からの応答:\n\n${result.data?.bot_response}\n\n📊 ポイント消費: ${result.data?.points_consumed}P\n💰 残りポイント: ${result.data?.new_balance}P`);
      setMessage('');

      // ポイント残高が更新されたことをヘッダーに通知（実装されている場合）
      window.dispatchEvent(new CustomEvent('pointsUpdated'));

    } catch (error) {
      console.error('Bot use error:', error);
      alert('❌ ボットの利用に失敗しました。\n\nエラー: ' + (error instanceof Error ? error.message : '不明なエラー') + '\n\n再度お試しください。');
    }
  };

  const handleCardClick = () => {
    if (bot && bot.id) {
      window.location.href = `/bots/${bot.id}`;
    }
  };

  return (
    <div 
      className={`relative flex flex-col isolate w-full min-h-[340px] rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer ${compact ? 'max-w-xs' : 'max-w-md'}`}
      onClick={handleCardClick}
    >
      {/* アイコン */}
      <div className="absolute -top-3 -left-3 z-20">
        <CharacterIcon 
          type={characterType} 
          size={compact ? 'medium' : 'large'} 
        />
      </div>

      {/* メイン画像 */}
      <div className={`relative w-full overflow-hidden rounded-t-xl ${compact ? 'h-40' : 'h-48'}`}>
        <Image
          src={botImageUrl}
          alt={botName}
          fill
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('placeholder.png')) {
              target.src = '/images/placeholder.png';
            }
          }}
        />
        {/* 機能アイコン表示エリア */}
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          {bot.can_upload_image && <span className="text-2xl" title="画像アップロード対応">🖼️</span>}
          {bot.can_send_file && <span className="text-2xl" title="ファイル送信対応">📎</span>}
        </div>
      </div>
      
      {/* カード下部コンテンツ */}
      <div className="flex flex-col flex-1 p-3">
        {/* タイトル */}
        <h3 className={`mt-5 px-4 text-center font-bold leading-tight ${compact ? 'text-base' : 'text-lg'}`}>
          {botName}
        </h3>

        {/* 説明文 */}
        {bot.description && (
          <p className="flex-1 mt-2 text-gray-600 line-clamp-2 ${compact ? 'text-sm' : 'text-base'}">
            {bot.description}
          </p>
        )}
        
        {/* 下部要素（入力欄とポイント） */}
        <div className="mt-auto">
          <div className="relative mt-3">
            <input
              type="text"
              className={`w-full border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 ${compact ? 'py-1 pl-3 pr-16 text-xs' : 'py-2 pl-4 pr-24 text-sm'}`}
              placeholder="メッセージを入力..."
              value={message}
              onChange={handleInputChange}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendClick(e);
                }
              }}
            />
            <button
              className={`absolute right-0 top-0 h-full bg-indigo-600 text-white rounded-r-full hover:bg-indigo-700 transition-colors ${compact ? 'px-2 text-xs' : 'px-4'}`}
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
    </div>
  );
};

export default BotCard;

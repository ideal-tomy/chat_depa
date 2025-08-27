import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Bot } from '@/types';
import { getCurrentUser } from '@/lib/auth';
import { categoryToCharacterType } from '@/lib/bot-classification';

interface BotCardProps {
  bot: Bot | undefined | null;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'standard' | 'compact';
  hideForm?: boolean;
  // backward compatibility
  compact?: boolean;
  isLarge?: boolean; // 大きなカード表示フラグ
}

const BotCard: React.FC<BotCardProps> = ({ bot, size = 'md', variant = 'standard', hideForm = false, compact = false, isLarge = false }) => {
  const [message, setMessage] = useState('');
  const router = useRouter();

  // 1. Botオブジェクトの存在をより厳密にチェック
  if (!bot || !bot.id) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('BotCard received an invalid bot object:', bot);
    }
    return null; 
  }

  // 2. 安全にアイコンタイプを取得
  const getCharacterType = () => {
    // categoryToCharacterType自体が読み込まれているか確認
    if (typeof categoryToCharacterType !== 'object' || categoryToCharacterType === null) {
      console.error("`categoryToCharacterType` is not a valid object.");
      return 'default';
    }
    // bot.categoryが存在し、かつマッピングオブジェクトにキーが存在するか
    const categoryKey = bot.category && bot.category in categoryToCharacterType 
      ? bot.category 
      : 'default';
    // 最終的な値が存在するか確認
    return categoryToCharacterType[categoryKey] || categoryToCharacterType['default'];
  };

  const characterType = getCharacterType();
  const botName = bot.name || '無名のボット';

  const handleSendClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!message.trim()) return;

    const user = await getCurrentUser();
    if (!user) {
      // 未ログイン時はログインページにリダイレクト
      router.push(`/account/login?redirect=${encodeURIComponent(`/bots/${bot.id}?message=${encodeURIComponent(message.trim())}`)}`);
      return;
    }

    // ログイン済みの場合は専用ページに遷移
    router.push(`/bots/${bot.id}?message=${encodeURIComponent(message.trim())}`);
  };
  
  const handleCardClick = () => {
    router.push(`/bots/${bot.id}`);
  };

  // 3. コンテンツベースの高さでレイアウト（固定高さを廃止）
  const containerBase = isLarge 
    ? "relative flex flex-col w-full min-h-[280px] sm:min-h-[320px] rounded-xl bg-white shadow-lg border border-gray-200 transition-transform hover:scale-105 cursor-pointer isolate overflow-hidden p-4 sm:p-6 group"
    : "relative flex flex-col w-full min-h-[160px] sm:min-h-[200px] rounded-xl bg-white shadow-md border border-gray-200 transition-transform hover:scale-105 cursor-pointer isolate overflow-hidden p-3 sm:p-4 group";
  
  return (
    <div 
      onClick={handleCardClick}
      className={containerBase}
    >
      {/* ヘッダー部分：アイコン + タイトル + ポイント */}
      <div className="flex items-start gap-2 sm:gap-3 mb-3">
        {/* アイコン（アニメーション付き） */}
        <div className={`flex-shrink-0 ${isLarge ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-8 h-8 sm:w-10 sm:h-10'}`}>
          <Image
            src={`/images/${characterType}.png`}
            alt={`${botName}のアイコン`}
            width={isLarge ? 56 : 40}
            height={isLarge ? 56 : 40}
            className={`rounded-full border-2 border-white shadow-md w-full h-full object-cover ${isLarge ? 'animate-bounce' : ''}`}
            onError={(e) => {
              e.currentTarget.src = '/images/sumple01.png'; // フォールバック
            }}
          />
        </div>

        {/* タイトル（最大スペース確保） */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold leading-tight text-gray-800 group-hover:text-indigo-600 mb-1 ${isLarge ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'}`}>
            {botName}
          </h3>
        </div>

        {/* ポイント表示 */}
        <div className={`flex-shrink-0 px-2 py-1 bg-indigo-700 text-white font-bold rounded ${isLarge ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
          {bot.points || 0}P
        </div>
      </div>

      {/* 説明文（固定行数で高さを制御） */}
      <div className="mb-4">
        <p className={`text-gray-600 leading-relaxed line-clamp-3 ${isLarge ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
          {bot.description || '説明がありません。'}
        </p>
      </div>
      
      {/* 送信フォーム（下部に配置） */}
      <div className="mt-auto">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              setMessage(e.target.value);
            }}
            placeholder="メッセージを入力..."
            className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${isLarge ? 'text-base' : 'text-sm'}`}
          />
          <button
            onClick={handleSendClick}
            className={`px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap ${isLarge ? 'text-base' : 'text-sm'}`}
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotCard;

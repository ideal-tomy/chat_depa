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
}

const BotCard: React.FC<BotCardProps> = ({ bot, size = 'md', variant = 'standard', hideForm = false, compact = false }) => {
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

  // 3. カードサイズの統一とレスポンシブ対応レイアウト修正
  const isCompact = variant === 'compact' || compact;
  // スマホ: h-[200px] (大幅縮小), タブレット: h-[280px], デスクトップ: h-[380px]
  const containerBase = "relative flex flex-col w-full h-[200px] sm:h-[280px] md:h-[380px] rounded-xl bg-white shadow-md border border-gray-200 transition-transform hover:scale-105 cursor-pointer isolate overflow-hidden p-2 sm:p-3 md:p-4 group";
  const containerClassName = containerBase;
  return (
    <div 
      onClick={handleCardClick}
      className={containerClassName}
    >
      {/* アイコン */}
      <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 z-10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
        <Image
          src={`/images/${characterType}.png`}
          alt={`${botName}のアイコン`}
          width={48}
          height={48}
          className="rounded-full border-2 border-white shadow-md w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/sumple01.png'; // フォールバック
          }}
        />
      </div>

      {/* ポイント表示 */}
      <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 md:top-4 md:right-4 z-10 px-1 py-0.5 sm:px-1.5 sm:py-0.5 md:px-2 md:py-1 bg-indigo-700 text-white text-[10px] sm:text-xs md:text-sm font-bold rounded">
        {bot.points || 0}P
      </div>

      {/* カードコンテンツ */}
      <div className="flex flex-col flex-grow pt-8 sm:pt-10 md:pt-12">
        {/* タイトル */}
        <div className="min-h-[2rem] sm:min-h-[3rem] md:min-h-[4rem] flex items-center justify-center mb-1 sm:mb-2">
            <h3 className="text-center font-semibold text-sm sm:text-base md:text-lg leading-tight text-gray-800 line-clamp-2 group-hover:text-indigo-600">
                {botName}
            </h3>
        </div>

        {/* 説明文 */}
        <div className="flex-grow">
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 md:line-clamp-4 leading-tight">
                {bot.description || '説明がありません。'}
            </p>
        </div>
        
        {/* 送信フォーム */}
        <div className="mt-auto flex-shrink-0">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <input
                type="text"
                value={message}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation();
                  setMessage(e.target.value);
                }}
                placeholder="メッセージを入力..."
                className="flex-grow w-full px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2.5 text-[10px] sm:text-xs md:text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleSendClick}
                className="px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-4 md:py-2 text-[10px] sm:text-xs md:text-sm font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                送信
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default BotCard;

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Bot } from '@/types/types';
import { getCurrentUser } from '@/lib/auth';
import { categoryToCharacterType } from '@/lib/bot-classification';

interface BotCardProps {
  bot: Bot | undefined | null;
  compact?: boolean;
}

const BotCard: React.FC<BotCardProps> = ({ bot, compact = false }) => {
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
      alert('ログインが必要です');
      router.push('/account/login');
      return;
    }

    const { supabaseBrowser: supabase } = await import('@/lib/supabase/browser');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      alert('認証情報が見つかりません。再ログインしてください。');
      router.push('/account/login');
      return;
    }

    try {
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
          router.push('/account/points/purchase');
          return;
        }
        throw new Error(result.error);
      }

      alert(`✅ ${bot.name}からの応答:\n\n${result.data?.bot_response}\n\n📊 ポイント消費: ${result.data?.points_consumed}P\n💰 残りポイント: ${result.data?.new_balance}P`);
      setMessage('');
      window.dispatchEvent(new CustomEvent('pointsUpdated'));
    } catch (error) {
      console.error('Bot use error:', error);
      alert('❌ ボットの利用に失敗しました。\n\nエラー: ' + (error instanceof Error ? error.message : '不明なエラー') + '\n\n再度お試しください。');
    }
  };
  
  const handleCardClick = () => {
    router.push(`/bots/${bot.id}`);
  };

  // 3. カードサイズの統一とレイアウト修正
  return (
    <div 
      onClick={handleCardClick}
      className="relative flex flex-col w-full h-[380px] rounded-xl bg-white shadow-lg transition-transform hover:scale-105 cursor-pointer isolate overflow-hidden p-4 group"
    >
      {/* アイコン */}
      <div className="absolute top-3 left-3 z-10 w-12 h-12">
        <Image
          src={`/images/${characterType}.png`}
          alt={`${botName}のアイコン`}
          width={48}
          height={48}
          className="rounded-full border-2 border-white shadow-md"
          onError={(e) => {
            e.currentTarget.src = '/images/sumple01.png'; // フォールバック
          }}
        />
      </div>

      {/* ポイント表示 */}
      <div className="absolute top-4 right-4 z-10 px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded">
        {bot.points || 0}P
      </div>

      {/* カードコンテンツ */}
      <div className="flex flex-col flex-grow pt-12">
        {/* タイトル */}
        <div className="h-16 flex items-center justify-center mb-2">
            <h3 className="text-center font-semibold text-lg leading-tight text-gray-800 line-clamp-2 group-hover:text-indigo-600">
                {botName}
            </h3>
        </div>

        {/* 説明文 */}
        <div className="flex-grow">
            <p className="text-sm text-gray-600 line-clamp-4">
                {bot.description || '説明がありません。'}
            </p>
        </div>
        
        {/* 送信フォーム */}
        {!compact && (
          <div className="mt-auto flex-shrink-0">
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
                className="flex-grow w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleSendClick}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                送信
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BotCard;

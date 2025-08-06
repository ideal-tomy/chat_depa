import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Bot } from '@/types/types';
import { getCurrentUser } from '@/lib/auth';
import { categoryToCharacterType } from '@/lib/bot-classification';

interface BotCardProps {
  bot: Bot | undefined | null; // botがundefinedやnullの可能性を許容
  size?: 'standard' | 'large';
  compact?: boolean;
}

const BotCard: React.FC<BotCardProps> = ({ bot, compact = false }) => {
  const [message, setMessage] = useState('');
  const router = useRouter();

  // botオブジェクトが存在しない場合は、何もレンダリングしない
  if (!bot || !bot.id) {
    return null; 
  }

  const characterType = categoryToCharacterType[bot.category || ''] || categoryToCharacterType.default;
  const botName = bot.name || '無名のボット';
  const botImageUrl = bot.imageUrl || '/images/placeholder.png';

  const handleSendClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!message.trim()) return;

    const user = await getCurrentUser();
    if (!user) {
      alert('ログインが必要です');
      router.push('/account/login');
      return;
    }

    const { supabase } = await import('@/lib/supabase/client');
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

  return (
    <div 
      onClick={handleCardClick}
      className="relative flex flex-col w-full rounded-xl bg-white shadow-lg transition-transform hover:scale-105 cursor-pointer isolate overflow-hidden"
    >
      <div className="absolute -top-3 -left-3 z-10 w-12 h-12">
        <Image
          src={`/images/icons/sample/${characterType}.png`}
          alt=""
          width={48}
          height={48}
          className="rounded-full border-2 border-white shadow-md"
        />
      </div>

      <div className="flex flex-col flex-grow p-4">
        <div className="pt-8 mb-2 flex-shrink-0">
          <h3 className="text-center font-semibold text-lg leading-tight text-gray-800">
            {botName}
          </h3>
        </div>

        <div className="flex-grow mb-4">
          <p className="text-sm text-gray-600 line-clamp-3">
            {bot.description}
          </p>
        </div>
        
        {!compact && (
          <div className="mt-auto flex-shrink-0">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
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
            <div className="text-right text-xs text-gray-500 mt-1">
              {bot.points}P
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BotCard;

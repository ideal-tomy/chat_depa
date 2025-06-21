import { Bot } from '@/types/types';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

interface BotDetailHeaderProps {
  bot: Bot;
}

export default function BotDetailHeader({ bot }: BotDetailHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-primary/90 to-primary-dark/90 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-4">
          <Link 
            href="/bots" 
            className="inline-flex items-center text-white/90 hover:text-white transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            <span>ボット一覧に戻る</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Bot画像 */}
          <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-white rounded-xl overflow-hidden relative shadow-md">
            {bot.imageUrl ? (
              <Image
                src={bot.imageUrl} 
                alt={bot.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-400">{bot.name.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Bot情報 */}
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{bot.name}</h1>
              {bot.isNew && (
                <span className="bg-yellow-500 text-yellow-900 text-xs font-medium px-2 py-1 rounded-full">
                  NEW
                </span>
              )}
              {bot.isPopular && (
                <span className="bg-rose-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  人気
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {bot.category}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {typeof bot.costPoints === 'number' ? bot.costPoints : 0} P
              </span>
            </div>

            <p className="text-white/90 max-w-3xl">{bot.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

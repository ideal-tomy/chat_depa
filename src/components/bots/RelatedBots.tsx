import { Bot } from '@/types/types';
import Link from 'next/link';
import Image from 'next/image';

interface RelatedBotsProps {
  bots: Bot[];
}

export default function RelatedBots({ bots }: RelatedBotsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-gray-800 font-medium mb-4">関連Bot</h3>
      
      <div className="space-y-4">
        {bots.map((bot) => (
          <Link 
            key={bot.id} 
            href={`/bots/${bot.id}`}
            className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            {/* Bot画像 */}
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0 mr-3">
              {bot.imageUrl ? (
                <Image
                  src={bot.imageUrl}
                  alt={bot.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-400">{bot.name.charAt(0)}</span>
                </div>
              )}
            </div>
            
            {/* Bot情報 */}
            <div className="flex-grow min-w-0">
              <h4 className="font-medium text-sm text-gray-900 truncate">{bot.name}</h4>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {bot.category}
                </span>
                <span className="text-xs font-medium text-primary">
                  {bot.costPoints}P
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

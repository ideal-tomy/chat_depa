import { Bot } from '@/types/types';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface BotInfoCardProps {
  bot: Bot;
}

export default function BotInfoCard({ bot }: BotInfoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 text-gray-800 font-medium mb-4">
        <InformationCircleIcon className="h-5 w-5 text-primary" />
        <h3>Bot情報</h3>
      </div>
      
      {/* カテゴリと消費ポイント */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">カテゴリ:</span>
          <span className="font-medium">{bot.category}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">消費ポイント:</span>
          <span className="font-medium text-primary">{bot.costPoints}ポイント</span>
        </div>
      </div>
      
      {/* 使用例セクション */}
      {bot.useCases && bot.useCases.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">使用例:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {bot.useCases.map((useCase, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* 使い方説明 */}
      {bot.instructions && (
        <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700">
          <h4 className="font-medium mb-1">使い方:</h4>
          <p>{bot.instructions}</p>
        </div>
      )}
    </div>
  );
}

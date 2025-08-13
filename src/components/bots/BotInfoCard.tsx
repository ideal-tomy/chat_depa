import { Bot } from '@/types';
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
      
      {/* このボットでできること */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">このボTットでできること:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li className="flex items-center">
            <span className="mr-2">✅</span>
            <span>テキストでの会話</span>
          </li>
          <li className="flex items-center">
            {bot.can_upload_image ? (
              <><span className="mr-2">✅</span><span>画像のアップロード</span></>
            ) : (
              <><span className="mr-2">❌</span><span>画像のアップロード</span></>
            )}
          </li>
          <li className="flex items-center">
            {bot.can_send_file ? (
              <><span className="mr-2">✅</span><span>ファイルの送信</span></>
            ) : (
              <><span className="mr-2">❌</span><span>ファイルの送信</span></>
            )}
          </li>
        </ul>
      </div>

      {/* 使用例セクション */}
      {(() => {
        let displayUseCases = [];
        if (bot.useCases) {
          try {
            if (Array.isArray(bot.useCases)) {
              displayUseCases = bot.useCases;
            } else if (typeof bot.useCases === 'string') {
              displayUseCases = JSON.parse(bot.useCases);
            }
          } catch (e) {
            console.error('Failed to parse useCases:', e);
          }
        }

        return displayUseCases.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">使用例:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {displayUseCases.map((useCase: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })()}
      

    </div>
  );
}

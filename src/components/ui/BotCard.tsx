import Image from 'next/image';
import { Bot } from '@/types/types';

interface BotCardProps {
  bot: Bot;
}

const BotCard: React.FC<BotCardProps> = ({ bot }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="relative h-48 w-full">
        <Image
          src={bot.imageUrl}
          alt={bot.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{bot.name}</h3>
        <p className="text-sm text-gray-600 mb-2 h-10 overflow-hidden">{bot.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="bg-gray-200 rounded-full px-2 py-1">{bot.category}</span>
          <div className="flex items-center">
            <Image
              src={bot.authorIcon}
              alt={bot.author}
              width={20}
              height={20}
              className="rounded-full mr-1"
            />
            <span>{bot.author}</span>
          </div>
        </div>
        <div className="text-right font-bold text-indigo-600">
          {bot.points.toLocaleString()} P
        </div>
      </div>
    </div>
  );
};

export default BotCard;

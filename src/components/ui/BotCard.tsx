'use client';

import Image from 'next/image';
import Link from 'next/link';

interface BotCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  pointCost: number;
  imageUrl?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export default function BotCard({
  id,
  name,
  description,
  category,
  pointCost,
  imageUrl = '/images/bot-placeholder.png',
  isNew = false,
  isPopular = false,
}: BotCardProps) {
  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
      <div className="flex items-center mb-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-accent-blue flex items-center justify-center text-white text-lg font-bold overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`${name} icon`}
                width={48}
                height={48}
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IiM0QTkwRTIiLz48L3N2Zz4="
              />
            ) : (
              name.charAt(0)
            )}
          </div>
          {isNew && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">New</span>
          )}
        </div>
        <div className="ml-4">
          <h3 className="font-bold text-text-dark">{name}</h3>
          <p className="text-sm text-text-light">{category}</p>
        </div>
        {isPopular && (
          <span className="ml-auto bg-accent-yellow text-text-dark text-xs px-2 py-1 rounded-full">人気</span>
        )}
      </div>
      <p className="text-text-dark mb-4 text-sm line-clamp-2">{description}</p>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm">
          <span className="font-bold text-text-dark">{pointCost}</span>
          <span className="text-text-light"> ポイント/回</span>
        </span>
      </div>
      <div className="flex justify-between gap-2">
        <Link 
          href={`/bots/${id}`}
          className="flex-1 bg-white border border-accent-blue text-accent-blue text-center py-2 rounded hover:bg-accent-blue hover:text-white transition-colors duration-300 text-sm"
        >
          詳細
        </Link>
        <Link 
          href={`/chat/${id}`}
          className="flex-1 bg-accent-yellow text-text-dark text-center py-2 rounded hover:bg-opacity-80 transition-colors duration-300 text-sm"
        >
          試してみる
        </Link>
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types';

interface BlogCardProps {
  post: Post;
}

export default function BlogCard(props: any): JSX.Element {
  // 日付フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const defaultImageUrl = '/images/blog-placeholder.jpg';

  return (
    <Link href={`/news/${post.id}`} className="block group">
      <div className="overflow-hidden rounded-lg shadow-sm border hover:shadow-md transition-all duration-300">
        {/* サムネイル画像 */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.imageUrl || defaultImageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNFRUVFRUUiLz48L3N2Zz4="
          />
          <div className="absolute top-4 left-4 bg-accent-blue text-white text-xs py-1 px-2 rounded">
            {post.category}
          </div>
        </div>
        
        {/* コンテンツ */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-text-dark mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>
          
          {/* Postにはexcerptプロパティがないため、表示しない */}
          
          <div className="flex items-center justify-between text-xs text-text-light">
            <span>{formatDate(post.date)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}


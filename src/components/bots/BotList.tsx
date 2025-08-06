'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Bot } from '@/types/types';
import BotCard from '@/components/ui/BotCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { FilterState as BotFilterState } from './BotFilter';
import { groupBotsByNewCategory, getNewCategory } from '@/lib/bot-classification';

const BOTS_PER_PAGE = 12;

interface BotListProps {
  filters: {
    category: string | null;
    search: string;
    pointRange: [number, number] | null;
  };
  botFilterState: BotFilterState;
}

// ボットデータの型変換ヘルパー
const formatBot = (botData: any): Bot => ({
  ...botData,
  authorIcon: botData.author_icon,
  imageUrl: botData.image_url,
  useCases: botData.use_cases,
  isNew: botData.created_at && new Date(botData.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  isPopular: botData.points > 150,
  complexity: botData.complexity || 'medium',
  can_upload_image: botData.can_upload_image,
  can_send_file: botData.can_send_file,
});

// モックデータ（データベースからデータが取得できない場合のfallback）
const getMockBots = (): Bot[] => [
  {
    id: 'mock-1',
    name: '補助金書類を提出直前まで作ってくれる君',
    description: '◯年度版の様式2、最新版でいい？」と毎回確認してくる慎重派。実際に叩き台まで作ってくれる。',
    category: 'ビジネス',
    author: 'システム',
    authorIcon: '/images/sumple01.png',
    imageUrl: '/images/sumple01.png',
    points: 120,
    costPoints: 120,
    can_upload_image: false,
    can_send_file: true,
    isNew: true,
    isPopular: false,
    complexity: 'medium'
  },
  {
    id: 'mock-2',
    name: 'SNS投稿アイデアBot',
    description: 'バズる投稿のアイデアを無限に生成。ハッシュタグやトレンドを分析して効果的な投稿をサポート。',
    category: 'マーケティング',
    author: 'システム',
    authorIcon: '/images/sumple02.png',
    imageUrl: '/images/sumple02.png',
    points: 150,
    costPoints: 150,
    can_upload_image: true,
    can_send_file: false,
    isNew: false,
    isPopular: true,
    complexity: 'medium'
  },
  {
    id: 'mock-3',
    name: 'プログラミング学習Bot',
    description: 'コードレビューから学習プランまで、プログラミング学習を総合サポート。初心者から上級者まで対応。',
    category: 'プログラミング',
    author: 'システム',
    authorIcon: '/images/sumple03.png',
    imageUrl: '/images/sumple03.png',
    points: 180,
    costPoints: 180,
    can_upload_image: false,
    can_send_file: true,
    isNew: false,
    isPopular: true,
    complexity: 'advanced'
  },
  {
    id: 'mock-4',
    name: '料理レシピ提案Bot',
    description: '冷蔵庫の中身や好みに合わせて、オリジナルレシピを提案。栄養バランスも考慮した健康的な料理。',
    category: 'ライフスタイル',
    author: 'システム',
    authorIcon: '/images/sumple04.png',
    imageUrl: '/images/sumple04.png',
    points: 100,
    costPoints: 100,
    can_upload_image: true,
    can_send_file: false,
    isNew: true,
    isPopular: false,
    complexity: 'simple'
  },
  {
    id: 'mock-5',
    name: 'デザイン添削Bot',
    description: 'ロゴやWebデザインの添削とアドバイス。デザインの改善点を具体的に指摘します。',
    category: 'デザイン',
    author: 'システム',
    authorIcon: '/images/sumple01.png',
    imageUrl: '/images/sumple01.png',
    points: 200,
    costPoints: 200,
    can_upload_image: true,
    can_send_file: true,
    isNew: false,
    isPopular: true,
    complexity: 'advanced'
  },
  {
    id: 'mock-6',
    name: '旅行プランニングBot',
    description: '予算と好みに合わせた最適な旅行プランを提案。現地の穴場スポットまで詳しく案内。',
    category: '旅行',
    author: 'システム',
    authorIcon: '/images/sumple02.png',
    imageUrl: '/images/sumple02.png',
    points: 130,
    costPoints: 130,
    can_upload_image: false,
    can_send_file: false,
    isNew: false,
    isPopular: false,
    complexity: 'medium'
  }
];

export default function BotList({ filters, botFilterState }: BotListProps) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [groupedBots, setGroupedBots] = useState<Record<string, Bot[]>>({});
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const isFiltered = !!(filters.category || filters.search || filters.pointRange || botFilterState.showImageUpload || botFilterState.showFileUpload);

  const fetchFilteredBots = useCallback(async (currentPage: number) => {
    if (isLoading) return;
    console.log('fetchFilteredBots: Starting filtered query...');
    setIsLoading(true);

    try {
      const from = currentPage * BOTS_PER_PAGE;
      const to = from + BOTS_PER_PAGE - 1;

      let query = supabase.from('bots').select('*').order('created_at', { ascending: true }).range(from, to);

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      if (filters.pointRange) {
        query = query.gte('points', filters.pointRange[0]).lte('points', filters.pointRange[1]);
      }
      if (botFilterState.showImageUpload) {
        query = query.eq('can_upload_image', true);
      }
      if (botFilterState.showFileUpload) {
        query = query.eq('can_send_file', true);
      }

      const { data, error } = await query;

      console.log('fetchFilteredBots: Query result:', { data, error, dataLength: data?.length });

      if (error) {
        console.error('fetchFilteredBots: Database error, using filtered mock data:', error);
        // エラーの場合はモックデータをフィルタリングして使用
        let mockBots = getMockBots();
        
        // フィルタリングを適用
        if (filters.category && filters.category !== 'all') {
          mockBots = mockBots.filter(bot => bot.category === filters.category);
        }
        if (filters.search) {
          mockBots = mockBots.filter(bot => 
            bot.name.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        if (filters.pointRange) {
          mockBots = mockBots.filter(bot => 
            bot.points >= filters.pointRange![0] && bot.points <= filters.pointRange![1]
          );
        }
        if (botFilterState.showImageUpload) {
          mockBots = mockBots.filter(bot => bot.can_upload_image);
        }
        if (botFilterState.showFileUpload) {
          mockBots = mockBots.filter(bot => bot.can_send_file);
        }

        // ページネーション
        const startIndex = currentPage * BOTS_PER_PAGE;
        const endIndex = startIndex + BOTS_PER_PAGE;
        const paginatedBots = mockBots.slice(startIndex, endIndex);

        console.log('fetchFilteredBots: Using filtered mock data:', paginatedBots);
        setBots((prev) => (currentPage === 0 ? paginatedBots : [...prev, ...paginatedBots]));
        setPage(currentPage + 1);
        setHasMore(endIndex < mockBots.length);
      } else if (data && data.length > 0) {
        console.log('fetchFilteredBots: Processing database data...');
        const newBots = data.map(formatBot);
        console.log('fetchFilteredBots: Formatted bots:', newBots);
        setBots((prev) => (currentPage === 0 ? newBots : [...prev, ...newBots]));
        setPage(currentPage + 1);
        setHasMore(data.length === BOTS_PER_PAGE);
      } else {
        console.log('fetchFilteredBots: No database data, using filtered mock data');
        // データがない場合もモックデータを使用
        let mockBots = getMockBots();
        
        // フィルタリングを適用
        if (filters.category && filters.category !== 'all') {
          mockBots = mockBots.filter(bot => bot.category === filters.category);
        }
        if (filters.search) {
          mockBots = mockBots.filter(bot => 
            bot.name.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        if (filters.pointRange) {
          mockBots = mockBots.filter(bot => 
            bot.points >= filters.pointRange![0] && bot.points <= filters.pointRange![1]
          );
        }
        if (botFilterState.showImageUpload) {
          mockBots = mockBots.filter(bot => bot.can_upload_image);
        }
        if (botFilterState.showFileUpload) {
          mockBots = mockBots.filter(bot => bot.can_send_file);
        }

        // ページネーション
        const startIndex = currentPage * BOTS_PER_PAGE;
        const endIndex = startIndex + BOTS_PER_PAGE;
        const paginatedBots = mockBots.slice(startIndex, endIndex);

        console.log('fetchFilteredBots: Using filtered mock data (no database data):', paginatedBots);
        setBots((prev) => (currentPage === 0 ? paginatedBots : [...prev, ...paginatedBots]));
        setPage(currentPage + 1);
        setHasMore(endIndex < mockBots.length);
      }
    } catch (catchError) {
      console.error('fetchFilteredBots: Catch error, using mock data:', catchError);
      // ネットワークエラーなどの場合もモックデータを使用
      let mockBots = getMockBots();
      
      // フィルタリングを適用
      if (filters.category && filters.category !== 'all') {
        mockBots = mockBots.filter(bot => bot.category === filters.category);
      }
      if (filters.search) {
        mockBots = mockBots.filter(bot => 
          bot.name.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      if (filters.pointRange) {
        mockBots = mockBots.filter(bot => 
          bot.points >= filters.pointRange![0] && bot.points <= filters.pointRange![1]
        );
      }
      if (botFilterState.showImageUpload) {
        mockBots = mockBots.filter(bot => bot.can_upload_image);
      }
      if (botFilterState.showFileUpload) {
        mockBots = mockBots.filter(bot => bot.can_send_file);
      }

      // ページネーション
      const startIndex = currentPage * BOTS_PER_PAGE;
      const endIndex = startIndex + BOTS_PER_PAGE;
      const paginatedBots = mockBots.slice(startIndex, endIndex);

      console.log('fetchFilteredBots: Using filtered mock data (catch error):', paginatedBots);
      setBots((prev) => (currentPage === 0 ? paginatedBots : [...prev, ...paginatedBots]));
      setPage(currentPage + 1);
      setHasMore(endIndex < mockBots.length);
    }
    
    setIsLoading(false);
  }, [filters, botFilterState, isLoading]);

  const fetchGroupedBots = async () => {
    console.log('fetchGroupedBots: Starting to fetch data...');
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.from('bots').select('*').order('created_at', { ascending: false });

      console.log('fetchGroupedBots: Query result:', { data, error });

      if (error) {
        console.error('fetchGroupedBots: Database error, using mock data:', error);
        // データベースエラーの場合はモックデータを使用
        const mockBots = getMockBots();
        const botsByCategory = mockBots.reduce((acc, bot) => {
          const category = bot.category || 'その他';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(bot);
          return acc;
        }, {} as Record<string, Bot[]>);
        console.log('fetchGroupedBots: Using mock data:', botsByCategory);
        setGroupedBots(botsByCategory);
      } else if (data && data.length > 0) {
        console.log('fetchGroupedBots: Raw data length:', data.length);
        const allBots = data.map(formatBot);
        console.log('fetchGroupedBots: Formatted bots length:', allBots.length);
        const botsByCategory = groupBotsByNewCategory(allBots);
        console.log('fetchGroupedBots: Grouped bots from database:', botsByCategory);
        setGroupedBots(botsByCategory);
      } else {
        console.log('fetchGroupedBots: No data from database, using mock data');
        // データベースにデータがない場合もモックデータを使用
        const mockBots = getMockBots();
        const botsByCategory = mockBots.reduce((acc, bot) => {
          const category = bot.category || 'その他';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(bot);
          return acc;
        }, {} as Record<string, Bot[]>);
        console.log('fetchGroupedBots: Using mock data (no database data):', botsByCategory);
        setGroupedBots(botsByCategory);
      }
    } catch (catchError) {
      console.error('fetchGroupedBots: Catch error, using mock data:', catchError);
      // ネットワークエラーなどの場合もモックデータを使用
      const mockBots = getMockBots();
      const botsByCategory = mockBots.reduce((acc, bot) => {
        const category = bot.category || 'その他';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(bot);
        return acc;
      }, {} as Record<string, Bot[]>);
      console.log('fetchGroupedBots: Using mock data (catch error):', botsByCategory);
      setGroupedBots(botsByCategory);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    console.log('BotList useEffect triggered with filters:', filters, 'botFilterState:', botFilterState);
    console.log('isFiltered:', isFiltered);
    
    // 初期化
    setBots([]);
    setGroupedBots({});
    setPage(0);
    setHasMore(true);
    
    // 安定性のために少し遅延を追加
    const timer = setTimeout(() => {
      if (isFiltered) {
        console.log('Calling fetchFilteredBots...');
        fetchFilteredBots(0);
      } else {
        console.log('Calling fetchGroupedBots...');
        fetchGroupedBots();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, botFilterState]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isLoading && isFiltered) {
      fetchFilteredBots(page);
    }
  }, [hasMore, isLoading, isFiltered, page, fetchFilteredBots]);

  useEffect(() => {
    const option = { root: null, rootMargin: '20px', threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, option);
    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }
    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [handleObserver]);

  // ローディング表示の条件を緩和（データがあれば表示優先）
  const hasData = bots.length > 0 || Object.keys(groupedBots).length > 0;
  
  if (isLoading && !hasData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
      </div>
    );
  }

  return (
    <div>
      {isFiltered ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bots.map((bot) => <BotCard key={bot.id} bot={bot} />)}
          </div>
          <div ref={loader} />
          {isLoading && (
             <div className="flex justify-center items-center p-4 col-span-full">
                <p>読み込み中...</p>
             </div>
          )}
        </>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedBots).map(([category, categoryBots]) => (
            <section key={category}>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryBots.map((bot) => <BotCard key={bot.id} bot={bot} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

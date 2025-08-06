'use client';

import { useState, useEffect } from 'react';
import FilterBarWrapper from '@/components/wrappers/FilterBarWrapper';
import { Category, PointRange, SortOrder, Bot } from '@/types/types';
import BotList from '@/components/bots/BotList';
import BotFilter from './BotFilter';
import MobileFilterDrawer from '@/components/ui/MobileFilterDrawer';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/Skeleton';

const BOTS_PER_PAGE = 20;

const sortOrders: SortOrder[] = [
  { id: 'popular', label: '人気順' },
  { id: 'newest', label: '新着順' },
];

interface FilterState {
  category: string;
  pointRange: string;
  sortOrder: string;
}

export default function BotPageClient() {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    pointRange: 'all',
    sortOrder: 'popular',
  });
  const [initialBots, setInitialBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pointRanges, setPointRanges] = useState<PointRange[]>([]);


  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // カテゴリ、ポイント範囲、初期ボットを並行して取得
        const [
          { data: categoriesData, error: categoriesError },
          { data: initialBotsData, error: initialBotsError }
        ] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('bots').select('*').limit(BOTS_PER_PAGE).order('usage_count', { ascending: false })
        ]);

        if (categoriesError) throw categoriesError;
        if (initialBotsError) throw initialBotsError;
        
        setCategories(categoriesData || []);
        setInitialBots(initialBotsData || []);

        // サンプルポイント範囲
        setPointRanges([
          { id: '0-100', label: '0-100 P', min: 0, max: 100 },
          { id: '101-500', label: '101-500 P', min: 101, max: 500 },
          { id: '501+', label: '501+ P', min: 501, max: Infinity },
        ]);
        
      } catch (error) {
        console.error("Error fetching initial page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <>
      <div className="mb-6">
        <BotFilter
          categories={categories}
          pointRanges={pointRanges}
          sortOrders={sortOrders}
          onFilterChange={setFilters}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-4">
          {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
        </div>
      ) : (
        <BotList initialBots={initialBots} filters={filters} />
      )}
    </>
  );
}
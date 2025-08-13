'use client';

import { useState, useEffect, useCallback } from 'react';
import BotList from '@/components/bots/BotList';
import BotFilter from './BotFilter';
import { supabaseBrowser as supabase } from '@/lib/supabase/browser';
import { Bot, Category, PointRange, SortOrder } from '@/types/types';

const BOTS_PER_PAGE = 20;

// カテゴリ、ポイント範囲、並び順の静的データ
const staticCategories: Category[] = [
  { id: 'all', name: 'すべてのカテゴリ' },
  { id: 'ビジネス', name: 'ビジネス' },
  { id: 'マーケティング', name: 'マーケティング' },
  { id: 'ライフスタイル', name: 'ライフスタイル' },
  { id: 'プログラミング', name: 'プログラミング' },
  { id: '旅行', name: '旅行' },
  { id: 'デザイン', name: 'デザイン' },
  { id: '学習', name: '学習' },
  { id: 'フィットネス', name: 'フィットネス' },
];

const staticPointRanges: PointRange[] = [
  { id: 'all', label: 'すべて', min: 0, max: Infinity },
  { id: '0-100', label: '0-100 P', min: 0, max: 100 },
  { id: '101-500', label: '101-500 P', min: 101, max: 500 },
  { id: '501+', label: '501+ P', min: 501, max: Infinity },
];

const staticSortOrders: SortOrder[] = [
  { id: 'popular', label: '人気順' },
  { id: 'newest', label: '新着順' },
];

interface FilterState {
  category: string;
  pointRange: string;
  sortOrder: string;
}

export default function BotPageClient() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    pointRange: 'all',
    sortOrder: 'popular',
  });
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchBots = useCallback(async (newFilters: FilterState, isLoadMore = false) => {
    setLoading(true);
    const currentOffset = isLoadMore ? offset : 0;

    let query = supabase
      .from('bots')
      .select('*', { count: 'exact' })
      .range(currentOffset, currentOffset + BOTS_PER_PAGE - 1);

    // フィルター適用
    if (newFilters.category !== 'all') {
      query = query.eq('category', newFilters.category);
    }

    const selectedPointRange = staticPointRanges.find(r => r.id === newFilters.pointRange);
    if (selectedPointRange && selectedPointRange.id !== 'all') {
      query = query.gte('points', selectedPointRange.min);
      if (selectedPointRange.max !== Infinity) {
        query = query.lte('points', selectedPointRange.max);
      }
    }

    // 並び順適用 (usage_count の代わりに points を使用)
    if (newFilters.sortOrder === 'popular') {
      query = query.order('points', { ascending: false, nullsFirst: false });
    } else if (newFilters.sortOrder === 'newest') {
      query = query.order('created_at', { ascending: false });
    }

    try {
      const { data, error, count } = await query;
      if (error) throw error;

      if (data) {
        setBots(prev => isLoadMore ? [...prev, ...data] : data);
        const totalFetched = currentOffset + data.length;
        setHasMore(totalFetched < (count || 0));
        setOffset(totalFetched);
      }
    } catch (error) {
      console.error("Error fetching bots:", error);
      setBots([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    fetchBots(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadMoreBots = useCallback(() => {
    if (!loading && hasMore) {
      fetchBots(filters, true);
    }
  }, [loading, hasMore, filters, fetchBots]);


  return (
    <>
      <div className="mb-6">
        <BotFilter
          categories={staticCategories}
          pointRanges={staticPointRanges}
          sortOrders={staticSortOrders}
          onFilterChange={setFilters}
        />
      </div>
      <BotList
        bots={bots}
        loading={loading}
        hasMore={hasMore}
        loadMoreBots={loadMoreBots}
      />
    </>
  );
}
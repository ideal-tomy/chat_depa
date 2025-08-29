'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { logger } from '@/lib/logger';
import BotList from '@/components/features/bots/BotList';
import BotFilter from './BotFilter';
import CategorySection from '@/components/ui/CategorySection';
import CategoryCarousel from '@/components/ui/CategoryCarousel';
import { supabaseBrowser as supabase } from '@/lib/supabase/browser';
import { Bot, Category, PointRange, SortOrder } from '@/types';
import { categoryMapping, newCategories, getNewCategory, determineDisplayCategory } from '@/lib/bot-classification';

const BOTS_PER_PAGE = 20;

// カテゴリ、ポイント範囲、並び順の静的データ（新カテゴリ体系に合わせる）
const staticCategories: Category[] = [
  { id: 'all', name: 'すべてのカテゴリ' },
  ...newCategories.map((c) => ({ id: c, name: c })),
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

export default function BotPageClient(): JSX.Element {
  const searchParams = useSearchParams();
  const [bots, setBots] = useState<Bot[]>([]);
  const [allBots, setAllBots] = useState<Bot[]>([]);
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
      // 新カテゴリ名に一致する旧カテゴリも含めてヒットさせる
      const oldCategoryKeys = Object.keys(categoryMapping).filter(
        (k) => categoryMapping[k] === newFilters.category
      );
      if (oldCategoryKeys.length > 0) {
        query = query.in('category', [newFilters.category, ...oldCategoryKeys]);
      } else {
        query = query.eq('category', newFilters.category);
      }
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
        // ビジネス系は "真面目" のみ表示
        const filtered = (newFilters.category === 'ビジネス系')
          ? (data as any[]).filter((b) => determineDisplayCategory(b) === '真面目')
          : data

        setBots((prev) => {
          const seen = new Set<string>();
          return (filtered as any[]).filter((b: any) => {
            const key = String(b.id);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          }) as Bot[];
        });
        const totalFetched = currentOffset + data.length;
        setHasMore(totalFetched < (count || 0));
        setOffset(totalFetched);
      }
    } catch (error) {
      logger.error("Error fetching bots", new Error(String(error)));
      setBots([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [offset]);

  // すべてのカテゴリを並べるために一括取得（初回とカテゴリ=all時に利用）
  const fetchAllForSections = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .order('created_at', { ascending: true })
        .range(0, 199);
      if (error) throw error;
      setAllBots((data || []) as Bot[]);
    } catch (e) {
      logger.error('Error fetching all bots for sections', new Error(String(e)));
      setAllBots([]);
    }
  }, []);

  useEffect(() => {
    // URLクエリから初期カテゴリを反映（旧→新カテゴリへマッピング）
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      const mapped = newCategories.includes(urlCategory)
        ? urlCategory
        : getNewCategory(urlCategory);
      if (mapped !== filters.category) {
        setFilters((prev) => ({ ...prev, category: mapped }));
      }
    }
    fetchBots(filters);
    if (filters.category === 'all') {
      fetchAllForSections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchParams]);

  const loadMoreBots = useCallback(() => {
    if (!loading && hasMore) {
      fetchBots(filters, true);
    }
  }, [loading, hasMore, filters, fetchBots]);


  // カテゴリ=all のときは、タイトルとカルーセルを交互に表示
  if (filters.category === 'all') {
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

        {newCategories.map((cat, index) => {
          const list = (allBots || []).filter((b: any) => getNewCategory(b.category) === cat);
          if (list.length === 0) return null;
          return (
            <div key={cat}>
              <div className={`mt-2 ${index % 2 === 1 ? 'py-4 bg-gray-100' : ''}`}>
                <CategorySection title={cat} viewAllLink={`/bots?category=${encodeURIComponent(cat)}`}>
                  <CategoryCarousel bots={list} categoryTitle={cat} />
                </CategorySection>
              </div>
              {/* 最後のセクション以外に仕切り線を追加 */}
              {index < newCategories.length - 1 && (
                <div className="border-t border-gray-200 mt-2"></div>
              )}
            </div>
          );
        })}
      </>
    );
  }

  // カテゴリ指定時は従来のリスト + タイトル表示
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
      <div className="mb-4 px-1">
        <h3 className="text-lg font-semibold">
          カテゴリ: {staticCategories.find((c) => c.id === filters.category)?.name || filters.category}
        </h3>
      </div>
      <BotList bots={bots} loading={loading} hasMore={hasMore} loadMoreBots={loadMoreBots} />
    </>
  );
}

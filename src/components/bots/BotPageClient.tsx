'use client';

import { useState } from 'react';
import FilterBarWrapper from '@/components/wrappers/FilterBarWrapper';
import { CategoryOption as CategoryType, PointRangeOption } from '@/types/types';
import BotList from '@/components/bots/BotList';
import BotFilter, { FilterState as BotFilterState } from './BotFilter';

interface BotPageClientProps {
  categories: CategoryType[];
  pointRanges: PointRangeOption[];
}

export default function BotPageClient({ categories, pointRanges }: BotPageClientProps) {
  const [filters, setFilters] = useState({
    category: null as string | null,
    search: '',
    pointRange: null as [number, number] | null,
  });

  const [botFilterState, setBotFilterState] = useState<BotFilterState>({
    showImageUpload: false,
    showFileUpload: false,
  });

  return (
    <>
      {/* フィルターバー */}
      <div className="mb-6 sticky top-0 z-30 bg-white rounded-lg shadow-md p-3">
        <FilterBarWrapper 
          categories={categories} 
          pointRanges={pointRanges} 
          filters={filters}
          onFilterChange={setFilters}
        />
        <BotFilter filterState={botFilterState} setFilterState={setBotFilterState} />
      </div>
      <BotList filters={filters} botFilterState={botFilterState} />
    </>
  );
}

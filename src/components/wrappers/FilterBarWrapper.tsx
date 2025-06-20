'use client';

import { useState } from 'react';
import FilterBar from '@/components/ui/FilterBar';
import type { CategoryOption, PointRangeOption } from '@/types/types';

interface FilterBarWrapperProps {
  categories: CategoryOption[];
  pointRanges: PointRangeOption[];
}

export default function FilterBarWrapper({ categories, pointRanges }: FilterBarWrapperProps) {
  // フィルタ状態はラッパー内部だけで管理
  const [filters, setFilters] = useState({
    category: null as string | null,
    search: '',
    pointRange: null as [number, number] | null,
  });

  // ここで filters が変わったら Router.push() や API コール等を行うことも可能

  return (
    <FilterBar
      categories={categories}
      pointRanges={pointRanges}
      onFilterChange={setFilters}
    />
  );
}

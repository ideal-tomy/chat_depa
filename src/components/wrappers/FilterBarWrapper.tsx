'use client';

import FilterBar from '@/components/ui/FilterBar';
import type { CategoryOption, PointRangeOption } from '@/types/types';

interface FilterBarWrapperProps {
  categories: CategoryOption[];
  pointRanges: PointRangeOption[];
  filters: any; // 型は後でより具体的に定義
  onFilterChange: (filters: any) => void;
}

export default function FilterBarWrapper({ 
  categories, 
  pointRanges, 
  filters, 
  onFilterChange 
}: FilterBarWrapperProps) {
  return (
    <FilterBar
      categories={categories}
      pointRanges={pointRanges}
      onFilterChange={onFilterChange}
      filters={filters}
    />
  );
}

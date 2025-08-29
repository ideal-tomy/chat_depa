'use client';

import React, { useState } from 'react';
import { FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Category, PointRange, SortOrder } from '@/types'; // 型をインポート

interface FilterState {
  category: string;
  pointRange: string;
  sortOrder: string;
}

interface BotFilterProps {
  categories: Category[];
  pointRanges: PointRange[];
  sortOrders: SortOrder[];
  onFilterChange: (filters: FilterState) => void;
}

const BotFilter: React.FC<BotFilterProps> = ({ categories, pointRanges, sortOrders, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
    category: 'all',
    pointRange: 'all',
    sortOrder: 'popular',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filterState, [name]: value };
    setFilterState(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-lg font-semibold"
      >
        <span>
          <FunnelIcon className="h-6 w-6 inline-block mr-2" />
          フィルター
        </span>
        <ChevronDownIcon className={`h-6 w-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
            <select
              id="category"
              name="category"
              value={filterState.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">すべて</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pointRange" className="block text-sm font-medium text-gray-700 mb-1">必要ポイント</label>
            <select
              id="pointRange"
              name="pointRange"
              value={filterState.pointRange}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">すべて</option>
              {pointRanges.map((range) => (
                <option key={range.id} value={range.id}>{range.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">並び順</label>
            <select
              id="sortOrder"
              name="sortOrder"
              value={filterState.sortOrder}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              {sortOrders.map((order) => (
                <option key={order.id} value={order.id}>{order.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotFilter;

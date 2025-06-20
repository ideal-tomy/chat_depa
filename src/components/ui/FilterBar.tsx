'use client';

import { useState, useEffect } from 'react';
import { Listbox } from '@headlessui/react';

interface FilterBarProps {
  categories: { id: string; name: string }[];
  pointRanges: { id: string; name: string; range: [number, number] }[];
  onFilterChange: (filters: {
    category: string | null;
    search: string;
    pointRange: [number, number] | null;
  }) => void;
  initialFilters?: {
    category?: string;
    search?: string;
    pointRange?: [number, number];
  };
}

export default function FilterBar({
  categories,
  pointRanges,
  onFilterChange,
  initialFilters = {},
}: FilterBarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialFilters.category || null);
  const [selectedPointRange, setSelectedPointRange] = useState<[number, number] | null>(initialFilters.pointRange || null);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  
  // フィルター変更時にコールバックを呼び出し
  useEffect(() => {
    onFilterChange({
      category: selectedCategory,
      search: searchTerm,
      pointRange: selectedPointRange,
    });
  }, [selectedCategory, searchTerm, selectedPointRange, onFilterChange]);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-6 border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* カテゴリフィルター */}
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-text-light mb-1">
            カテゴリ
          </label>
          <Listbox value={selectedCategory} onChange={setSelectedCategory}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                <span className="block truncate">
                  {selectedCategory 
                    ? categories.find(c => c.id === selectedCategory)?.name || 'カテゴリ選択' 
                    : 'すべてのカテゴリ'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Listbox.Option
                  value={null}
                  className={({ active }) =>
                    `${active ? 'bg-primary-dark text-white' : 'text-gray-900'}
                    cursor-pointer select-none relative py-2 pl-10 pr-4`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                        すべてのカテゴリ
                      </span>
                      {selected && (
                        <span
                          className={`${active ? 'text-white' : 'text-primary'}
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
                {categories.map((category) => (
                  <Listbox.Option
                    key={category.id}
                    value={category.id}
                    className={({ active }) =>
                      `${active ? 'bg-primary-dark text-white' : 'text-gray-900'}
                      cursor-pointer select-none relative py-2 pl-10 pr-4`
                    }
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                          {category.name}
                        </span>
                        {selected && (
                          <span
                            className={`${active ? 'text-white' : 'text-primary'}
                                  absolute inset-y-0 left-0 flex items-center pl-3`}
                          >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
        
        {/* 検索バー */}
        <div>
          <label htmlFor="search-filter" className="block text-sm font-medium text-text-light mb-1">
            キーワード検索
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="search-filter"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Bot名や機能を検索"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* ポイント範囲フィルター */}
        <div>
          <label htmlFor="point-filter" className="block text-sm font-medium text-text-light mb-1">
            ポイント範囲
          </label>
          <Listbox value={selectedPointRange} onChange={setSelectedPointRange}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                <span className="block truncate">
                  {selectedPointRange
                    ? `${selectedPointRange[0]}〜${selectedPointRange[1] === Infinity ? '無制限' : selectedPointRange[1]} ポイント`
                    : 'すべての価格帯'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Listbox.Option
                  value={null}
                  className={({ active }) =>
                    `${active ? 'bg-primary-dark text-white' : 'text-gray-900'}
                    cursor-pointer select-none relative py-2 pl-10 pr-4`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                        すべての価格帯
                      </span>
                      {selected && (
                        <span
                          className={`${active ? 'text-white' : 'text-primary'}
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
                {pointRanges.map((range) => (
                  <Listbox.Option
                    key={range.id}
                    value={range.range}
                    className={({ active }) =>
                      `${active ? 'bg-primary-dark text-white' : 'text-gray-900'}
                      cursor-pointer select-none relative py-2 pl-10 pr-4`
                    }
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                          {range.name}
                        </span>
                        {selected && (
                          <span
                            className={`${active ? 'text-white' : 'text-primary'}
                                  absolute inset-y-0 left-0 flex items-center pl-3`}
                          >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </div>
    </div>
  );
}

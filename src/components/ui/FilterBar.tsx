'use client';

import { Listbox } from '@headlessui/react';

interface FilterBarProps {
  categories: { id: string; name: string }[];
  pointRanges: { id: string; name: string; range: [number, number] | null }[];
  filters: {
    category: string | null;
    search: string;
    pointRange: [number, number] | null;
  };
  onFilterChange: (newFilters: any) => void;
}

export default function FilterBar({
  categories,
  pointRanges,
  filters,
  onFilterChange,
}: FilterBarProps) {

  const handlePointRangeChange = (value: [number, number] | null) => {
    onFilterChange({ ...filters, pointRange: value });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        
        {/* カテゴリフィルター */}
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
            カテゴリ
          </label>
          <Listbox 
            value={filters.category || 'all'}
            onChange={(value) => onFilterChange({ ...filters, category: value === 'all' ? null : value })}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                <span className="block truncate">
                  {filters.category 
                    ? categories.find(c => c.id === filters.category)?.name
                    : 'すべてのカテゴリ'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {categories.map((category) => (
                  <Listbox.Option
                    key={category.id}
                    value={category.id}
                    className={({ active }) =>
                      `cursor-pointer select-none relative py-2 pl-10 pr-4 ${active ? 'bg-primary-light text-primary-dark' : 'text-gray-900'}`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {category.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* ポイントフィルター */}
        <div>
          <label htmlFor="point-filter" className="block text-sm font-medium text-gray-700 mb-1">
            必要ポイント
          </label>
          <Listbox 
            value={filters.pointRange}
            onChange={handlePointRangeChange}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                <span className="block truncate">
                  {filters.pointRange
                    ? pointRanges.find(p => p.range && filters.pointRange && p.range[0] === filters.pointRange[0] && p.range[1] === filters.pointRange[1])?.name
                    : 'すべてのポイント'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {pointRanges.map((point) => (
                  <Listbox.Option
                    key={point.id}
                    value={point.range}
                    className={({ active }) =>
                      `cursor-pointer select-none relative py-2 pl-10 pr-4 ${active ? 'bg-primary-light text-primary-dark' : 'text-gray-900'}`
                    }
                  >
                     {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {point.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* 検索フィルター */}
        <div className="lg:col-span-2">
          <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-1">
            キーワード検索
          </label>
          <div className="relative">
            <input
              type="text"
              id="search-filter"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Bot名、機能、特徴などで検索..."
              className="w-full rounded-lg border border-gray-300 p-2 pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
               <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

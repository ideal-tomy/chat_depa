'use client';

import { useState } from 'react';
import { X, Filter, ChevronDown } from 'lucide-react';
type BotFilterState = { showImageUpload: boolean; showFileUpload: boolean };

interface MobileFilterDrawerProps {
  filters: {
    category: string | null;
    search: string;
    pointRange: [number, number] | null;
  };
  botFilterState: BotFilterState;
  onFiltersChange: (filters: any) => void;
  onBotFilterChange: (filterState: BotFilterState) => void;
  categories: string[];
}

export default function MobileFilterDrawer({
  filters,
  botFilterState,
  onFiltersChange,
  onBotFilterChange,
  categories
}: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: false,
    points: false,
    features: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: category === 'all' ? null : category
    });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({
      ...filters,
      search
    });
  };

  const handlePointRangeChange = (range: string) => {
    let pointRange: [number, number] | null = null;
    if (range === '0-100') pointRange = [0, 100];
    else if (range === '101-200') pointRange = [101, 200];
    else if (range === '201+') pointRange = [201, 1000];
    
    onFiltersChange({
      ...filters,
      pointRange
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: null,
      search: '',
      pointRange: null
    });
    onBotFilterChange({
      showImageUpload: false,
      showFileUpload: false
    });
  };

  const hasActiveFilters = filters.category || filters.search || filters.pointRange || 
                          botFilterState.showImageUpload || botFilterState.showFileUpload;

  return (
    <>
      {/* フィルターボタン */}
      <div className="fixed top-20 right-4 z-40 md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-colors ${
            hasActiveFilters 
              ? 'bg-indigo-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          <Filter size={18} />
          <span className="text-sm font-medium">フィルター</span>
          {hasActiveFilters && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* オーバーレイ */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ドロワー */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">フィルター</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* フィルター内容 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 検索 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              キーワード検索
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Bot名、機能、特徴など"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* カテゴリ */}
          <div>
            <button
              onClick={() => toggleSection('category')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-sm font-medium text-gray-700">カテゴリ</span>
              <ChevronDown 
                size={16} 
                className={`transform transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}
              />
            </button>
            {expandedSections.category && (
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={!filters.category}
                    onChange={() => handleCategoryChange('all')}
                    className="mr-2"
                  />
                  <span className="text-sm">すべてのカテゴリ</span>
                </label>
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === category}
                      onChange={() => handleCategoryChange(category)}
                      className="mr-2"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* ポイント範囲 */}
          <div>
            <button
              onClick={() => toggleSection('points')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-sm font-medium text-gray-700">必要ポイント</span>
              <ChevronDown 
                size={16} 
                className={`transform transition-transform ${expandedSections.points ? 'rotate-180' : ''}`}
              />
            </button>
            {expandedSections.points && (
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pointRange"
                    checked={!filters.pointRange}
                    onChange={() => handlePointRangeChange('all')}
                    className="mr-2"
                  />
                  <span className="text-sm">すべてのポイント</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pointRange"
                    checked={filters.pointRange?.[0] === 0 && filters.pointRange?.[1] === 100}
                    onChange={() => handlePointRangeChange('0-100')}
                    className="mr-2"
                  />
                  <span className="text-sm">0-100P</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pointRange"
                    checked={filters.pointRange?.[0] === 101 && filters.pointRange?.[1] === 200}
                    onChange={() => handlePointRangeChange('101-200')}
                    className="mr-2"
                  />
                  <span className="text-sm">101-200P</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pointRange"
                    checked={filters.pointRange?.[0] === 201}
                    onChange={() => handlePointRangeChange('201+')}
                    className="mr-2"
                  />
                  <span className="text-sm">201P以上</span>
                </label>
              </div>
            )}
          </div>

          {/* 機能 */}
          <div>
            <button
              onClick={() => toggleSection('features')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-sm font-medium text-gray-700">機能</span>
              <ChevronDown 
                size={16} 
                className={`transform transition-transform ${expandedSections.features ? 'rotate-180' : ''}`}
              />
            </button>
            {expandedSections.features && (
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={botFilterState.showImageUpload}
                    onChange={(e) => onBotFilterChange({
                      ...botFilterState,
                      showImageUpload: e.target.checked
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm">画像アップロード対応</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={botFilterState.showFileUpload}
                    onChange={(e) => onBotFilterChange({
                      ...botFilterState,
                      showFileUpload: e.target.checked
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm">ファイル送信対応</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="border-t p-4">
          <button
            onClick={clearFilters}
            className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            フィルターをクリア
          </button>
        </div>
      </div>
    </>
  );
}

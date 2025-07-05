'use client';

import { Dispatch, SetStateAction } from 'react';

export interface FilterState {
  showImageUpload: boolean;
  showFileUpload: boolean;
}

interface BotFilterProps {
  filterState: FilterState;
  setFilterState: Dispatch<SetStateAction<FilterState>>;
}

const BotFilter: React.FC<BotFilterProps> = ({ filterState, setFilterState }) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilterState(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <h3 className="font-bold mb-2">機能で絞り込む</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="showImageUpload"
            checked={filterState.showImageUpload}
            onChange={handleCheckboxChange}
            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span>画像アップロード対応</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="showFileUpload"
            checked={filterState.showFileUpload}
            onChange={handleCheckboxChange}
            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span>ファイル送信対応</span>
        </label>
      </div>
    </div>
  );
};

export default BotFilter;

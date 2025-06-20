'use client';

import { useState } from 'react';

interface ExportPanelProps {
  onExport: (format: string, options: any) => void;
  isExporting?: boolean;
}

export default function ExportPanel({
  onExport,
  isExporting = false,
}: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState('docx');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  
  const handleExport = () => {
    onExport(selectedFormat, {
      includeMetadata,
      includeTimestamp,
    });
  };

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-4">ファイル出力</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-dark mb-2">
          ファイル形式
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="docx"
              checked={selectedFormat === 'docx'}
              onChange={() => setSelectedFormat('docx')}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="ml-2 text-sm text-text-dark">Word文書 (.docx)</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              value="pdf"
              checked={selectedFormat === 'pdf'}
              onChange={() => setSelectedFormat('pdf')}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="ml-2 text-sm text-text-dark">PDF (.pdf)</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              value="xlsx"
              checked={selectedFormat === 'xlsx'}
              onChange={() => setSelectedFormat('xlsx')}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="ml-2 text-sm text-text-dark">Excel (.xlsx)</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              value="txt"
              checked={selectedFormat === 'txt'}
              onChange={() => setSelectedFormat('txt')}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="ml-2 text-sm text-text-dark">テキスト (.txt)</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              value="zip"
              checked={selectedFormat === 'zip'}
              onChange={() => setSelectedFormat('zip')}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="ml-2 text-sm text-text-dark">ZIP圧縮 (.zip)</span>
          </label>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-dark mb-2">
          出力オプション
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeMetadata}
              onChange={() => setIncludeMetadata(!includeMetadata)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-text-dark">Bot情報を含める</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeTimestamp}
              onChange={() => setIncludeTimestamp(!includeTimestamp)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-text-dark">タイムスタンプを含める</span>
          </label>
        </div>
      </div>
      
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`
          w-full py-2 px-4 rounded 
          ${isExporting 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-accent-blue text-white hover:bg-opacity-90'}
          transition-colors duration-200
        `}
      >
        {isExporting ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            出力中...
          </div>
        ) : (
          'ダウンロード'
        )}
      </button>
    </div>
  );
}

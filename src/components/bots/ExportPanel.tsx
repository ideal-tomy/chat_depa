'use client';

import { useState } from 'react';
import { 
  DocumentTextIcon, 
  DocumentIcon, 
  TableCellsIcon, 
  ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';

interface ExportPanelProps {
  botId: string;
}

type ExportFormat = 'pdf' | 'word' | 'excel';

export default function ExportPanel({ botId }: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // 実際の実装ではここでAPI呼び出しを行う
      console.log(`Exporting chat with bot ${botId} as ${selectedFormat}`);
      
      // エクスポート成功をシミュレート
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 実際の実装ではダウンロードURLを作成する
      alert(`${selectedFormat.toUpperCase()}形式でエクスポートしました。`);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('エクスポートに失敗しました。');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="flex items-center gap-2 text-gray-800 font-medium mb-4">
        <ArrowDownTrayIcon className="h-5 w-5 text-primary" />
        ファイル出力
      </h3>
      
      <p className="text-sm text-gray-600 mb-4">
        チャット内容を以下の形式で出力できます
      </p>
      
      <div className="flex space-x-2 mb-6">
        <button
          type="button"
          onClick={() => setSelectedFormat('pdf')}
          className={`flex-1 flex flex-col items-center justify-center p-3 border rounded-md transition-all ${
            selectedFormat === 'pdf'
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <DocumentTextIcon className="h-6 w-6 mb-1" />
          <span className="text-sm">PDF</span>
        </button>
        
        <button
          type="button"
          onClick={() => setSelectedFormat('word')}
          className={`flex-1 flex flex-col items-center justify-center p-3 border rounded-md transition-all ${
            selectedFormat === 'word'
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <DocumentIcon className="h-6 w-6 mb-1" />
          <span className="text-sm">Word</span>
        </button>
        
        <button
          type="button"
          onClick={() => setSelectedFormat('excel')}
          className={`flex-1 flex flex-col items-center justify-center p-3 border rounded-md transition-all ${
            selectedFormat === 'excel'
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <TableCellsIcon className="h-6 w-6 mb-1" />
          <span className="text-sm">Excel</span>
        </button>
      </div>
      
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full flex justify-center items-center py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            出力中...
          </>
        ) : (
          <>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            {selectedFormat === 'pdf' && 'PDFで出力'}
            {selectedFormat === 'word' && 'Wordで出力'}
            {selectedFormat === 'excel' && 'Excelで出力'}
          </>
        )}
      </button>
      
      <p className="mt-4 text-xs text-gray-500 text-center">
        出力には50ポイントが別途消費されます
      </p>
    </div>
  );
}

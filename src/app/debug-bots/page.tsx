'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser as supabase } from '@/lib/supabase/browser';
import { logger } from '@/lib/logger';

export default function DebugBotsPage(): JSX.Element {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inserting, setInserting] = useState(false);

  const fetchData = async () => {
    logger.info('Debug: Starting to fetch data...');
    setLoading(true);
    
    try {
      const { data: botsData, error: botsError } = await supabase
        .from('bots')
        .select('*');
      
      logger.info('Debug: Raw query result', { botsData, botsError });
      
      if (botsError) {
        setError(botsError);
      } else {
        setData(botsData);
        setError(null);
      }
    } catch (err) {
      logger.error('Debug: Catch error', new Error(String(err)));
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const insertSampleData = async () => {
    setInserting(true);
    
    const sampleBots = [
      {
        name: '補助金書類を提出直前まで作ってくれる君',
        description: '◯年度版の様式2、最新版でいい？」と毎回確認してくる慎重派。実際に叩き台まで作ってくれる。',
        category: 'ビジネス',
        avatar_url: '/images/icons/placeholder/business.png',
        can_upload_image: false,
        can_send_file: true
      },
      {
        name: 'SNS投稿アイデアBot',
        description: 'バズる投稿のアイデアを無限に生成。ハッシュタグやトレンドを分析して効果的な投稿をサポート。',
        category: 'マーケティング',
        avatar_url: '/images/sample/sumple02.png',
        can_upload_image: true,
        can_send_file: false
      },
      {
        name: 'プログラミング学習Bot',
        description: 'コードレビューから学習プランまで、プログラミング学習を総合サポート。初心者から上級者まで対応。',
        category: 'プログラミング',
        avatar_url: '/images/sample/sumple03.png',
        can_upload_image: false,
        can_send_file: true
      },
      {
        name: '料理レシピ提案Bot',
        description: '冷蔵庫の中身や好みに合わせて、オリジナルレシピを提案。栄養バランスも考慮した健康的な料理。',
        category: 'ライフスタイル',
        avatar_url: '/images/sample/sumple04.png',
        can_upload_image: true,
        can_send_file: false
      }
    ];

    try {
      logger.info('Debug: Inserting sample data...');
      
      const { data: insertedData, error: insertError } = await supabase
        .from('bots')
        .insert(sampleBots)
        .select();
      
      if (insertError) {
        logger.error('Debug: Insert error', new Error(String(insertError)));
        setError(insertError);
      } else {
        logger.info('Debug: Insert success', { insertedData });
        // 挿入後にデータを再取得
        fetchData();
      }
    } catch (err) {
      logger.error('Debug: Insert catch error', new Error(String(err)));
      setError(err);
    } finally {
      setInserting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Debug: Bots Table</h1>
      
      <div className="space-y-4">
        <div className="flex gap-4 mb-6">
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
          
          <button 
            onClick={insertSampleData} 
            disabled={inserting}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            {inserting ? 'Inserting...' : 'Insert Sample Data'}
          </button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Data Count:</h2>
          <p>{data ? data.length : 'No data'}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Error:</h2>
          <pre className="text-red-600">{JSON.stringify(error, null, 2)}</pre>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Raw Data:</h2>
          <pre className="text-sm overflow-auto max-h-96">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
} 

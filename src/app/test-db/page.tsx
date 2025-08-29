'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser as supabase } from '@/lib/supabase/browser';
import { logger } from '@/lib/logger';

export default function TestDBPage(): JSX.Element {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    logger.info('Testing Supabase connection from client...');
    
    try {
      const { data, error } = await supabase
        .from('bots')
        .select('id, name, category')
        .limit(3);
      
      logger.info('Query result', { data, error });
      
      if (error) {
        setResult({ error: error.message, details: error });
      } else {
        setResult({ success: true, data });
      }
    } catch (err) {
      logger.error('Catch error', new Error(String(err)));
      setResult({ error: 'Catch error', details: err });
    }
    
    setLoading(false);
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      
      <button 
        onClick={testConnection} 
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Result:</h2>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  );
} 

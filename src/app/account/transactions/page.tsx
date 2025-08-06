'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ClockIcon,
  FunnelIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser } from '@/lib/auth';
import { pointsAPI } from '@/lib/api-client';

interface Transaction {
  id: string;
  points: number;
  transaction_type: 'earned' | 'spent' | 'purchased' | 'manual_grant';
  description: string;
  created_at: string;
}

const TRANSACTION_TYPES = [
  { value: '', label: '全て' },
  { value: 'purchased', label: '購入' },
  { value: 'spent', label: '利用' },
  { value: 'manual_grant', label: '付与' },
  { value: 'earned', label: '獲得' },
] as const;

export default function TransactionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // データ取得
  const fetchTransactions = async (offset = 0, append = false) => {
    try {
      if (offset === 0) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      // 認証状態確認
      const user = await getCurrentUser();
      if (!user) {
        router.push('/account/login');
        return;
      }

      // 現在のポイント残高取得（初回のみ）
      if (offset === 0) {
        const balanceResponse = await pointsAPI.getBalance();
        if (balanceResponse.success) {
          setCurrentBalance(balanceResponse.data?.current_points || 0);
        }
      }

      // 取引履歴取得
      const response = await pointsAPI.getHistory({
        limit: 20,
        offset,
        type: filter || undefined
      });

      if (!response.success) {
        throw new Error(response.error || '取引履歴の取得に失敗しました');
      }

      const newTransactions = response.data?.history || [];
      
      if (append) {
        setTransactions(prev => [...prev, ...newTransactions]);
      } else {
        setTransactions(newTransactions);
      }

      setHasMore(response.data?.pagination?.has_more || false);

    } catch (err) {
      console.error('取引履歴取得エラー:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTransactions(0, false);
  }, [filter]);

  // 更にロード
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchTransactions(transactions.length, true);
    }
  };

  // トランザクションタイプの表示情報
  const getTransactionDisplay = (transaction: Transaction) => {
    switch (transaction.transaction_type) {
      case 'purchased':
        return {
          icon: <CreditCardIcon className="h-5 w-5 text-green-600" />,
          bgColor: 'bg-green-100',
          textColor: 'text-green-600',
          label: '購入',
          prefix: '+'
        };
      case 'spent':
        return {
          icon: <DocumentTextIcon className="h-5 w-5 text-blue-600" />,
          bgColor: 'bg-blue-100',
          textColor: 'text-red-600',
          label: '利用',
          prefix: ''
        };
      case 'manual_grant':
        return {
          icon: <ChartBarIcon className="h-5 w-5 text-purple-600" />,
          bgColor: 'bg-purple-100',
          textColor: 'text-green-600',
          label: '付与',
          prefix: '+'
        };
      case 'earned':
      default:
        return {
          icon: <ChartBarIcon className="h-5 w-5 text-yellow-600" />,
          bgColor: 'bg-yellow-100',
          textColor: 'text-green-600',
          label: '獲得',
          prefix: '+'
        };
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link 
            href="/account/mypage"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            マイページに戻る
          </Link>
          <h1 className="text-3xl font-bold">利用履歴</h1>
          <p className="text-gray-600 mt-2">
            ポイントの利用・購入履歴を確認できます
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800">エラーが発生しました</h3>
                <p className="text-red-600 mt-1">{error}</p>
                <button
                  onClick={() => fetchTransactions(0, false)}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  再試行
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 残高表示 */}
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg shadow-md p-6 text-white mb-8">
              <h2 className="text-lg font-medium mb-2">現在の残高</h2>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-bold">{currentBalance.toLocaleString()}</span>
                  <span className="ml-2">ポイント</span>
                </div>
                <button
                  onClick={() => fetchTransactions(0, false)}
                  className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-md transition-colors flex items-center"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  更新
                </button>
              </div>
            </div>

            {/* フィルター */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center space-x-4">
                <FunnelIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">フィルター:</span>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {TRANSACTION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 取引履歴 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold">取引履歴</h2>
              </div>

              {transactions.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <ClockIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>取引履歴がありません</p>
                  {filter && (
                    <button
                      onClick={() => setFilter('')}
                      className="mt-2 text-primary hover:underline"
                    >
                      フィルターをクリア
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {transactions.map((transaction) => {
                    const display = getTransactionDisplay(transaction);
                    return (
                      <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`${display.bgColor} rounded-full p-2 mr-4`}>
                              {display.icon}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {transaction.description}
                              </p>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>
                                  {new Date(transaction.created_at).toLocaleString('ja-JP', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                <span>•</span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {display.label}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={`font-bold text-lg ${display.textColor}`}>
                            {display.prefix}{transaction.points}P
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* さらに読み込み */}
              {hasMore && (
                <div className="px-6 py-4 border-t border-gray-200 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-6 py-2 text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
                        読み込み中...
                      </div>
                    ) : (
                      'さらに読み込む'
                    )}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
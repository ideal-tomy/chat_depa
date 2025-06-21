'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CreditCardIcon,
  ClockIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  date: string;
  description: string;
  points: number;
  type: 'purchase' | 'usage' | 'adjustment';
}

export default function MyPage() {
  // 通常はここでユーザー情報を取得（Supabaseなど）
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '山田 太郎',
    email: 'yamada@example.com',
    pointBalance: 320,
    plan: 'ベーシック',
    planExpiry: '2025年7月21日',
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    // ダミーデータを生成（実際はAPI呼び出し）
    const dummyTransactions: Transaction[] = [
      { 
        id: 't1', 
        date: '2025-06-21', 
        description: 'ベーシックプラン購入', 
        points: 500, 
        type: 'purchase'
      },
      { 
        id: 't2', 
        date: '2025-06-20', 
        description: 'ビジネスメール作成Bot利用', 
        points: -100, 
        type: 'usage'
      },
      { 
        id: 't3', 
        date: '2025-06-18', 
        description: 'Pythonコードデバッガー利用', 
        points: -50, 
        type: 'usage'
      },
      { 
        id: 't4', 
        date: '2025-06-15', 
        description: 'SNS投稿アイデアBot利用', 
        points: -30, 
        type: 'usage'
      },
    ];
    
    setTransactions(dummyTransactions);
    setLoading(false);
  }, []);
  
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">マイページ</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* サイドバー - ユーザー情報 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-gray-200 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold text-gray-600">
                    {userData.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{userData.name}</h2>
                    <p className="text-gray-600">{userData.email}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">現在のプラン:</span>
                    <span className="font-semibold">{userData.plan}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">更新日:</span>
                    <span className="font-semibold">{userData.planExpiry}</span>
                  </div>
                </div>
                
                <Link 
                  href="/account/plans" 
                  className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-center text-gray-800 font-medium"
                >
                  プランを変更する
                </Link>
              </div>
              
              {/* ナビゲーション */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <nav className="divide-y divide-gray-200">
                  <Link 
                    href="/account/mypage" 
                    className="flex items-center px-6 py-4 bg-gray-50 hover:bg-gray-100 text-primary"
                  >
                    <ChartBarIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">アカウント概要</span>
                  </Link>
                  <Link 
                    href="/account/transactions" 
                    className="flex items-center px-6 py-4 hover:bg-gray-50"
                  >
                    <ClockIcon className="h-5 w-5 mr-3 text-gray-500" />
                    <span>利用履歴</span>
                  </Link>
                  <Link 
                    href="/account/billing" 
                    className="flex items-center px-6 py-4 hover:bg-gray-50"
                  >
                    <CreditCardIcon className="h-5 w-5 mr-3 text-gray-500" />
                    <span>お支払い設定</span>
                  </Link>
                  <Link 
                    href="/account/settings" 
                    className="flex items-center px-6 py-4 hover:bg-gray-50"
                  >
                    <CogIcon className="h-5 w-5 mr-3 text-gray-500" />
                    <span>アカウント設定</span>
                  </Link>
                </nav>
              </div>
            </div>
            
            {/* メインコンテンツ */}
            <div className="lg:col-span-2 space-y-8">
              {/* ポイント残高カード */}
              <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg shadow-md p-6 text-white">
                <h2 className="text-lg font-medium mb-2">ポイント残高</h2>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{userData.pointBalance}</span>
                  <span className="ml-2">ポイント</span>
                </div>
                
                <div className="mt-6 flex">
                  <Link 
                    href="/account/points/purchase" 
                    className="inline-flex items-center py-2 px-4 bg-white text-primary rounded-md font-medium"
                  >
                    ポイントを購入する
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
              
              {/* 最近の利用履歴 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">最近の利用履歴</h2>
                  <Link 
                    href="/account/transactions" 
                    className="text-primary hover:underline text-sm flex items-center"
                  >
                    すべて見る
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {transactions.map(transaction => (
                    <div key={transaction.id} className="py-4 flex justify-between items-center">
                      <div className="flex items-start">
                        {transaction.type === 'purchase' ? (
                          <div className="bg-green-100 rounded-full p-2 mr-4">
                            <CreditCardIcon className="h-5 w-5 text-green-600" />
                          </div>
                        ) : transaction.type === 'usage' ? (
                          <div className="bg-blue-100 rounded-full p-2 mr-4">
                            <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                          </div>
                        ) : (
                          <div className="bg-yellow-100 rounded-full p-2 mr-4">
                            <ChartBarIcon className="h-5 w-5 text-yellow-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                      <div className={`font-bold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points}P
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* おすすめBot */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">おすすめのBot</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">B</span>
                      </div>
                      <h3 className="font-medium">ビジネスメール作成Bot</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      丁寧なビジネスメールを瞬時に作成します。
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold">100P</span>
                      <Link 
                        href="/bots/b1" 
                        className="text-primary hover:underline text-sm"
                      >
                        詳細を見る
                      </Link>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">S</span>
                      </div>
                      <h3 className="font-medium">SNS投稿アイデアBot</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      バズる投稿のアイデアを無限に生成。
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold">150P</span>
                      <Link 
                        href="/bots/b2" 
                        className="text-primary hover:underline text-sm"
                      >
                        詳細を見る
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

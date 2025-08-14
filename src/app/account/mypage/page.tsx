'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CreditCardIcon,
  ClockIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser, signOut } from '@/lib/auth';
import { profileAPI, pointsAPI } from '@/lib/api-client';
import { useProfile } from '@/components/hooks/useProfile';

interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  current_points: number;
  role: string;
  created_at: string;
}

interface Transaction {
  id: string;
  points: number;
  transaction_type: 'earned' | 'spent' | 'purchased' | 'manual_grant';
  description: string;
  created_at: string;
}

export default function MyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [pointBalance, setPointBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // データ取得関数
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 認証状態確認
      const user = await getCurrentUser();
      if (!user) {
        console.log('User not authenticated, redirecting to login');
        router.replace('/account/login');
        return;
      }
      
      setUserEmail(user.email || '');

      // プロフィール情報取得
      const profileResponse = await profileAPI.getProfile();
      if (!profileResponse.success) {
        throw new Error(profileResponse.error || 'プロフィール情報の取得に失敗しました');
      }

      setUserProfile(profileResponse.data?.profile);

      // ポイント残高取得
      const pointsResponse = await pointsAPI.getBalance();
      if (!pointsResponse.success) {
        throw new Error(pointsResponse.error || 'ポイント残高の取得に失敗しました');
      }

      setPointBalance(pointsResponse.data?.current_points || 0);

      // ポイント履歴取得（最新5件）
      const historyResponse = await pointsAPI.getHistory({ limit: 5 });
      if (!historyResponse.success) {
        console.warn('ポイント履歴の取得に失敗:', historyResponse.error);
        setTransactions([]);
      } else {
        setTransactions(historyResponse.data?.history || []);
      }

    } catch (err) {
      console.error('ユーザーデータ取得エラー:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // React Queryでプロフィールだけは即時読み込み・フェールセーフ
  const { data: profileData } = useProfile();
  useEffect(() => {
    if (profileData?.profile) {
      setUserProfile(profileData.profile as any)
    }
    fetchUserData();
  }, [fetchUserData, profileData]);

  // ログアウト処理
  const handleSignOut = async () => {
    const success = await signOut();
    if (success) {
      router.push('/');
    }
  };

  // トランザクションタイプの表示名とスタイル
  const getTransactionDisplay = (transaction: Transaction) => {
    switch (transaction.transaction_type) {
      case 'purchased':
        return {
          icon: <CreditCardIcon className="h-5 w-5 text-green-600" />,
          bgColor: 'bg-green-100',
          textColor: 'text-green-600',
          label: '購入'
        };
      case 'spent':
        return {
          icon: <DocumentTextIcon className="h-5 w-5 text-blue-600" />,
          bgColor: 'bg-blue-100',
          textColor: 'text-red-600',
          label: '利用'
        };
      case 'manual_grant':
        return {
          icon: <ChartBarIcon className="h-5 w-5 text-purple-600" />,
          bgColor: 'bg-purple-100',
          textColor: 'text-green-600',
          label: '付与'
        };
      case 'earned':
      default:
        return {
          icon: <ChartBarIcon className="h-5 w-5 text-yellow-600" />,
          bgColor: 'bg-yellow-100',
          textColor: 'text-green-600',
          label: '獲得'
        };
    }
  };
  
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">マイページ</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
          >
            ログアウト
          </button>
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
                  onClick={fetchUserData}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  再試行
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* サイドバー - ユーザー情報 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center space-x-4 mb-6">
                  {userProfile?.avatar_url ? (
                    <img 
                      src={userProfile.avatar_url} 
                      alt="プロフィール画像"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold text-gray-600">
                      {userProfile?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold">{userProfile?.username || 'ユーザー'}</h2>
                    <p className="text-gray-600">{userEmail}</p>
                    {userProfile?.role === 'admin' && (
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mt-1">
                        管理者
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">現在のポイント:</span>
                    <span className="font-semibold text-primary">{pointBalance}P</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">登録日:</span>
                    <span className="font-semibold">
                      {userProfile?.created_at ? 
                        new Date(userProfile.created_at).toLocaleDateString('ja-JP') : 
                        '-'
                      }
                    </span>
                  </div>
                </div>
                
                <Link 
                  href="/account/points/purchase" 
                  className="block w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-md text-center font-medium transition-colors"
                >
                  ポイントを購入する
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
                  <span className="text-4xl font-bold">{pointBalance}</span>
                  <span className="ml-2">ポイント</span>
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <Link 
                    href="/account/points/purchase" 
                    className="inline-flex items-center py-2 px-4 bg-white text-primary rounded-md font-medium hover:bg-gray-50 transition-colors"
                  >
                    ポイントを購入する
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                  <button
                    onClick={fetchUserData}
                    className="inline-flex items-center py-2 px-4 bg-white/20 text-white rounded-md font-medium hover:bg-white/30 transition-colors"
                  >
                    残高を更新
                  </button>
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
                  {transactions.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <ClockIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>まだ利用履歴がありません</p>
                    </div>
                  ) : (
                    transactions.map(transaction => {
                      const display = getTransactionDisplay(transaction);
                      return (
                        <div key={transaction.id} className="py-4 flex justify-between items-center">
                          <div className="flex items-start">
                            <div className={`${display.bgColor} rounded-full p-2 mr-4`}>
                              {display.icon}
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>{new Date(transaction.created_at).toLocaleDateString('ja-JP')}</span>
                                <span>•</span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {display.label}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={`font-bold ${display.textColor}`}>
                            {transaction.points > 0 ? '+' : ''}{transaction.points}P
                          </div>
                        </div>
                      );
                    })
                  )}
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

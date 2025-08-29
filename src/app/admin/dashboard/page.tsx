'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  UsersIcon,
  CurrencyYenIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser } from '@/lib/auth';
import { adminAPI, profileAPI } from '@/lib/api-client';
import { logger } from '@/lib/logger';

interface User {
  id: string;
  username: string;
  avatar_url?: string;
  current_points: number;
  role: string;
  created_at: string;
}

interface Statistics {
  total_users: number;
  admin_users: number;
  regular_users: number;
  total_points: number;
  average_points: number;
}

export default function AdminDashboard(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // ポイント付与関連
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [grantPoints, setGrantPoints] = useState<string>('');
  const [grantDescription, setGrantDescription] = useState('');
  const [isGranting, setIsGranting] = useState(false);

  // データ取得
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 認証状態確認
      const user = await getCurrentUser();
      if (!user) {
        router.push('/account/login');
        return;
      }

      // 管理者権限確認
      const profileResponse = await profileAPI.getProfile();
      if (!profileResponse.success || profileResponse.data?.profile?.role !== 'admin') {
        setError('管理者権限が必要です');
        setTimeout(() => router.push('/account/mypage'), 2000);
        return;
      }

      setIsAdmin(true);

      // ユーザー一覧取得
      const usersResponse = await adminAPI.getUsers({ 
        limit: 50, 
        search: searchTerm 
      });
      
      if (!usersResponse.success) {
        throw new Error(usersResponse.error || 'ユーザー情報の取得に失敗しました');
      }

      setUsers(usersResponse.data?.users || []);
      setStatistics(usersResponse.data?.statistics || null);

    } catch (err) {
      logger.error('データ取得エラー', new Error(String(err)));
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  // ポイント付与処理
  const handleGrantPoints = async () => {
    if (!selectedUser || !grantPoints) return;

    try {
      setIsGranting(true);
      
      const pointsNum = parseInt(grantPoints);
      if (isNaN(pointsNum)) {
        alert('有効なポイント数を入力してください');
        return;
      }

      const response = await adminAPI.grantPoints({
        target_user_id: selectedUser.id,
        points: pointsNum,
        description: grantDescription || `管理者による手動付与`
      });

      if (!response.success) {
        throw new Error(response.error || 'ポイント付与に失敗しました');
      }

      alert(`${selectedUser.username}に${pointsNum}ポイントを付与しました`);
      
      // モーダルを閉じてデータを再取得
      setShowGrantModal(false);
      setSelectedUser(null);
      setGrantPoints('');
      setGrantDescription('');
      fetchData();

    } catch (error) {
      logger.error('ポイント付与エラー', new Error(String(error)));
      alert(error instanceof Error ? error.message : 'ポイント付与に失敗しました');
    } finally {
      setIsGranting(false);
    }
  };

  if (!isAdmin && error) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">アクセス拒否</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">管理者ダッシュボード</h1>
          <p className="text-gray-600 mt-2">
            ユーザー管理とポイント管理を行えます
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
                  onClick={fetchData}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  再試行
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 統計情報 */}
            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <UsersIcon className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">{statistics.total_users}</div>
                      <div className="text-sm text-gray-600">総ユーザー数</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <UsersIcon className="h-8 w-8 text-purple-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">{statistics.admin_users}</div>
                      <div className="text-sm text-gray-600">管理者</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <UsersIcon className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">{statistics.regular_users}</div>
                      <div className="text-sm text-gray-600">一般ユーザー</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <CurrencyYenIcon className="h-8 w-8 text-yellow-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">{statistics.total_points.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">総ポイント</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-8 w-8 text-indigo-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">{statistics.average_points}</div>
                      <div className="text-sm text-gray-600">平均ポイント</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 検索・フィルター */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ユーザー名で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  検索
                </button>
              </div>
            </div>

            {/* ユーザー一覧 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold">ユーザー一覧</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ユーザー
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ポイント
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        権限
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        登録日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        アクション
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.avatar_url ? (
                              <Image 
                                src={user.avatar_url} 
                                alt=""
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover mr-3"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-gray-600">
                                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.username}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user.id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-primary">
                            {user.current_points.toLocaleString()}P
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role === 'admin' ? '管理者' : '一般'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowGrantModal(true);
                            }}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                          >
                            <PlusIcon className="h-4 w-4 mr-1" />
                            ポイント付与
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {users.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    ユーザーが見つかりませんでした
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ポイント付与モーダル */}
      {showGrantModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">ポイント付与</h3>
            
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">対象ユーザー</div>
              <div className="font-medium">{selectedUser.username}</div>
              <div className="text-sm text-gray-500">
                現在のポイント: {selectedUser.current_points.toLocaleString()}P
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                付与ポイント数
              </label>
              <input
                type="number"
                value={grantPoints}
                onChange={(e) => setGrantPoints(e.target.value)}
                placeholder="付与するポイント数を入力"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明（任意）
              </label>
              <textarea
                value={grantDescription}
                onChange={(e) => setGrantDescription(e.target.value)}
                placeholder="付与理由や説明を入力"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleGrantPoints}
                disabled={isGranting || !grantPoints}
                className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGranting ? '付与中...' : 'ポイントを付与'}
              </button>
              <button
                onClick={() => {
                  setShowGrantModal(false);
                  setSelectedUser(null);
                  setGrantPoints('');
                  setGrantDescription('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

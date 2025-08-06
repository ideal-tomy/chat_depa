'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CreditCardIcon,
  CheckIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser } from '@/lib/auth';
import { pointsAPI } from '@/lib/api-client';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  points: number;
  bonus_percent: number;
  is_bonus: boolean;
}

export default function PointPurchasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // プラン一覧を取得
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 認証状態確認
      const user = await getCurrentUser();
      if (!user) {
        router.push('/account/login');
        return;
      }

      // プラン一覧取得
      const response = await pointsAPI.getPlans();
      if (!response.success) {
        throw new Error(response.error || 'プラン情報の取得に失敗しました');
      }

      setPlans(response.data?.plans || []);

    } catch (err) {
      console.error('プラン取得エラー:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // 購入処理（現在はダミー実装）
  const handlePurchase = async (plan: Plan) => {
    try {
      setIsProcessing(true);
      
      // TODO: Stripe決済を実装する際はここで決済処理を行う
      alert(`${plan.name}の購入機能は現在準備中です。\\n将来のStripe連携で実装予定です。`);
      
    } catch (error) {
      console.error('購入処理エラー:', error);
      alert('購入処理中にエラーが発生しました。');
    } finally {
      setIsProcessing(false);
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
          <h1 className="text-3xl font-bold">ポイント購入</h1>
          <p className="text-gray-600 mt-2">
            チャットボットを利用するためのポイントを購入できます
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
                  onClick={fetchPlans}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  再試行
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* プラン選択 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedPlan?.id === plan.id ? 'ring-2 ring-primary' : ''
                  } ${plan.is_bonus ? 'border-2 border-primary' : ''}`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  {/* ボーナスバッジ */}
                  {plan.is_bonus && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                        {plan.bonus_percent}% お得！
                      </span>
                    </div>
                  )}

                  {/* 選択チェック */}
                  {selectedPlan?.id === plan.id && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-primary rounded-full p-1">
                        <CheckIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                    
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-primary">
                        ¥{plan.price.toLocaleString()}
                      </div>
                      <div className="text-lg font-medium text-gray-800 mt-1">
                        {plan.points.toLocaleString()}ポイント
                      </div>
                      {plan.is_bonus && (
                        <div className="text-sm text-green-600 font-medium">
                          通常より{plan.bonus_percent}%お得
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      1ポイント = ¥{(plan.price / plan.points).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 購入ボタン */}
            {selectedPlan && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">購入内容の確認</h3>
                
                <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{selectedPlan.name}</div>
                    <div className="text-sm text-gray-600">{selectedPlan.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">¥{selectedPlan.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{selectedPlan.points.toLocaleString()}ポイント</div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handlePurchase(selectedPlan)}
                    disabled={isProcessing}
                    className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        処理中...
                      </>
                    ) : (
                      <>
                        <CreditCardIcon className="h-5 w-5 mr-2" />
                        購入する
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  ※ 現在は決済機能を準備中です。実際の購入は将来のStripe連携で実装予定です。
                </div>
              </div>
            )}

            {/* 注意事項 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-medium text-blue-800 mb-2">ポイントについて</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• ポイントは購入後すぐにアカウントに反映されます</li>
                <li>• ポイントに有効期限はありません</li>
                <li>• 各チャットボットの利用に必要なポイント数は異なります</li>
                <li>• 購入されたポイントの返金はできません</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
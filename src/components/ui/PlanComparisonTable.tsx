'use client';

import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

type PlanType = 'monthly' | 'yearly';
type PlanTier = 'free' | 'basic' | 'premium';

interface PlanFeature {
  name: string;
  free: boolean | string;
  basic: boolean | string;
  premium: boolean | string;
}

export default function PlanComparisonTable() {
  const [planType, setPlanType] = useState<PlanType>('monthly');
  
  const planPrices = {
    monthly: {
      free: '¥0',
      basic: '¥980',
      premium: '¥1,980'
    },
    yearly: {
      free: '¥0',
      basic: '¥9,800', // 約2ヶ月分お得
      premium: '¥19,800' // 約2ヶ月分お得
    }
  };
  
  const planPoints = {
    free: '100P',
    basic: '500P',
    premium: '1,200P'
  };
  
  const features: PlanFeature[] = [
    { name: '利用可能Bot数', free: '制限あり', basic: '無制限', premium: '無制限' },
    { name: '月間ポイント付与', free: '100P', basic: '500P', premium: '1,200P' },
    { name: 'ポイント購入', free: true, basic: true, premium: true },
    { name: 'チャット履歴保存', free: '7日間', basic: '30日間', premium: '無制限' },
    { name: '優先サポート', free: false, basic: true, premium: true },
    { name: 'プレミアムBot', free: false, basic: false, premium: true },
    { name: 'データエクスポート', free: false, basic: true, premium: true },
  ];
  
  const handlePlanChange = (type: PlanType) => {
    setPlanType(type);
  };
  
  return (
    <div className="w-full">
      {/* トグルスイッチ */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 inline-flex">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md ${planType === 'monthly' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            onClick={() => handlePlanChange('monthly')}
          >
            月額
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md ${planType === 'yearly' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            onClick={() => handlePlanChange('yearly')}
          >
            年額（お得）
          </button>
        </div>
      </div>
      
      {/* テーブル */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900" scope="col"></th>
                  <th className="py-3 px-4 text-center" scope="col">
                    <span className="block text-sm font-semibold text-gray-900">無料トライアル</span>
                    <span className="block mt-1 text-2xl font-bold">{planPrices[planType].free}</span>
                    <span className="block mt-1 text-sm text-gray-500">30日間</span>
                  </th>
                  <th className="py-3 px-4 text-center" scope="col">
                    <span className="block text-sm font-semibold text-gray-900">ベーシック</span>
                    <span className="block mt-1 text-2xl font-bold">{planPrices[planType].basic}</span>
                    <span className="block mt-1 text-sm text-gray-500">
                      {planType === 'monthly' ? '月額' : '年額'}
                    </span>
                  </th>
                  <th className="py-3 px-4 text-center" scope="col">
                    <span className="block text-sm font-semibold text-gray-900">プレミアム</span>
                    <span className="block mt-1 text-2xl font-bold">{planPrices[planType].premium}</span>
                    <span className="block mt-1 text-sm text-gray-500">
                      {planType === 'monthly' ? '月額' : '年額'}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {features.map((feature, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{feature.name}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.free === 'boolean' ? 
                        feature.free ? <CheckIcon className="h-5 w-5 mx-auto text-green-500" /> : 
                        <span className="text-gray-300">―</span> : 
                        <span className="text-sm">{feature.free}</span>}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.basic === 'boolean' ? 
                        feature.basic ? <CheckIcon className="h-5 w-5 mx-auto text-green-500" /> : 
                        <span className="text-gray-300">―</span> : 
                        <span className="text-sm">{feature.basic}</span>}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.premium === 'boolean' ? 
                        feature.premium ? <CheckIcon className="h-5 w-5 mx-auto text-green-500" /> : 
                        <span className="text-gray-300">―</span> : 
                        <span className="text-sm">{feature.premium}</span>}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-4 px-4"></td>
                  <td className="py-4 px-4 text-center">
                    <a
                      href="#signup-form"
                      className="inline-block rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200"
                    >
                      登録する
                    </a>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <a
                      href="#signup-form?plan=basic"
                      className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                    >
                      選択する
                    </a>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <a
                      href="#signup-form?plan=premium"
                      className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                    >
                      選択する
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

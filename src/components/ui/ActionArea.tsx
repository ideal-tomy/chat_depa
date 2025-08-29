'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ActionArea() {
  return (
    <section className="action-area my-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🚀 今すぐ始めよう
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 利用方法ガイド */}
        <div className="action-card text-center p-6 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 transition-all duration-300 hover:shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image
              src="/images/sumple01.png"
              alt="利用方法"
              width={80}
              height={80}
              className="w-20 h-20 object-contain z-10 relative"
            />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">利用方法</h3>
          <p className="text-gray-600 mb-4">簡単3ステップで始められます</p>
          <Link 
            href="/how-to-use" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            詳しく見る
          </Link>
        </div>
        
        {/* アカウント作成 */}
        <div className="action-card text-center p-6 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 transition-all duration-300 hover:shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image
              src="/images/uranai01.png"
              alt="新規登録"
              width={80}
              height={80}
              className="w-20 h-20 object-contain z-10 relative"
            />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">新規登録</h3>
          <p className="text-gray-600 mb-4">無料でアカウントを作成</p>
          <Link 
            href="/register" 
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            登録する
          </Link>
        </div>
        
        {/* ポイント購入 */}
        <div className="action-card text-center p-6 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 transition-all duration-300 hover:shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image
              src="/images/sumple04.png"
              alt="ポイント購入"
              width={80}
              height={80}
              className="w-20 h-20 object-contain z-10 relative"
            />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">ポイント購入</h3>
          <p className="text-gray-600 mb-4">お得なプランでポイント購入</p>
          <Link 
            href="/points" 
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            購入する
          </Link>
        </div>
      </div>
      
      {/* ボット一覧へのリンク */}
      <div className="text-center mt-8">
        <Link 
          href="/bots" 
          className="inline-flex items-center bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
        >
          <span className="mr-2">🤖</span>
          すべてのボットを見る
          <span className="ml-2">→</span>
        </Link>
      </div>
    </section>
  );
}

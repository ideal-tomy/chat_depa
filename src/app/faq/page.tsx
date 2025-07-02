'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import FAQAccordion from '@/components/ui/FAQAccordion';
import SupportChat from '@/components/faq/SupportChat';
import Link from 'next/link';
import { FaqItem } from '@/types/types';

// FAQデータ（実際の実装ではAPIから取得）
const faqData: FaqItem[] = [
  {
    id: 'faq1',
    question: 'Chatbot Departmentとは何ですか？',
    answer: 'Chatbot Departmentは、様々な目的に特化したAIチャットボットを提供するサービスです。ビジネス文書の作成、プログラミングのサポート、創作活動の支援など、多様な用途に合わせたボットを取り揃えています。'
  },
  {
    id: 'faq2',
    question: 'ポイント制はどのように機能しますか？',
    answer: 'ボットの利用には一定のポイントが必要です。無料トライアルでは100ポイントが提供され、有料プランではより多くのポイントが毎月付与されます。ポイントは各ボットの利用やファイル出力などの特別機能で消費されます。マイページで残高と利用履歴を確認できます。'
  },
  {
    id: 'faq3',
    question: '無料トライアルの期間はどのくらいですか？',
    answer: '無料トライアル期間は30日間です。この期間中に100ポイントが提供され、多くのボットを試すことができます。トライアル期間終了後も、有料プランに移行しない限り料金は発生しません。'
  },
  {
    id: 'faq4',
    question: '有料プランはいくらですか？',
    answer: '有料プランには「ベーシック」と「プレミアム」の2種類があります。ベーシックプランは月額980円で500ポイント、プレミアムプランは月額1,980円で1,200ポイントが毎月付与されます。年間契約の場合は2ヶ月分お得になります。'
  },
  {
    id: 'faq5',
    question: 'ファイル出力機能とは何ですか？',
    answer: 'チャットの内容をPDF、Word、Excelなどの形式でエクスポートできる機能です。会議の議事録、ビジネスメール、企画書などをすぐに使えるファイル形式で保存できます。ファイル出力には別途50ポイントが必要です。'
  },
  {
    id: 'faq6',
    question: '複数のデバイスで利用できますか？',
    answer: 'はい、Chatbot Departmentはパソコン、タブレット、スマートフォンなど、どのデバイスからでもアクセスできるWebアプリケーションです。ブラウザさえあれば、どこからでも同じアカウントでサービスを利用できます。'
  },
  {
    id: 'faq7',
    question: 'ボットはどのように選べばよいですか？',
    answer: 'ボット一覧ページでは、カテゴリやポイント消費量でフィルタリングできます。また、検索バーから特定のキーワードで検索することも可能です。各ボットには説明と使用例があるので、目的に合ったボットを選びやすくなっています。'
  },
  {
    id: 'faq8',
    question: '支払い方法は何がありますか？',
    answer: 'クレジットカード（Visa、Mastercard、American Express、JCB）およびPayPayでのお支払いに対応しています。お支払い情報はStripeの安全な決済システムで保護されています。'
  },
  {
    id: 'faq9',
    question: '退会するにはどうすればよいですか？',
    answer: 'マイページのアカウント設定から退会手続きを行うことができます。退会するとアカウント情報と保存データはすべて削除されます。有料プランをご利用中の場合は、退会前にプランの解約が必要です。'
  }
];

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showChat, setShowChat] = useState(false);
  
  // 検索フィルタリング
  const filteredFaqs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="bg-gray-50 min-h-screen pb-16">
      {/* ヘッダーセクション */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">よくあるご質問</h1>
          <p className="text-lg text-white/80">
            サービスについてよくいただく質問をまとめました。まずはこちらをご覧ください。
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 検索バー */}
        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="質問を検索する..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* FAQアコーディオン */}
        <div className="mb-12">
          {filteredFaqs.length > 0 ? (
            <FAQAccordion items={filteredFaqs} />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                検索結果がありません。別のキーワードをお試しください。
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-primary hover:underline"
              >
                すべてのFAQを表示
              </button>
            </div>
          )}
        </div>

        {/* チャットサポートセクション */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-center">
          <h2 className="text-xl font-bold mb-4">これでも解決しない場合は</h2>
          <p className="text-gray-600 mb-6">
            解決できない問題がありましたか？サポートBotに質問してみましょう。
          </p>
          
          {!showChat ? (
            <button
              onClick={() => setShowChat(true)}
              className="py-2 px-6 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
            >
              サポートBotに質問する
            </button>
          ) : (
            <SupportChat onClose={() => setShowChat(false)} />
          )}
        </div>

        {/* お問い合わせリンク */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            さらに詳しいサポートが必要ですか？
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center text-primary hover:underline font-medium"
          >
            お問い合わせフォームへ
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUserPlus, FaRobot, FaComments, FaQuestionCircle, FaStar, FaClock, FaShieldAlt } from 'react-icons/fa';

export default function HowToUsePage(): JSX.Element {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* ヒーローセクション */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/sumple04.png"
              alt="AIチャットボット"
              width={120}
              height={120}
              className="w-30 h-30 object-contain animate-bounce"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🤖 AIチャットボットで
            <br />
            新しい体験を始めよう
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            簡単3ステップで、あなた専用の
            <br />
            AIアシスタントが利用できます
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FaUserPlus className="mr-2" />
              今すぐ始める
            </Link>
            <Link
              href="/bots"
              className="inline-flex items-center bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
            >
              <FaRobot className="mr-2" />
              ボット一覧を見る
            </Link>
          </div>
        </div>
      </section>

      {/* 3ステップガイド */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            📋 利用方法（3ステップ）
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUserPlus className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Step 1</h3>
              <h4 className="text-xl font-semibold mb-4 text-blue-600">アカウント作成</h4>
              <p className="text-gray-600 mb-6">
                メールアドレスとパスワードで
                <br />
                簡単にアカウントを作成
              </p>
              <Link
                href="/register"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                登録する
              </Link>
            </div>

            {/* Step 2 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaRobot className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Step 2</h3>
              <h4 className="text-xl font-semibold mb-4 text-green-600">ボット選択</h4>
              <p className="text-gray-600 mb-6">
                目的に合ったボットを
                <br />
                カテゴリから選択
              </p>
              <Link
                href="/bots"
                className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                ボット一覧
              </Link>
            </div>

            {/* Step 3 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaComments className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Step 3</h3>
              <h4 className="text-xl font-semibold mb-4 text-purple-600">チャット開始</h4>
              <p className="text-gray-600 mb-6">
                メッセージを送信して
                <br />
                すぐにチャット開始
              </p>
              <Link
                href="/bots"
                className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                使ってみる
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 機能紹介セクション */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            ✨ 主な機能
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 24時間対応 */}
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/uranai01.png"
                  alt="24時間対応"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">24時間対応</h3>
              <p className="text-gray-600 mb-6">
                いつでもどこでも
                <br />
                AIアシスタントがサポート
              </p>
              <div className="flex items-center justify-center text-yellow-500">
                <FaClock className="mr-2" />
                <span className="text-sm font-semibold">24/7 サポート</span>
              </div>
            </div>

            {/* 多様なボット */}
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/sumple01.png"
                  alt="多様なボット"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">多様なボット</h3>
              <p className="text-gray-600 mb-6">
                仕事、学習、趣味など
                <br />
                様々な用途に対応
              </p>
              <div className="flex items-center justify-center text-blue-500">
                <FaStar className="mr-2" />
                <span className="text-sm font-semibold">100+ ボット</span>
              </div>
            </div>

            {/* 簡単操作 */}
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/sumple03.png"
                  alt="簡単操作"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">簡単操作</h3>
              <p className="text-gray-600 mb-6">
                直感的なインターフェースで
                <br />
                誰でも簡単に利用
              </p>
              <div className="flex items-center justify-center text-green-500">
                <FaShieldAlt className="mr-2" />
                <span className="text-sm font-semibold">安全・安心</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 使用例セクション */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            💡 使用例
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* 仕事での活用 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <h3 className="text-2xl font-bold mb-6 text-blue-600">💼 仕事での活用</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">•</span>
                  <span>プレゼン資料の作成サポート</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">•</span>
                  <span>メール文面の作成・校正</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">•</span>
                  <span>アイデア出し・ブレインストーミング</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">•</span>
                  <span>データ分析・レポート作成</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/bots?category=work"
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  仕事用ボットを見る
                </Link>
              </div>
            </div>

            {/* 学習での活用 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <h3 className="text-2xl font-bold mb-6 text-green-600">📚 学習での活用</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>英語学習・翻訳サポート</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>プログラミング学習</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>数学・科学の問題解決</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>論文・レポートの執筆支援</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/bots?category=study"
                  className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  学習用ボットを見る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* よくある質問 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            ❓ よくある質問
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                <FaQuestionCircle className="text-blue-500 mr-3" />
                利用料金はいくらですか？
              </h3>
              <p className="text-gray-600">
                基本利用は無料です。ポイント制でボットとのチャットを利用できます。
                ポイントは1ポイントから購入可能で、1ポイント約1回のチャットが利用できます。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                <FaQuestionCircle className="text-blue-500 mr-3" />
                どのようなボットがありますか？
              </h3>
              <p className="text-gray-600">
                仕事、学習、趣味、占い、エンターテイメントなど、様々なカテゴリのボットを用意しています。
                新しいボットも定期的に追加されています。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                <FaQuestionCircle className="text-blue-500 mr-3" />
                チャット履歴は保存されますか？
              </h3>
              <p className="text-gray-600">
                はい、チャット履歴は自動的に保存されます。
                過去の会話をいつでも確認でき、継続的な会話が可能です。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                <FaQuestionCircle className="text-blue-500 mr-3" />
                プライバシーは保護されますか？
              </h3>
              <p className="text-gray-600">
                はい、すべてのチャット内容は暗号化され、厳重に保護されています。
                個人情報の漏洩や第三者への提供は一切ありません。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 利用開始CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            🚀 今すぐ始めよう！
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            簡単3ステップで、あなた専用のAIアシスタントが利用できます。
            無料でアカウントを作成して、新しい体験を始めましょう。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FaUserPlus className="mr-2" />
              無料で登録する
            </Link>
            <Link
              href="/bots"
              className="inline-flex items-center bg-transparent hover:bg-white/10 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 border-2 border-white"
            >
              <FaRobot className="mr-2" />
              ボット一覧を見る
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

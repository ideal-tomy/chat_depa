'use client';

import { useState } from 'react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('メールアドレスを入力してください');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // ここで実際のパスワードリセットメール送信処理を行う（Supabase Auth等）
      console.log('Password reset requested for:', email);
      
      // 仮の成功レスポンス
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
      }, 1500);
      
    } catch (error) {
      console.error('Password reset error:', error);
      setError('パスワード再設定メールの送信に失敗しました。再度お試しください。');
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-4 bg-green-50 border border-green-200 rounded-md">
        <h3 className="font-medium text-green-800 mb-2">メールを送信しました</h3>
        <p className="text-sm text-green-700">
          {email} 宛にパスワード再設定用のリンクを送信しました。
          メールをご確認ください。
        </p>
        <p className="text-sm text-gray-600 mt-4">
          メールが届かない場合は、迷惑メールフォルダをご確認いただくか、
          別のメールアドレスでお試しください。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
          placeholder="example@email.com"
          disabled={isLoading}
        />
      </div>
      
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? '処理中...' : 'パスワード再設定メールを送信'}
        </button>
      </div>
    </form>
  );
}

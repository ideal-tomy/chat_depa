"use client";

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { supabase } from '@/lib/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      setMessage('指定されたメールアドレスに確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。');
      setEmail('');
      setPassword('');
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">アカウント作成</h1>
          <p className="mt-2 text-sm text-gray-600">無料で始めて、すぐに利用できます。</p>
        </div>

        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            <FcGoogle className="w-5 h-5 mr-2" />
            Googleで登録
          </Button>
          <Button variant="outline" className="w-full">
            <FaGithub className="w-5 h-5 mr-2" />
            GitHubで登録
          </Button>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <span className="w-full h-px bg-gray-300"></span>
          <span className="text-sm text-gray-500">OR</span>
          <span className="w-full h-px bg-gray-300"></span>
        </div>

                {message && <p className="text-sm text-center text-green-600 bg-green-50 p-3 rounded-md">{message}</p>}
        {error && <p className="text-sm text-center text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
                        <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
                        <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Button type="submit" className="w-full">
              無料で始める
            </Button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600">
          すでにアカウントをお持ちですか？{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}

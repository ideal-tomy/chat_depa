"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/');
      router.refresh();
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">おかえりなさい</h1>
          <p className="mt-2 text-sm text-gray-600">アカウントにログインしてください。</p>
        </div>

        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            <FcGoogle className="w-5 h-5 mr-2" />
            Googleでログイン
          </Button>
          <Button variant="outline" className="w-full">
            <FaGithub className="w-5 h-5 mr-2" />
            GitHubでログイン
          </Button>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <span className="w-full h-px bg-gray-300"></span>
          <span className="text-sm text-gray-500">OR</span>
          <span className="w-full h-px bg-gray-300"></span>
        </div>

                {error && <p className="text-sm text-center text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:underline">
                  パスワードをお忘れですか？
                </a>
              </div>
            </div>
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
              ログイン
            </Button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600">
          アカウントをお持ちでないですか？{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}

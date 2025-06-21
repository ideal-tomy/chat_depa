'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください';
    }
    
    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // エラーを消す
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // ここで実際のログイン処理を行う（Supabase Authなど）
      console.log('Login form submitted:', formData);
      
      // 成功したらマイページへリダイレクト
      setTimeout(() => {
        router.push('/account/mypage');
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        ...errors,
        form: 'メールアドレスまたはパスワードが正しくありません。'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 全体エラーメッセージ */}
      {errors.form && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-600 text-sm">
          {errors.form}
        </div>
      )}
      
      {/* メールアドレス */}
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
          メールアドレス
        </label>
        <input
          type="email"
          id="login-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary-light'
          }`}
          placeholder="example@email.com"
          disabled={isLoading}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      
      {/* パスワード */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <Link href="/account/forgot-password" className="text-sm text-primary hover:underline">
            パスワードをお忘れですか？
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="login-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary-light'
            }`}
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>
      
      {/* Remember Me */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="remember-me"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleChange}
          className="h-4 w-4 text-primary border-gray-300 rounded"
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
          ログイン状態を保持する
        </label>
      </div>
      
      {/* ログインボタン */}
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </button>
      </div>
      
      {/* SNSログイン */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">または</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M21.35 12.04c0-.68-.06-1.34-.17-1.97h-9.58v3.73h5.49c-.24 1.27-.94 2.35-2.01 3.08v2.58h3.25c1.9-1.76 3-4.35 3-7.42z"
              />
              <path
                fill="#34A853"
                d="M12 21c2.73 0 5.02-.9 6.68-2.43l-3.25-2.53c-.9.6-2.04.96-3.43.96-2.64 0-4.88-1.79-5.68-4.18H3v2.61C4.66 18.9 8.12 21 12 21z"
              />
              <path
                fill="#FBBC05"
                d="M6.32 13.82c-.2-.6-.32-1.24-.32-1.9s.12-1.3.32-1.9V7.41H3C2.36 8.8 2 10.36 2 12s.36 3.2 1 4.59l3.32-2.77z"
              />
              <path
                fill="#EA4335"
                d="M12 6.82c1.49 0 2.83.51 3.88 1.51l2.88-2.88C17.04 3.77 14.72 3 12 3c-3.88 0-7.34 2.1-9 5.41l3.32 2.59c.8-2.39 3.04-4.18 5.68-4.18z"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.74c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.88 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.93 0-1.1.38-1.99 1.03-2.7-.1-.25-.45-1.29.1-2.68 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.4.2 2.43.1 2.68.65.71 1.03 1.6 1.03 2.7 0 3.83-2.33 4.68-4.55 4.93.36.31.68.92.68 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z"
                clipRule="evenodd"
              />
            </svg>
            GitHub
          </button>
        </div>
      </div>
    </form>
  );
}

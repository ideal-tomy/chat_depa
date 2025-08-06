'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import Button from '@/components/ui/Button';

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    agreeTerms: false
  });
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
    agreeTerms?: string;
    form?: string;
  }>({});

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      setErrors({ form: error.message });
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.email) newErrors.email = 'メールアドレスを入力してください';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '有効なメールアドレスを入力してください';
    if (!formData.password) newErrors.password = 'パスワードを入力してください';
    else if (formData.password.length < 8) newErrors.password = 'パスワードは8文字以上で入力してください';
    if (!formData.name) newErrors.name = 'お名前を入力してください';
    if (!formData.agreeTerms) newErrors.agreeTerms = '利用規約に同意する必要があります';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!validateForm()) return;

    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: formData.name },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrors({ form: error.message });
    } else if (data.user) {
      setMessage('指定されたメールアドレスに確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。');
      setFormData({ email: '', password: '', name: '', agreeTerms: false });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button variant="outline" className="w-full" onClick={() => handleOAuthLogin('google')} disabled={isLoading}>
          <FcGoogle className="w-5 h-5 mr-2" />
          Googleで登録
        </Button>
        <Button variant="outline" className="w-full" onClick={() => handleOAuthLogin('github')} disabled={isLoading}>
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
      {errors.form && <p className="text-sm text-center text-red-600 bg-red-50 p-3 rounded-md">{errors.form}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary-light'}`} placeholder="example@email.com" disabled={isLoading} />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">お名前</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary-light'}`} placeholder="山田 太郎" disabled={isLoading} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary-light'}`} placeholder="8文字以上" disabled={isLoading} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        <div className="flex items-center">
          <input id="agreeTerms" name="agreeTerms" type="checkbox" checked={formData.agreeTerms} onChange={handleChange} className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" disabled={isLoading} />
          <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
            <Link href="/terms" className="underline hover:text-primary">利用規約</Link>に同意する
          </label>
        </div>
        {errors.agreeTerms && <p className="-mt-4 text-sm text-red-600">{errors.agreeTerms}</p>}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '登録中...' : '同意して登録する'}
        </Button>

        <p className="text-center text-sm text-gray-600">
          すでにアカウントをお持ちですか？{' '}
          <Link href="/account/login" className="font-medium text-primary hover:underline">
            ログイン
          </Link>
        </p>
      </form>
    </div>
  );
}

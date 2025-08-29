"use client";

import Image from 'next/image';
import SignupForm from '@/components/features/auth/SignupForm';

export default function SignupPage(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/images/sumple04.png"
              alt="icon"
              width={60}
              height={60}
              className="rounded-full"
            />
            <h1 className="text-3xl font-bold text-gray-900">アカウント作成</h1>
          </div>
          <p className="mt-2 text-sm text-gray-600">無料で始めて、すぐに利用できます。</p>
        </div>

        <SignupForm />

      </div>
    </div>
  );
}

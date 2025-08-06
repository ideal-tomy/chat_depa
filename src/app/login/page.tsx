import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata = {
  title: 'ログイン | Chatbot Department',
  description: 'Chatbot Departmentにログインして、AIチャットを楽しもう。',
};

export default function LoginPage() {
  return (
    <main className="bg-gray-50 text-gray-800 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 py-10 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-6">ログイン</h1>
          
          <LoginForm />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              アカウントをお持ちでないですか？{' '}
              <Link href="/account/register" className="text-primary hover:underline font-medium">
                無料登録する
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
import ForgotPasswordForm from '@/components/features/auth/ForgotPasswordForm';
import Link from 'next/link';

export const metadata = {
  title: 'パスワード再設定 | Chatbot Department',
  description: 'Chatbot Departmentのパスワードを忘れた場合の再設定ページです。',
};

export default function ForgotPasswordPage(): JSX.Element {
  return (
    <main className="bg-gray-50 text-gray-800 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 py-10 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-6">パスワードをお忘れですか？</h1>
          <p className="text-center text-gray-600 mb-6">
            登録したメールアドレスを入力すると、パスワード再設定用のリンクをお送りします。
          </p>
          
          <ForgotPasswordForm />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <Link href="/account/login" className="text-primary hover:underline font-medium">
                ログインページに戻る
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';
import { Dialog } from '@headlessui/react';
import { 
  UserCircleIcon, 
  ChevronDownIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { getCurrentUser, signOut } from '@/lib/auth';
import { pointsAPI } from '@/lib/api-client';

export default function Header(): JSX.Element {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [pointBalance, setPointBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  const navigation = [
    { name: 'トップ', href: '/' },
    { name: 'Bot一覧', href: '/bots' },
    { name: '利用方法', href: '/how-to-use' },
    { name: 'AIニュース', href: '/news' },
    { name: 'よくある質問', href: '/faq' },
  ];

  // ユーザー情報とポイント残高を取得
  const fetchUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const pointsResponse = await pointsAPI.getBalance();
        if (pointsResponse.success) {
          setPointBalance(pointsResponse.data?.current_points || 0);
        }
      }
    } catch (error) {
      logger.error('ユーザーデータ取得エラー', new Error(String(error)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // ログアウト処理
  const handleSignOut = async () => {
    const success = await signOut();
    if (success) {
      setUser(null);
      setPointBalance(0);
      setUserMenuOpen(false);
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Chatbot Department</span>
            <h1 className="text-2xl font-bold text-primary">Chatbot Department</h1>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">メニューを開く</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary">
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-4">
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          ) : user ? (
            <>
              {/* ポイント残高表示 */}
              <Link 
                href="/account/mypage"
                className="flex items-center space-x-2 bg-primary text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                <span>{pointBalance}P</span>
              </Link>
              
              {/* ユーザーメニュー */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-1 text-sm font-semibold text-gray-900 hover:text-primary"
                >
                  <UserCircleIcon className="h-6 w-6" />
                  <span className="hidden sm:block">{user.email?.split('@')[0] || 'ユーザー'}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <Link
                      href="/account/mypage"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      マイページ
                    </Link>
                    <Link
                      href="/account/points/purchase"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      ポイント購入
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                        ログアウト
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/account/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary">
              ログイン <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>

      {/* モバイルメニュー */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Chatbot Department</span>
              <h2 className="text-xl font-bold text-primary">Chatbot Department</h2>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">メニューを閉じる</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between -mx-3 px-3 py-2">
                      <span className="text-base font-semibold text-gray-900">
                        {user.email?.split('@')[0] || 'ユーザー'}
                      </span>
                      <div className="bg-primary text-white px-2 py-1 rounded-full text-sm font-medium">
                        {pointBalance}P
                      </div>
                    </div>
                    <Link
                      href="/account/mypage"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      マイページ
                    </Link>
                    <Link
                      href="/account/points/purchase"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ポイント購入
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="-mx-3 block w-full text-left rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      ログアウト
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/account/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ログイン
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}

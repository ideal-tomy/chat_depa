'use client';

import Link from 'next/link';

export default function Footer(): JSX.Element {
  const navigation = {
    main: [
      { name: 'トップ', href: '/' },
      { name: 'Bot一覧', href: '/bots' },
      { name: '利用方法', href: '/how-to-use' },
      { name: 'AIニュース', href: '/news' },
      { name: 'よくある質問', href: '/faq' },
    ],
    legal: [
      { name: '利用規約', href: '/terms' },
      { name: 'プライバシーポリシー', href: '/privacy' },
      { name: '特定商取引法に基づく表記', href: '/legal' },
    ],
    company: [
      { name: '運営会社', href: '/about' },
      { name: 'お問い合わせ', href: '/contact' },
    ],
  };

  return (
    <footer className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center space-x-6 md:space-x-12" aria-label="Footer">
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6">
              <Link href={item.href} className="text-sm text-text-dark hover:text-primary">
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center space-x-6 md:order-2">
              {/* SNSアイコンリンク */}
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
            </div>
            <div className="mt-8 md:order-1 md:mt-0">
              <p className="text-center text-sm text-gray-500">&copy; 2025 Chatbot Department. All rights reserved.</p>
            </div>
          </div>
          <div className="mt-8 flex justify-center space-x-6">
            {navigation.legal.map((item) => (
              <Link key={item.name} href={item.href} className="text-xs text-gray-500 hover:text-gray-600">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

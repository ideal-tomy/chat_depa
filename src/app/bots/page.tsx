import BotPageClient from '@/components/bots/BotPageClient';

export const metadata = {
  title: 'Bot一覧 | Chatbot Department',
  description: '様々な専門分野のBotをご用意しています。目的に合わせてお選びください。',
};

export default function BotsPage() {
  return (
    <main className="bg-gray-50 text-gray-800">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">見つかる、育つ、あなたのボット</h1>
        <p className="text-lg">最先端のAIボットたちと、新しい対話体験を始めましょう。</p>
      </section>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <h2 className="text-3xl font-bold mb-6 text-center md:text-left">Botストア</h2>
        <BotPageClient />
      </div>
      
      {/* UGCセクション（クリエイター作成ボット）の予定地 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center max-w-7xl">
          <h2 className="text-3xl font-bold mb-4">クリエイターズ・スポットライト</h2>
          <p className="text-gray-600 mb-8">ユーザーコミュニティから生まれた、独創的なボットたち。</p>
          {/* ここにクリエイター作成ボットのカルーセルやリストを配置 */}
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Coming Soon...</p>
          </div>
        </div>
      </section>
    </main>
  );
}

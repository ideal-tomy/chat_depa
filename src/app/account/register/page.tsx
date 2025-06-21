import HeroSection from '@/components/ui/HeroSection';
import SignupForm from '@/components/auth/SignupForm';
import PlanComparisonTable from '@/components/ui/PlanComparisonTable';

export const metadata = {
  title: '会員登録 | Chatbot Department',
  description: 'ポイントを使ってAI Botとチャットしましょう。会員登録して100ポイント無料プレゼント！',
};

export default function RegisterPage() {
  return (
    <main className="bg-gray-50 text-gray-800">
      {/* ヒーローセクション */}
      <HeroSection 
        title="今すぐ無料トライアル！"
        description="会員登録で100ポイントプレゼント"
        buttonText="無料登録する"
        buttonLink="#signup-form"
      />
      
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* プラン比較テーブル */}
        <section id="plans" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">料金プラン</h2>
          <PlanComparisonTable />
        </section>
        
        {/* 登録フォーム */}
        <section id="signup-form" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">会員登録</h2>
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <SignupForm />
          </div>
        </section>

        {/* FAQ リンク */}
        <section className="text-center mb-16">
          <h3 className="text-xl font-medium mb-4">ご不明な点がありますか？</h3>
          <a 
            href="/faq" 
            className="text-primary hover:text-primary-dark underline text-lg"
          >
            登録前によくある質問を見る
          </a>
        </section>
      </div>
    </main>
  );
}

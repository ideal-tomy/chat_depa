import HeroSection from '@/components/ui/HeroSection';
import FAQAccordion from '@/components/ui/FAQAccordion';
import Image from 'next/image';

export const metadata = {
  title: '利用方法 | Chatbot Department',
  description: 'Chatbot Department のポイント制度と Bot チャット手順を解説します。',
};

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: '無料登録',
    description: 'メールアドレスまたは SNS ログインでアカウントを作成します。',
    icon: '/icons/step1.svg',
  },
  {
    id: 2,
    title: 'ポイント購入',
    description: 'クレジットカード決済でポイントをチャージします。',
    icon: '/icons/step2.svg',
  },
  {
    id: 3,
    title: 'Bot を選択',
    description: 'ストアから目的に合った Bot を選びます。',
    icon: '/icons/step3.svg',
  },
  {
    id: 4,
    title: 'チャット開始',
    description: '質問を入力すると AI が回答します。',
    icon: '/icons/step4.svg',
  },
];

const troubleItems = [
  {
    question: 'ポイントはどこで確認できますか?',
    answer: 'マイページの「ポイント残高」でいつでも確認できます。',
  },
  {
    question: 'Bot とのチャットは1メッセージ何ポイントですか?',
    answer: 'Bot ごとに異なります。Bot 詳細ページに消費ポイントが表示されます。',
  },
  {
    question: '返答がこない場合は?',
    answer: 'ネットワーク状況を確認し、数分待っても改善しない場合はサポートへご連絡ください。',
  },
];

export default function HowToUsePage() {
  return (
    <main className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <HeroSection
        title="Chatbot Department の使い方"
        description="登録から Bot でのチャット開始までの流れを 4 ステップでご紹介します。"
        primaryButtonText="今すぐ始める"
        primaryButtonLink="/signup"
        secondaryButtonText="Bot ストアを見る"
        secondaryButtonLink="/bots"
      />

      {/* ポイント制度の図解 */}
      <section className="my-20 text-center">
        <h2 className="text-3xl font-bold mb-8">ポイントの仕組み</h2>
        <div className="flex justify-center">
          <Image src="/images/points-flow.png" alt="ポイントフロー" width={640} height={360} className="rounded-lg shadow" />
        </div>
      </section>

      {/* ステップ紹介 */}
      <section className="my-20">
        <h2 className="text-3xl font-bold text-center mb-12">ご利用手順</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <Image src={step.icon} alt={step.title} width={72} height={72} />
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ / トラブルシューティング */}
      <section className="my-20">
        <h2 className="text-3xl font-bold text-center mb-10">よくあるトラブルと対処法</h2>
        <FAQAccordion items={troubleItems} />
      </section>
    </main>
  );
}

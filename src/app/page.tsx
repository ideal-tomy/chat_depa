export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 py-12">
      {/* ヒーローセクション */}
      <section className="w-full max-w-5xl text-center mb-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
          Chatbot Department
        </h1>
        <p className="text-lg md:text-xl text-text-dark mb-8">
          用途別AIチャットボットを一画面で探せて使える "Botの百貨店"
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all">
            無料で始める
          </button>
          <button className="bg-white border-2 border-primary text-primary hover:bg-gray-50 font-bold py-3 px-6 rounded-lg shadow-sm transition-all">
            Bot一覧を見る
          </button>
        </div>
      </section>

      {/* コンテンツセクション（ダミー） */}
      <section className="w-full max-w-5xl mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">ピックアップBot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-accent-blue flex items-center justify-center text-white text-lg font-bold">Bot</div>
                <div className="ml-4">
                  <h3 className="font-bold">サンプルBot {i + 1}</h3>
                  <p className="text-sm text-text-light">新機能追加！</p>
                </div>
              </div>
              <p className="text-text-dark mb-4">このBotの説明文がここに入ります。このBotは様々な質問に回答できます。</p>
              <button className="w-full bg-accent-yellow text-text-dark font-medium py-2 rounded hover:bg-opacity-80 transition-all">
                試してみる
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 簡易的な特徴セクション */}
      <section className="w-full max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Chatbot Departmentの特徴</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">1. 多種多様なチャットAI</h3>
            <p>様々な専門分野に特化したチャットボットを一つのプラットフォームでご利用いただけます。</p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">2. ポイント制で簡単利用</h3>
            <p>必要な分だけポイントを購入して、お好きなボットに使えます。無駄がなく経済的です。</p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">3. ファイル出力機能</h3>
            <p>チャット内容をWord、Excel、PDFなど様々な形式で出力でき、業務効率化に貢献します。</p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">4. 無料お試し枠</h3>
            <p>初めての方も安心。無料ポイントで各ボットの実力をお試しいただけます。</p>
          </div>
        </div>
      </section>
    </div>
  );
}

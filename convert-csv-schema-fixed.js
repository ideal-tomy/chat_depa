const fs = require('fs');
const { parse } = require('csv-parse');

// CSVファイルを読み込んでSupabaseスキーマに合わせて変換
fs.createReadStream('first_all.csv')
  .pipe(parse({ 
    delimiter: ',',
    columns: true,
    skip_empty_lines: true,
    quote: '"',
    escape: '"'
  }))
  .on('data', (data) => {
    // 空のリストを初期化
    if (!global.allBots) {
      global.allBots = [];
    }

    // CSVデータをSupabaseスキーマに合わせて変換
    const bot = {
      name: data.name,
      description: data.character_desc, // character_descをdescriptionに
      category: data.category,
      avatar_url: getCategoryAvatarUrl(data.category),
      can_upload_image: false, // デフォルト値
      can_send_file: false,    // デフォルト値
      points: parseInt(data.point) || 15, // pointをpointsに変換
      complexity: "medium",    // デフォルト値
      instructions: data.system_prompt, // system_promptをinstructionsに
      // CSVにあるが使用しないフィールド：
      // - tags, badge_text, background_color, display_order, disabled
      // - interaction_type, model
    };

    global.allBots.push(bot);
  })
  .on('end', () => {
    console.log(`変換完了: ${global.allBots.length}件のボットデータ`);
    
    // JavaScriptファイルとして出力
    const outputContent = `// 全${global.allBots.length}件のボットデータ（Supabaseスキーマ対応版）
const csvBots = ${JSON.stringify(global.allBots, null, 2)};

module.exports = csvBots;
`;
    
    fs.writeFileSync('bots-data-schema-fixed.js', outputContent);
    console.log('ファイル出力完了: bots-data-schema-fixed.js');
    
    // 最初の5件をログ出力して確認
    console.log('最初の5件のサンプル:');
    console.log(JSON.stringify(global.allBots.slice(0, 5), null, 2));
  })
  .on('error', (err) => {
    console.error('CSVパースエラー:', err);
  });

// カテゴリに応じたアバターURLを生成
function getCategoryAvatarUrl(category) {
  const categoryMap = {
    '申請系': '/images/icons/placeholder/law.png',
    '法解釈系': '/images/icons/placeholder/law.png',
    '契約系': '/images/icons/placeholder/law.png',
    '行政書士系': '/images/icons/placeholder/law.png',
    '書類チェック系': '/images/icons/placeholder/law.png',
    '司法書士系': '/images/icons/placeholder/law.png',
    '弁護士（刑事）': '/images/icons/placeholder/law.png',
    '弁護士（民事）': '/images/icons/placeholder/law.png',
    '運動サポート': '/images/icons/placeholder/health.png',
    '習慣化支援': '/images/icons/placeholder/health.png',
    '食事指導': '/images/icons/placeholder/health.png',
    '栄養管理': '/images/icons/placeholder/health.png',
    '栄養素解説': '/images/icons/placeholder/health.png',
    '栄養偏重': '/images/icons/placeholder/health.png',
    'メンタル支援': '/images/icons/placeholder/health.png',
    'ボディケア': '/images/icons/placeholder/health.png',
    '健康管理': '/images/icons/placeholder/health.png',
    '運動評価': '/images/icons/placeholder/health.png',
    'レシピ・ごはん系': '/images/icons/placeholder/life.png',
    'お金管理系': '/images/icons/placeholder/life.png',
    '旅行系': '/images/icons/placeholder/life.png',
    '家事サポート': '/images/icons/placeholder/life.png',
    '育児系': '/images/icons/placeholder/life.png',
    'インテリア系': '/images/icons/placeholder/life.png',
    '生活リズム系': '/images/icons/placeholder/life.png',
    'ショッピング系': '/images/icons/placeholder/life.png',
    '片付け系': '/images/icons/placeholder/life.png',
    'ライフハック系': '/images/icons/placeholder/life.png',
    '学習サポート': '/images/icons/placeholder/edu.png',
    'モチベ支援': '/images/icons/placeholder/edu.png',
    '数学特化': '/images/icons/placeholder/edu.png',
    '英語系': '/images/icons/placeholder/edu.png',
    '歴史・地理系': '/images/icons/placeholder/edu.png',
    'テスト対策': '/images/icons/placeholder/edu.png',
    '確認テスト系': '/images/icons/placeholder/edu.png',
    '言語化トレーニング系': '/images/icons/placeholder/edu.png',
    'サボり共感系': '/images/icons/placeholder/edu.png',
    '資料作成サポート': '/images/icons/placeholder/business.png',
    'プレゼン改善系': '/images/icons/placeholder/business.png',
    '業務整理系': '/images/icons/placeholder/business.png',
    '議事録系': '/images/icons/placeholder/business.png',
    '進行管理系': '/images/icons/placeholder/business.png',
    '数字管理系': '/images/icons/placeholder/business.png',
    '管理系': '/images/icons/placeholder/business.png',
    '営業系': '/images/icons/placeholder/business.png',
    'ライフイベント系': '/images/icons/placeholder/business.png',
    'キャリア系': '/images/icons/placeholder/business.png',
    '愚痴・ストレス発散系': '/images/icons/placeholder/mental.png',
    '過敏系': '/images/icons/placeholder/mental.png',
    '揶揄・診断系': '/images/icons/placeholder/mental.png',
    '社会不適応系': '/images/icons/placeholder/mental.png',
    '無気力系': '/images/icons/placeholder/mental.png',
    '過敏共感系': '/images/icons/placeholder/mental.png',
    '霊性寄り': '/images/icons/placeholder/mental.png',
    'ルーティン系': '/images/icons/placeholder/mental.png',
    '孤独系': '/images/icons/placeholder/mental.png',
    '強制ポジティブ系': '/images/icons/placeholder/mental.png',
    '夜メンタル系': '/images/icons/placeholder/mental.png',
    '過剰励まし系': '/images/icons/placeholder/mental.png',
    'あるある共感系': '/images/icons/placeholder/mental.png',
    '孤独・ネット民系': '/images/icons/placeholder/mental.png',
    '自責系': '/images/icons/placeholder/mental.png',
    '優柔不断救済': '/images/icons/placeholder/mental.png',
    '肯定系': '/images/icons/placeholder/mental.png',
    '怪しい系': '/images/icons/placeholder/mental.png',
    '哲学相談系': '/images/icons/placeholder/mental.png',
    '終着アドバイス系': '/images/icons/placeholder/mental.png',
    '推し活': '/images/icons/placeholder/fun.png',
    'お笑い系': '/images/icons/placeholder/fun.png',
    '料理・創作系': '/images/icons/placeholder/fun.png',
    '妄想系': '/images/icons/placeholder/fun.png',
    '恋愛妄想系': '/images/icons/placeholder/fun.png',
    '映画・エンタメ系': '/images/icons/placeholder/fun.png',
    '乗り物系': '/images/icons/placeholder/fun.png',
    '雑多系': '/images/icons/placeholder/fun.png',
    '例え話職人': '/images/icons/placeholder/fun.png',
    '日常エンタメ化': '/images/icons/placeholder/fun.png',
    '占い系': '/images/icons/placeholder/spiritual.png',
    'スピリチュアル系': '/images/icons/placeholder/spiritual.png',
    '理性系': '/images/icons/placeholder/spiritual.png',
    '星読み・暦系': '/images/icons/placeholder/spiritual.png',
    '創作占い系': '/images/icons/placeholder/spiritual.png',
    '前世系': '/images/icons/placeholder/spiritual.png',
    '心理スピ系': '/images/icons/placeholder/spiritual.png',
    'タロット系': '/images/icons/placeholder/spiritual.png',
    '宇宙メッセージ系': '/images/icons/placeholder/spiritual.png',
    'ホロスコープ': '/images/icons/placeholder/spiritual.png',
    '星座占い': '/images/icons/placeholder/spiritual.png',
    '気学・方位': '/images/icons/placeholder/spiritual.png',
    '命式解読': '/images/icons/placeholder/spiritual.png',
    'タロット': '/images/icons/placeholder/spiritual.png',
    'スピ全振り': '/images/icons/placeholder/spiritual.png',
    'オリジナル系': '/images/icons/placeholder/spiritual.png',
    '広告コピー系': '/images/icons/placeholder/writing.png',
    'SNS文系': '/images/icons/placeholder/writing.png',
    '広報文系': '/images/icons/placeholder/writing.png',
    '簡単表現系': '/images/icons/placeholder/writing.png',
    '広報・炎上防止系': '/images/icons/placeholder/writing.png',
    'ネタ生成系': '/images/icons/placeholder/writing.png',
    '文体制御系': '/images/icons/placeholder/writing.png',
    '作家ごっこ系': '/images/icons/placeholder/writing.png',
    'ビジネス資料系': '/images/icons/placeholder/writing.png',
    'バズ狙い系': '/images/icons/placeholder/writing.png',
    '住所変更': '/images/icons/placeholder/docs.png',
    '保険系': '/images/icons/placeholder/docs.png',
    '公的番号系': '/images/icons/placeholder/docs.png',
    '補助金系': '/images/icons/placeholder/docs.png',
    '勤務系手続き': '/images/icons/placeholder/docs.png',
    '進捗管理': '/images/icons/placeholder/docs.png',
    '情報取得': '/images/icons/placeholder/docs.png',
    '初心者向け': '/images/icons/placeholder/docs.png',
    '行動支援': '/images/icons/placeholder/docs.png',
    'プロ風演出系': '/images/icons/placeholder/docs.png'
  };
  
  return categoryMap[category] || '/images/icons/placeholder/default.png';
}
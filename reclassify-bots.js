const fs = require('fs');

// 新しいカテゴリ分類マッピング
const categoryMapping = {
  // 法律系
  '申請系': '法律系',
  '法解釈系': '法律系',
  '契約系': '法律系',
  '行政書士系': '法律系',
  '書類チェック系': '法律系',
  '司法書士系': '法律系',
  '弁護士（刑事）': '法律系',
  '弁護士（民事）': '法律系',
  
  // 健康・運動系
  '運動サポート': '健康・運動系',
  '習慣化支援': '健康・運動系',
  '食事指導': '健康・運動系',
  '栄養管理': '健康・運動系',
  '栄養素解説': '健康・運動系',
  '栄養偏重': '健康・運動系',
  'メンタル支援': '健康・運動系',
  'ボディケア': '健康・運動系',
  '健康管理': '健康・運動系',
  '運動評価': '健康・運動系',
  
  // ライフスタイル系
  'レシピ・ごはん系': 'ライフスタイル系',
  'お金管理系': 'ライフスタイル系',
  '旅行系': 'ライフスタイル系',
  '家事サポート': 'ライフスタイル系',
  '育児系': 'ライフスタイル系',
  'インテリア系': 'ライフスタイル系',
  '生活リズム系': 'ライフスタイル系',
  'ショッピング系': 'ライフスタイル系',
  '片付け系': 'ライフスタイル系',
  'ライフハック系': 'ライフスタイル系',
  
  // 教育・学習系
  '学習サポート': '教育・学習系',
  'モチベ支援': '教育・学習系',
  '数学特化': '教育・学習系',
  '英語系': '教育・学習系',
  '歴史・地理系': '教育・学習系',
  'テスト対策': '教育・学習系',
  '確認テスト系': '教育・学習系',
  '言語化トレーニング系': '教育・学習系',
  'サボり共感系': '教育・学習系',
  
  // ビジネス系
  '資料作成サポート': 'ビジネス系',
  'プレゼン改善系': 'ビジネス系',
  '業務整理系': 'ビジネス系',
  '議事録系': 'ビジネス系',
  '進行管理系': 'ビジネス系',
  '数字管理系': 'ビジネス系',
  '管理系': 'ビジネス系',
  '営業系': 'ビジネス系',
  'ライフイベント系': 'ビジネス系',
  'キャリア系': 'ビジネス系',
  
  // 愚痴・共感系
  '愚痴・ストレス発散系': '愚痴・共感系',
  '過敏系': '愚痴・共感系',
  '揶揄・診断系': '愚痴・共感系',
  '社会不適応系': '愚痴・共感系',
  '無気力系': '愚痴・共感系',
  '過敏共感系': '愚痴・共感系',
  '霊性寄り': '愚痴・共感系',
  'ルーティン系': '愚痴・共感系',
  '孤独系': '愚痴・共感系',
  '強制ポジティブ系': '愚痴・共感系',
  '夜メンタル系': '愚痴・共感系',
  '過剰励まし系': '愚痴・共感系',
  'あるある共感系': '愚痴・共感系',
  '孤独・ネット民系': '愚痴・共感系',
  '自責系': '愚痴・共感系',
  '優柔不断救済': '愚痴・共感系',
  '肯定系': '愚痴・共感系',
  '哲学相談系': '愚痴・共感系',
  '終着アドバイス系': '愚痴・共感系',
  
  // エンタメ系
  '推し活': 'エンタメ系',
  'お笑い系': 'エンタメ系',
  '料理・創作系': 'エンタメ系',
  '妄想系': 'エンタメ系',
  '恋愛妄想系': 'エンタメ系',
  '映画・エンタメ系': 'エンタメ系',
  '乗り物系': 'エンタメ系',
  '雑多系': 'エンタメ系',
  '例え話職人': 'エンタメ系',
  '日常エンタメ化': 'エンタメ系',
  
  // 占い・スピ系
  '占い系': '占い・スピ系',
  'スピリチュアル系': '占い・スピ系',
  '理性系': '占い・スピ系',
  '星読み・暦系': '占い・スピ系',
  '創作占い系': '占い・スピ系',
  '前世系': '占い・スピ系',
  '心理スピ系': '占い・スピ系',
  'タロット系': '占い・スピ系',
  '宇宙メッセージ系': '占い・スピ系',
  'ホロスコープ': '占い・スピ系',
  '星座占い': '占い・スピ系',
  '気学・方位': '占い・スピ系',
  '命式解読': '占い・スピ系',
  'タロット': '占い・スピ系',
  'スピ全振り': '占い・スピ系',
  'オリジナル系': '占い・スピ系',
  
  // ライティング系
  '広告コピー系': 'ライティング系',
  'SNS文系': 'ライティング系',
  '広報文系': 'ライティング系',
  '簡単表現系': 'ライティング系',
  '広報・炎上防止系': 'ライティング系',
  'ネタ生成系': 'ライティング系',
  '文体制御系': 'ライティング系',
  '作家ごっこ系': 'ライティング系',
  'ビジネス資料系': 'ライティング系',
  'バズ狙い系': 'ライティング系',
  
  // 手続き・書類系
  '住所変更': '手続き・書類系',
  '保険系': '手続き・書類系',
  '公的番号系': '手続き・書類系',
  '補助金系': '手続き・書類系',
  '勤務系手続き': '手続き・書類系',
  '進捗管理': '手続き・書類系',
  '情報取得': '手続き・書類系',
  '初心者向け': '手続き・書類系',
  '行動支援': '手続き・書類系',
  'プロ風演出系': '手続き・書類系',
  
  // 偏見丸出し系（新カテゴリ）
  '怪しい系': '偏見丸出し系'
};

// 表示分類の判定関数
function determineDisplayCategory(bot) {
  const { name, character_desc, system_prompt } = bot;
  const text = `${name} ${character_desc} ${system_prompt}`.toLowerCase();
  
  // 偏見系のキーワード
  const biasKeywords = [
    '血液型', '星座', '干支', '前世', '波動', 'スピリチュアル',
    'おばちゃん', 'おじさん', 'おばさん', 'おじいちゃん',
    '地域', '出身', '関西', '関東', '方言',
    '偏見', '先入観', 'ステレオタイプ', '固定観念',
    '性格', 'タイプ', '属性', 'キャラ', '人種',
    '世代', '年齢', '性別', '職業', '学歴'
  ];
  
  // ユーモア系のキーワード
  const humorKeywords = [
    'おもしろ', '笑', 'ネタ', 'ギャグ', 'ジョーク',
    'ドヤ', 'できる風', '気取り', 'マニア', 'オタク',
    '変', '狂', 'バグ', '病', '中毒',
    '宗教', '教祖', '信者', '熱狂', 'ファン',
    '推し', '尊', '萌', '愛', '恋',
    '妄想', '空想', 'ファンタジー', '中二', '厨二',
    '語り', '語る', '延々', '長い', '詳しい',
    'マニアック', '専門的', '深い', '詳しい'
  ];
  
  // 真面目系のキーワード
  const seriousKeywords = [
    '法律', '条文', '判例', '契約', '書類',
    '手続き', '申請', '届出', '手順', 'ルール',
    '業務', '仕事', 'ビジネス', '企業', '会社',
    '教育', '学習', '勉強', '授業', '講義',
    '健康', '医療', '治療', '診断', '検査',
    '栄養', '食事', '運動', 'トレーニング',
    '管理', '計画', 'スケジュール', '進捗',
    '分析', '調査', '研究', 'データ', '統計'
  ];
  
  // 偏見判定
  const biasCount = biasKeywords.filter(keyword => text.includes(keyword)).length;
  if (biasCount >= 2) {
    return '偏見';
  }
  
  // ユーモア判定
  const humorCount = humorKeywords.filter(keyword => text.includes(keyword)).length;
  if (humorCount >= 3) {
    return 'ユーモア枠';
  }
  
  // 真面目判定
  const seriousCount = seriousKeywords.filter(keyword => text.includes(keyword)).length;
  if (seriousCount >= 2) {
    return '真面目';
  }
  
  // デフォルトは真面目
  return '真面目';
}

// タグ生成関数
function generateTags(bot, displayCategory) {
  const tags = [];
  
  // カテゴリタグ
  tags.push(bot.category);
  
  // 表示分類タグ
  tags.push(displayCategory);
  
  // ボット固有の特徴タグ
  const text = `${bot.name} ${bot.character_desc}`.toLowerCase();
  
  if (text.includes('法律') || text.includes('条文') || text.includes('契約')) {
    tags.push('法律');
  }
  if (text.includes('健康') || text.includes('運動') || text.includes('栄養')) {
    tags.push('健康');
  }
  if (text.includes('学習') || text.includes('教育') || text.includes('勉強')) {
    tags.push('教育');
  }
  if (text.includes('ビジネス') || text.includes('仕事') || text.includes('業務')) {
    tags.push('ビジネス');
  }
  if (text.includes('愚痴') || text.includes('共感') || text.includes('メンタル')) {
    tags.push('メンタル');
  }
  if (text.includes('占い') || text.includes('スピリチュアル') || text.includes('星座')) {
    tags.push('占い');
  }
  if (text.includes('ライティング') || text.includes('文章') || text.includes('コピー')) {
    tags.push('ライティング');
  }
  if (text.includes('手続き') || text.includes('書類') || text.includes('申請')) {
    tags.push('手続き');
  }
  if (text.includes('偏見') || text.includes('血液型') || text.includes('地域')) {
    tags.push('偏見');
  }
  
  return tags;
}

// CSVデータを読み込んで再分類
const csvData = fs.readFileSync('first_all.csv', 'utf8');
const lines = csvData.split('\n');
const headers = lines[0].split(',');
const bots = [];

for (let i = 1; i < lines.length; i++) {
  if (lines[i].trim()) {
    const values = lines[i].split(',');
    const bot = {};
    headers.forEach((header, index) => {
      bot[header.trim()] = values[index] ? values[index].replace(/"/g, '') : '';
    });
    bots.push(bot);
  }
}

console.log('ボット再分類開始...');

const reclassifiedBots = bots.map(bot => {
  const oldCategory = bot.category;
  const newCategory = categoryMapping[oldCategory] || 'その他';
  const displayCategory = determineDisplayCategory(bot);
  const tags = generateTags(bot, displayCategory);
  
  return {
    bot_id: bot.bot_id,
    name: bot.name,
    old_category: oldCategory,
    new_category: newCategory,
    display_category: displayCategory,
    tags: tags,
    description: bot.character_desc,
    system_prompt: bot.system_prompt
  };
});

// 結果を出力
console.log('\n=== 再分類結果 ===');
reclassifiedBots.forEach(bot => {
  console.log(`- bot_id: ${bot.bot_id}`);
  console.log(`- セクションタイトル: ${bot.new_category}`);
  console.log(`- 表示分類: ${bot.display_category}`);
  console.log(`- タグ: ${bot.tags.join(', ')}`);
  console.log('');
});

// カテゴリ別集計
const categoryCount = {};
const displayCount = {};
reclassifiedBots.forEach(bot => {
  categoryCount[bot.new_category] = (categoryCount[bot.new_category] || 0) + 1;
  displayCount[bot.display_category] = (displayCount[bot.display_category] || 0) + 1;
});

console.log('\n=== カテゴリ別集計 ===');
Object.entries(categoryCount).forEach(([category, count]) => {
  console.log(`${category}: ${count}件`);
});

console.log('\n=== 表示分類別集計 ===');
Object.entries(displayCount).forEach(([category, count]) => {
  console.log(`${category}: ${count}件`);
});

// 結果をファイルに保存
const outputData = {
  totalBots: reclassifiedBots.length,
  categories: categoryCount,
  displayCategories: displayCount,
  bots: reclassifiedBots
};

fs.writeFileSync('reclassified-bots.json', JSON.stringify(outputData, null, 2));
console.log('\n結果を reclassified-bots.json に保存しました。'); 
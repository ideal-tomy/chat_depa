// 改善されたCSVパーサーでボットデータを変換
const fs = require('fs');

// CSVパーサー関数（引用符対応）
function parseCSV(text) {
  const rows = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    
    const row = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    rows.push(row);
  }
  
  return rows;
}

// CSVファイルを読み込み
const csvContent = fs.readFileSync('first_all.csv', 'utf-8');
const rows = parseCSV(csvContent);

console.log('Headers:', rows[0]);

// データ行を処理
const bots = [];
for (let i = 1; i < rows.length; i++) {
  const values = rows[i];
  
  // カテゴリに基づくavatar_url設定
  const category = values[2] || '';
  let avatarUrl = '/images/icons/placeholder/default.png';
  
  if (category.includes('法') || category.includes('申請') || category.includes('契約') || category.includes('行政') || category.includes('司法') || category.includes('弁護士')) {
    avatarUrl = '/images/icons/placeholder/law.png';
  } else if (category.includes('健康') || category.includes('運動') || category.includes('食事') || category.includes('栄養') || category.includes('ダイエット') || category.includes('ストレッチ') || category.includes('カフェイン')) {
    avatarUrl = '/images/icons/placeholder/health.png';
  } else if (category.includes('生活') || category.includes('家事') || category.includes('育児') || category.includes('インテリア') || category.includes('ゴミ出し') || category.includes('家電') || category.includes('断捨離') || category.includes('ライフハック')) {
    avatarUrl = '/images/icons/placeholder/life.png';
  } else if (category.includes('学習') || category.includes('勉強') || category.includes('数学') || category.includes('英語') || category.includes('歴史') || category.includes('試験') || category.includes('テスト')) {
    avatarUrl = '/images/icons/placeholder/education.png';
  } else if (category.includes('ビジネス') || category.includes('資料') || category.includes('プレゼン') || category.includes('会議') || category.includes('スケジュール') || category.includes('KPI') || category.includes('経費') || category.includes('営業') || category.includes('退職') || category.includes('キャリア')) {
    avatarUrl = '/images/icons/placeholder/business.png';
  } else if (category.includes('メンタル') || category.includes('愚痴') || category.includes('ストレス') || category.includes('共感') || category.includes('ニート') || category.includes('無気力') || category.includes('HSP') || category.includes('スピリチュアル') || category.includes('ポジティブ') || category.includes('自己肯定') || category.includes('哲学')) {
    avatarUrl = '/images/icons/placeholder/mental.png';
  } else if (category.includes('エンタメ') || category.includes('推し') || category.includes('オタク') || category.includes('大喜利') || category.includes('料理') || category.includes('創作') || category.includes('RPG') || category.includes('恋愛') || category.includes('映画') || category.includes('鉄道') || category.includes('趣味') || category.includes('将棋') || category.includes('旅番組')) {
    avatarUrl = '/images/icons/placeholder/entertainment.png';
  } else if (category.includes('占い') || category.includes('スピリチュアル') || category.includes('波動') || category.includes('星座') || category.includes('タロット') || category.includes('前世') || category.includes('宇宙') || category.includes('開運') || category.includes('気学') || category.includes('四柱推命')) {
    avatarUrl = '/images/icons/placeholder/spiritual.png';
  } else if (category.includes('ライティング') || category.includes('文章') || category.includes('コピー') || category.includes('エモ') || category.includes('プレスリリース') || category.includes('SNS') || category.includes('ブログ') || category.includes('記事') || category.includes('ラノベ') || category.includes('要約')) {
    avatarUrl = '/images/icons/placeholder/writing.png';
  } else if (category.includes('手続き') || category.includes('書類') || category.includes('引越し') || category.includes('保険') || category.includes('マイナンバー') || category.includes('補助金') || category.includes('扶養') || category.includes('年末調整') || category.includes('市役所') || category.includes('窓口')) {
    avatarUrl = '/images/icons/placeholder/procedure.png';
  }
  
  // 文字列のクリーンアップ
  const cleanString = (str) => {
    if (!str) return '';
    return str.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
  };
  
  const bot = {
    id: cleanString(values[0]) || `bot_${i}`,
    name: cleanString(values[1]) || '',
    description: cleanString(values[4]) || '', // character_desc を description として使用
    category: cleanString(values[2]) || 'その他',
    avatar_url: avatarUrl,
    can_upload_image: false,
    can_send_file: Math.random() > 0.5, // ランダム
    system_prompt: cleanString(values[5]) || '',
    tags: cleanString(values[3]).split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    character_desc: cleanString(values[4]) || '',
    point: parseInt(cleanString(values[6])) || 15,
    model: cleanString(values[7]) || 'gpt-3.5-turbo',
    interaction_type: cleanString(values[8]) || 'popup',
    badge_text: cleanString(values[9]) || null,
    background_color: cleanString(values[10]) || null,
    display_order: parseInt(cleanString(values[11])) || 0,
    disabled: cleanString(values[12]).toUpperCase() === 'TRUE'
  };
  
  // NULL値の処理
  if (bot.badge_text === 'NULL' || bot.badge_text === '') bot.badge_text = null;
  if (bot.background_color === 'NULL' || bot.background_color === '') bot.background_color = null;
  
  bots.push(bot);
}

// 結果をファイルに出力
const output = `const csvBots = ${JSON.stringify(bots, null, 2)};

export default csvBots;

// Total bots: ${bots.length}`;

fs.writeFileSync('bots-data.js', output);
console.log(`Successfully converted ${bots.length} bots to bots-data.js`);

// サンプルデータを表示
console.log('\nFirst 3 bots:');
console.log(JSON.stringify(bots.slice(0, 3), null, 2));
// CSVデータをJavaScript配列形式に変換するスクリプト
const fs = require('fs');

// CSVファイルを読み込み
const csvContent = fs.readFileSync('first_all.csv', 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim() !== '');

// ヘッダー行を取得
const headers = lines[0].split(',');
console.log('Headers:', headers);

// データ行を処理
const bots = [];
for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(',');
  
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
  
  // background_colorの処理
  const bgColor = values[10] || null;
  const backgroundColor = (bgColor && bgColor !== 'NULL' && bgColor.trim() !== '') ? bgColor : null;
  
  const bot = {
    id: values[0] || `bot_${i}`,
    name: values[1] || '',
    description: values[4] || values[3] || '', // character_descまたはdescription
    category: values[2] || 'その他',
    avatar_url: avatarUrl,
    can_upload_image: false,
    can_send_file: Math.random() > 0.5, // ランダム（実際にはCSVの情報で決定）
    system_prompt: values[5] || '',
    tags: (values[3] || '').split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    character_desc: values[4] || '',
    point: parseInt(values[6]) || 15,
    model: values[7] || 'gpt-3.5-turbo',
    interaction_type: values[8] || 'popup',
    badge_text: (values[9] && values[9] !== 'NULL' && values[9].trim() !== '') ? values[9] : null,
    background_color: backgroundColor,
    display_order: parseInt(values[11]) || 0,
    disabled: values[12] === 'TRUE'
  };
  
  bots.push(bot);
}

// JavaScriptのオブジェクト配列として出力
console.log('const csvBots = [');
bots.forEach((bot, index) => {
  console.log('  {');
  console.log(`    id: '${bot.id}',`);
  console.log(`    name: '${bot.name.replace(/'/g, "\\'")}',`);
  console.log(`    description: '${bot.description.replace(/'/g, "\\'")}',`);
  console.log(`    category: '${bot.category}',`);
  console.log(`    avatar_url: '${bot.avatar_url}',`);
  console.log(`    can_upload_image: ${bot.can_upload_image},`);
  console.log(`    can_send_file: ${bot.can_send_file},`);
  console.log(`    system_prompt: '${bot.system_prompt.replace(/'/g, "\\'")}',`);
  console.log(`    tags: ${JSON.stringify(bot.tags)},`);
  console.log(`    character_desc: '${bot.character_desc.replace(/'/g, "\\'")}',`);
  console.log(`    point: ${bot.point},`);
  console.log(`    model: '${bot.model}',`);
  console.log(`    interaction_type: '${bot.interaction_type}',`);
  console.log(`    badge_text: ${bot.badge_text ? `'${bot.badge_text}'` : 'null'},`);
  console.log(`    background_color: ${bot.background_color ? `'${bot.background_color}'` : 'null'},`);
  console.log(`    display_order: ${bot.display_order},`);
  console.log(`    disabled: ${bot.disabled}`);
  console.log(`  }${index < bots.length - 1 ? ',' : ''}`);
});
console.log('];');

console.log(`\n// Total bots: ${bots.length}`);
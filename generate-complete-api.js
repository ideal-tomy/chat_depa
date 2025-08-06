// 完全なAPIエンドポイントを生成するスクリプト
const fs = require('fs');

// bots-data.jsから全データを読み込み
const dataContent = fs.readFileSync('bots-data.js', 'utf-8');
const match = dataContent.match(/const csvBots = (\[[\s\S]*?\]);/);

if (!match) {
  console.error('Could not parse bots data');
  process.exit(1);
}

const bots = JSON.parse(match[1]);

// Supabase用に必須フィールドのみに整形
const formattedBots = bots.map(bot => ({
  id: bot.id,
  name: bot.name,
  description: bot.description,
  category: bot.category,
  avatar_url: bot.avatar_url,
  can_upload_image: bot.can_upload_image,
  can_send_file: bot.can_send_file
}));

// 完全なAPIエンドポイントファイルを生成
const apiContent = `import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST() {
  try {
    console.log('Registering all bots from CSV data...');
    
    // CSVから変換したボットデータ（全${bots.length}件）
    const csvBots = ${JSON.stringify(formattedBots, null, 6)};

    console.log(\`Processing \${csvBots.length} bots...\`);

    // 既存データの確認（重複チェック）
    const { data: existingBots, error: selectError } = await supabaseServer
      .from('bots')
      .select('id')
      .in('id', csvBots.map(bot => bot.id));

    if (selectError) {
      console.error('Error checking existing bots:', selectError);
      return NextResponse.json({ 
        error: 'Failed to check existing data', 
        details: selectError 
      }, { status: 500 });
    }

    const existingIds = existingBots?.map(bot => bot.id) || [];
    const newBots = csvBots.filter(bot => !existingIds.includes(bot.id));

    console.log(\`Found \${existingIds.length} existing bots, adding \${newBots.length} new bots\`);

    if (newBots.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All bots already exist',
        skippedCount: csvBots.length,
        existingBots: existingIds
      });
    }

    // 新しいボットデータを挿入
    const { data, error } = await supabaseServer
      .from('bots')
      .insert(newBots)
      .select();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ 
        error: 'Failed to insert bot data', 
        details: error 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'CSV bot data registered successfully',
      insertedCount: data.length,
      skippedCount: existingIds.length,
      totalProcessed: csvBots.length,
      insertedBots: data.map(bot => ({ id: bot.id, name: bot.name })),
      existingBots: existingIds
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: 'API error', 
      details: error 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'CSV Bot Registration API',
    description: 'Use POST method to register all bots from CSV data',
    totalBots: ${bots.length},
    endpoint: '/api/register-csv-bots'
  });
}`;

// ファイルに書き出し
fs.writeFileSync('src/app/api/register-csv-bots/route.ts', apiContent);
console.log(`Generated complete API endpoint with ${bots.length} bots`);

// 統計情報も出力
const categoryStats = {};
bots.forEach(bot => {
  categoryStats[bot.category] = (categoryStats[bot.category] || 0) + 1;
});

console.log('\nCategory Statistics:');
Object.entries(categoryStats).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} bots`);
});
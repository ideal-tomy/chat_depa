// APIエンドポイントからidフィールドを除去してUUID問題を修正
const fs = require('fs');

// bots-data.jsから全データを読み込み
const dataContent = fs.readFileSync('bots-data.js', 'utf-8');
const match = dataContent.match(/const csvBots = (\[[\s\S]*?\]);/);

if (!match) {
  console.error('Could not parse bots data');
  process.exit(1);
}

const bots = JSON.parse(match[1]);

// idフィールドを除去してSupabaseの自動UUID生成に任せる
const formattedBots = bots.map(bot => {
  const { id, ...botWithoutId } = bot; // idを除去
  return botWithoutId;
});

// 重複チェックを名前ベースに変更する
const apiContent = `import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST() {
  try {
    console.log('Registering all bots from CSV data...');
    
    // CSVから変換したボットデータ（全${bots.length}件）- idを除去してSupabase自動生成
    const csvBots = ${JSON.stringify(formattedBots, null, 6)};

    console.log(\`Processing \${csvBots.length} bots...\`);

    // 既存データの確認（名前ベースの重複チェック）
    const botNames = csvBots.map(bot => bot.name);
    const { data: existingBots, error: selectError } = await supabaseServer
      .from('bots')
      .select('id, name')
      .in('name', botNames);

    if (selectError) {
      console.error('Error checking existing bots:', selectError);
      return NextResponse.json({ 
        error: 'Failed to check existing data', 
        details: selectError 
      }, { status: 500 });
    }

    const existingNames = existingBots?.map(bot => bot.name) || [];
    const newBots = csvBots.filter(bot => !existingNames.includes(bot.name));

    console.log(\`Found \${existingNames.length} existing bots, adding \${newBots.length} new bots\`);

    if (newBots.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All bots already exist',
        skippedCount: csvBots.length,
        existingBots: existingNames
      });
    }

    // 新しいボットデータを挿入（idはSupabaseが自動生成）
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
      skippedCount: existingNames.length,
      totalProcessed: csvBots.length,
      insertedBots: data.map(bot => ({ id: bot.id, name: bot.name })),
      existingBots: existingNames
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
console.log(`Fixed API endpoint - removed ID fields for ${bots.length} bots`);

// サンプル確認
console.log('\nFirst bot without ID:');
console.log(JSON.stringify(formattedBots[0], null, 2));
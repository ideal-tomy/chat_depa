const fs = require('fs');

console.log('全117件のボットデータ用API生成開始...');

// 変換済みデータを読み込み
const csvBots = require('./bots-data-schema-fixed.js');

console.log(`読み込み完了: ${csvBots.length}件のボットデータ`);

// 完全なAPIルートファイルの内容を生成
const apiContent = `import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST() {
  try {
    console.log('Registering all ${csvBots.length} bots from CSV data...');
    
    // CSVから変換したボットデータ（全${csvBots.length}件）- Supabaseスキーマ対応版
    const csvBots = ${JSON.stringify(csvBots, null, 6)};

    console.log(\`Processing \${csvBots.length} bots...\`);

    // 小さなバッチに分割して処理（Supabaseの制限を考慮）
    const BATCH_SIZE = 20;
    const batches = [];
    
    for (let i = 0; i < csvBots.length; i += BATCH_SIZE) {
      batches.push(csvBots.slice(i, i + BATCH_SIZE));
    }

    console.log(\`Processing in \${batches.length} batches of max \${BATCH_SIZE} items each\`);

    let totalInserted = 0;
    let totalSkipped = 0;
    const insertedBots = [];
    const existingBots = [];

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(\`Processing batch \${batchIndex + 1}/\${batches.length} (\${batch.length} items)\`);

      // バッチ内の重複チェック
      const batchNewBots = [];
      
      for (const bot of batch) {
        const { data: existing } = await supabaseServer
          .from('bots')
          .select('id, name')
          .eq('name', bot.name)
          .single();
        
        if (existing) {
          existingBots.push(existing.name);
          totalSkipped++;
        } else {
          batchNewBots.push(bot);
        }
      }

      if (batchNewBots.length > 0) {
        console.log(\`Inserting \${batchNewBots.length} new bots in batch \${batchIndex + 1}\`);
        
        // バッチ挿入実行
        const { data, error } = await supabaseServer
          .from('bots')
          .insert(batchNewBots)
          .select();

        if (error) {
          console.error(\`Batch \${batchIndex + 1} insert error:\`, error);
          return NextResponse.json({
            error: \`Failed to insert batch \${batchIndex + 1}\`,
            details: error,
            progress: {
              completedBatches: batchIndex,
              totalBatches: batches.length,
              insertedSoFar: totalInserted,
              skippedSoFar: totalSkipped
            }
          }, { status: 500 });
        }

        totalInserted += data.length;
        insertedBots.push(...data.map(bot => ({ id: bot.id, name: bot.name })));
        console.log(\`Batch \${batchIndex + 1} completed: \${data.length} bots inserted\`);
      } else {
        console.log(\`Batch \${batchIndex + 1}: All bots already exist, skipping\`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'All CSV bot data processed successfully',
      insertedCount: totalInserted,
      skippedCount: totalSkipped,
      totalProcessed: csvBots.length,
      batchesProcessed: batches.length,
      insertedBots: insertedBots,
      existingBots: existingBots
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
    message: 'CSV Bot Registration API (Schema Fixed)',
    description: 'Use POST method to register all ${csvBots.length} bots from CSV data',
    totalBots: ${csvBots.length},
    endpoint: '/api/register-all-csv-bots',
    features: [
      'Batch processing (20 bots per batch)',
      'Duplicate checking by name',
      'Supabase schema compliance',
      'Error recovery with progress tracking'
    ]
  });
}`;

// APIファイルを生成
fs.writeFileSync('src/app/api/register-all-csv-bots/route.ts', apiContent);

console.log('APIファイル生成完了: src/app/api/register-all-csv-bots/route.ts');
console.log(`- 総ボット数: ${csvBots.length}件`);
console.log('- バッチ処理対応（20件ずつ）');
console.log('- 重複チェック機能付き');
console.log('- エラー復旧機能付き');
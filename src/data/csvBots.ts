// CSVから変換されたボットデータ（全117件）
import fs from 'fs';
import path from 'path';
import { logger } from '@/lib/logger';

export function getCsvBots() {
  try {
    // プロジェクトルートのbots-data.jsファイルを読み込み
    const dataPath = path.join(process.cwd(), 'bots-data.js');
    const dataContent = fs.readFileSync(dataPath, 'utf-8');
    
    // データを抽出
    const match = dataContent.match(/const csvBots = (\[[\s\S]*?\]);/);
    if (!match) {
      throw new Error('Could not parse bots data');
    }
    
    return JSON.parse(match[1] || '[]');
  } catch (error) {
    logger.error('Error loading CSV bots data', new Error(String(error)));
    throw error;
  }
}

// Supabase用にデータを整形
export function formatBotsForSupabase(bots: any[]) {
  return bots.map(bot => ({
    id: bot.id,
    name: bot.name,
    description: bot.description,
    category: bot.category,
    avatar_url: bot.avatar_url,
    can_upload_image: bot.can_upload_image,
    can_send_file: bot.can_send_file,
    // 追加フィールドは必要に応じてカスタムテーブルで管理
    created_at: new Date().toISOString(),
  }));
}

// カテゴリ別の統計情報を取得
export function getCategoryStats(bots: any[]) {
  const stats: Record<string, number> = {};
  bots.forEach(bot => {
    stats[bot.category] = (stats[bot.category] || 0) + 1;
  });
  return stats;
}

// 人気ボット自動表示システム
export interface BotUsageStats {
  botId: string;
  usageCount: number;
  averageRating: number;
  recentUsage: number;
  completionRate: number;
  lastUsed: Date;
}

export interface PopularityScore {
  botId: string;
  score: number;
  factors: {
    usageWeight: number;
    ratingWeight: number;
    recentWeight: number;
    completionWeight: number;
  };
}

// 人気度計算アルゴリズム
export function calculatePopularityScore(stats: BotUsageStats): PopularityScore {
  const usageWeight = 0.4;    // 利用回数
  const ratingWeight = 0.3;   // 評価
  const recentWeight = 0.2;   // 最近の利用
  const completionWeight = 0.1; // 完了率
  
  // 正規化されたスコア計算
  const normalizedUsage = Math.min(stats.usageCount / 100, 1); // 100回で最大
  const normalizedRating = stats.averageRating / 5; // 5点満点で正規化
  const normalizedRecent = Math.min(stats.recentUsage / 50, 1); // 50回で最大
  const normalizedCompletion = stats.completionRate; // 0-1の範囲
  
  const totalScore = 
    normalizedUsage * usageWeight +
    normalizedRating * ratingWeight +
    normalizedRecent * recentWeight +
    normalizedCompletion * completionWeight;
  
  return {
    botId: stats.botId,
    score: totalScore,
    factors: {
      usageWeight: normalizedUsage * usageWeight,
      ratingWeight: normalizedRating * ratingWeight,
      recentWeight: normalizedRecent * recentWeight,
      completionWeight: normalizedCompletion * completionWeight
    }
  };
}

// ボットリストを人気度順にソート
export function sortBotsByPopularity(bots: any[], usageStats: BotUsageStats[]): any[] {
  const botStatsMap = new Map(usageStats.map(stat => [stat.botId, stat]));
  
  return bots
    .map(bot => {
      const stats = botStatsMap.get(bot.id) || {
        botId: bot.id,
        usageCount: 0,
        averageRating: 0,
        recentUsage: 0,
        completionRate: 0,
        lastUsed: new Date(0)
      };
      
      const popularityScore = calculatePopularityScore(stats);
      return {
        ...bot,
        popularityScore: popularityScore.score,
        usageStats: stats
      };
    })
    .sort((a, b) => b.popularityScore - a.popularityScore);
}

// 人気ボットの判定（上位20%）
export function isPopularBot(bot: any, totalBots: number): boolean {
  const topPercentage = 0.2; // 上位20%
  const topCount = Math.ceil(totalBots * topPercentage);
  
  // 人気度スコアが上位に入っているかチェック
  return bot.popularityScore && bot.popularityScore > 0.7; // スコア0.7以上を人気ボットとする
}

// 人気ボットの視覚的強調用スタイル
export function getPopularBotStyles(isPopular: boolean) {
  if (!isPopular) return {};
  
  return {
    border: '2px solid #ffd700',
    background: 'linear-gradient(135deg, #fff9e6, #fff)',
    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
    position: 'relative' as const
  };
}

// 人気バッジコンポーネント用データ
export function getPopularBadgeData(bot: any) {
  const isPopular = bot.popularityScore && bot.popularityScore > 0.7;
  
  if (!isPopular) return null;
  
  return {
    text: '🔥 人気',
    style: {
      position: 'absolute',
      top: '-12px',
      right: '-12px',
      background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
      color: '#000',
      padding: '6px 12px',
      borderRadius: '16px',
      fontWeight: 'bold',
      fontSize: '0.875rem',
      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
      animation: 'popularPulse 2s infinite'
    }
  };
}

// 占いカテゴリの詳細分類システム
export interface FortuneSubCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// 占いサブカテゴリ定義
export const fortuneSubCategories: FortuneSubCategory[] = [
  {
    id: 'fun',
    name: '面白い系',
    description: '楽しく遊べる占い',
    icon: '🎭',
    color: 'from-pink-400 to-purple-500'
  },
  {
    id: 'serious',
    name: 'ガチ系',
    description: '本格的な占い',
    icon: '🔮',
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'casual',
    name: '気軽系',
    description: '簡単な運勢占い',
    icon: '✨',
    color: 'from-yellow-400 to-orange-500'
  }
];

// ボット名からサブカテゴリを判定する関数
export function getFortuneSubCategory(botName: string): FortuneSubCategory {
  const funKeywords = ['おじさん', 'ガチ勢', 'ハラスメント', '偏見', '丸出し'];
  const seriousKeywords = ['本格', '専門家', 'タロット', '占い師', '九星気学'];
  const casualKeywords = ['今日', '運勢', 'ラッキー', '簡単', '気軽'];

  const name = botName.toLowerCase();
  
  // 面白い系の判定
  if (funKeywords.some(keyword => name.includes(keyword))) {
    return fortuneSubCategories[0]; // 面白い系
  }
  
  // ガチ系の判定
  if (seriousKeywords.some(keyword => name.includes(keyword))) {
    return fortuneSubCategories[1]; // ガチ系
  }
  
  // 気軽系の判定
  if (casualKeywords.some(keyword => name.includes(keyword))) {
    return fortuneSubCategories[2]; // 気軽系
  }
  
  // デフォルトは気軽系
  return fortuneSubCategories[2];
}

// 占いボットをサブカテゴリ別に分類する関数
export function categorizeFortuneBots(bots: any[]): Record<string, any[]> {
  const categorized: Record<string, any[]> = {
    fun: [],
    serious: [],
    casual: []
  };
  
  bots.forEach(bot => {
    const subCategory = getFortuneSubCategory(bot.name);
    categorized[subCategory.id].push(bot);
  });
  
  return categorized;
}

// サブカテゴリの表示名を取得
export function getSubCategoryDisplayName(subCategoryId: string): string {
  const subCategory = fortuneSubCategories.find(cat => cat.id === subCategoryId);
  return subCategory ? subCategory.name : 'その他';
}

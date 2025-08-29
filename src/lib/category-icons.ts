// カテゴリ別アイコン自動割り当てシステム
export interface CategoryIconMapping {
  [category: string]: string;
}

// カテゴリ別アイコンファイル名マッピング（既存のsumpleファイルを使用）
export const categoryIconMapping: CategoryIconMapping = {
  // 学習・教育系
  '学習・教育': 'sumple01',
  '数学特化': 'sumple01',
  '学習': 'sumple01',
  
  // 健康・運動系
  '健康・運動系': 'sumple02',
  '栄養管理': 'sumple02',
  '食事指導': 'sumple02',
  '栄養素解説': 'sumple02',
  '栄養偏重系': 'sumple02',
  
  // コミュニケーション系
  'コミュニケーション': 'sumple03',
  '言語化トレーニング系': 'sumple03',
  
  // ビジネス系
  'プレゼン改善系': 'sumple04',
  '契約系': 'sumple04',
  '法解釈系': 'sumple04',
  '行政書士系': 'sumple04',
  '申請系': 'sumple04',
  
  // その他
  '占い': 'sumple01',
  'テスト': 'sumple02',
  '偏見丸出し': 'sumple03',
  
  // デフォルト
  'default': 'sumple01'
};

// カテゴリ名からアイコンを取得する関数
export function getCategoryIcon(category: string): string {
  // 完全一致を優先
  if (categoryIconMapping[category]) {
    return categoryIconMapping[category];
  }
  
  // 部分一致で検索
  const matchedCategory = Object.keys(categoryIconMapping).find(key => 
    category.includes(key) || key.includes(category)
  );
  
  if (matchedCategory) {
    return categoryIconMapping[matchedCategory];
  }
  
  // デフォルトアイコンを返す
  return categoryIconMapping['default'];
}

// カテゴリの表示名からアイコンを取得する関数（トップページ用）
export function getDisplayCategoryIcon(displayCategory: string): string {
  const displayToIconMapping: CategoryIconMapping = {
    '占い': 'sumple01',
    '学習・教育': 'sumple01',
    'コミュニケーション': 'sumple03',
    '健康・栄養': 'sumple02',
    '手続き・申請': 'sumple04',
    'ビジネス・契約': 'sumple04',
    '法律・法務': 'sumple04',
    '偏見丸出し': 'sumple03'
  };
  
  return displayToIconMapping[displayCategory] || 'sumple01';
}

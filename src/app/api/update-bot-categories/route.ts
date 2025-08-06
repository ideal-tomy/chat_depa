import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

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
  
  // 偏見丸出し系
  '怪しい系': '偏見丸出し系'
};

// 表示分類の判定関数
function determineDisplayCategory(bot: any) {
  const { name, description, instructions } = bot;
  const text = `${name} ${description} ${instructions}`.toLowerCase();
  
  // 偏見系のキーワード
  const biasKeywords = [
    '血液型', '星座', '干支', '前世', '波動', 'スピリチュアル',
    'おばちゃん', 'おじさん', 'おばさん', 'おじいちゃん', 'おばあちゃん',
    '地域', '出身', '関西', '関東', '方言', '大阪', '東京',
    '偏見', '先入観', 'ステレオタイプ', '固定観念', '思い込み',
    '性格', 'タイプ', '属性', 'キャラ', '人種', '民族',
    '世代', '年齢', '性別', '職業', '学歴', '出身校',
    '星座', '牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座',
    '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座',
    '血液型', 'A型', 'B型', 'O型', 'AB型',
    '前世', '過去世', '輪廻', 'カルマ'
  ];
  
  // ユーモア系のキーワード
  const humorKeywords = [
    'おもしろ', '笑', 'ネタ', 'ギャグ', 'ジョーク', '面白',
    'ドヤ', 'できる風', '気取り', 'マニア', 'オタク', 'ヲタ',
    '変', '狂', 'バグ', '病', '中毒', 'ハマる', 'ハマり',
    '宗教', '教祖', '信者', '熱狂', 'ファン', '推し',
    '尊', '萌', '愛', '恋', '恋愛', 'ロマンス',
    '妄想', '空想', 'ファンタジー', '中二', '厨二', '中二病',
    '語り', '語る', '延々', '長い', '詳しい', 'マニアック',
    '専門的', '深い', '詳しい', 'マニア', 'オタク',
    '推し', '推し活', '推し事', '推しメン',
    '尊い', '尊すぎ', '神', '天使', '完璧',
    '萌える', '萌え', 'かわいい', '可愛い',
    '愛してる', '愛', '恋', '恋愛', 'ロマンス',
    '妄想', '空想', 'ファンタジー', '夢', '理想',
    '中二', '厨二', '中二病', '厨二病',
    '語り', '語る', '延々', '長い', '詳しい',
    'マニアック', '専門的', '深い', '詳しい',
    '変', '狂', 'バグ', '病', '中毒', 'ハマる',
    '宗教', '教祖', '信者', '熱狂', 'ファン',
    'おもしろ', '笑', 'ネタ', 'ギャグ', 'ジョーク',
    'ドヤ', 'できる風', '気取り', 'マニア', 'オタク'
  ];
  
  // 真面目系のキーワード
  const seriousKeywords = [
    '法律', '条文', '判例', '契約', '書類', '法務',
    '手続き', '申請', '届出', '手順', 'ルール', '規則',
    '業務', '仕事', 'ビジネス', '企業', '会社', '職場',
    '教育', '学習', '勉強', '授業', '講義', '研修',
    '健康', '医療', '治療', '診断', '検査', '病院',
    '栄養', '食事', '運動', 'トレーニング', 'フィットネス',
    '管理', '計画', 'スケジュール', '進捗', 'プロジェクト',
    '分析', '調査', '研究', 'データ', '統計', 'レポート'
  ];
  
  // 偏見判定
  const biasCount = biasKeywords.filter(keyword => text.includes(keyword)).length;
  if (biasCount >= 1) {
    return '偏見';
  }
  
  // ユーモア判定
  const humorCount = humorKeywords.filter(keyword => text.includes(keyword)).length;
  if (humorCount >= 2) {
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

export async function POST() {
  try {
    console.log('ボットカテゴリ更新開始...');
    
    // 既存のボットデータを取得
    const { data: existingBots, error: fetchError } = await supabaseServer
      .from('bots')
      .select('*');
    
    if (fetchError) {
      console.error('ボットデータ取得エラー:', fetchError);
      return NextResponse.json({
        error: 'Failed to fetch bot data',
        details: fetchError
      }, { status: 500 });
    }
    
    console.log(`取得したボット数: ${existingBots?.length || 0}件`);
    
    let updatedCount = 0;
    let errorCount = 0;
    const updateResults = [];
    
    // 各ボットを更新
    for (const bot of existingBots || []) {
      try {
        const oldCategory = bot.category;
        const newCategory = categoryMapping[oldCategory] || oldCategory;
        const displayCategory = determineDisplayCategory(bot);
        
        // カテゴリと表示分類を更新
        const { error: updateError } = await supabaseServer
          .from('bots')
          .update({
            category: newCategory,
            display_category: displayCategory
          })
          .eq('id', bot.id);
        
        if (updateError) {
          console.error(`ボット更新エラー (${bot.name}):`, updateError);
          errorCount++;
        } else {
          updatedCount++;
          updateResults.push({
            id: bot.id,
            name: bot.name,
            old_category: oldCategory,
            new_category: newCategory,
            display_category: displayCategory
          });
        }
      } catch (error) {
        console.error(`ボット処理エラー (${bot.name}):`, error);
        errorCount++;
      }
    }
    
    // カテゴリ別集計
    const categoryCount: { [key: string]: number } = {};
    const displayCount: { [key: string]: number } = {};
    
    updateResults.forEach(result => {
      categoryCount[result.new_category] = (categoryCount[result.new_category] || 0) + 1;
      displayCount[result.display_category] = (displayCount[result.display_category] || 0) + 1;
    });
    
    return NextResponse.json({
      success: true,
      message: 'Bot categories updated successfully',
      updatedCount,
      errorCount,
      totalProcessed: existingBots?.length || 0,
      categoryBreakdown: categoryCount,
      displayCategoryBreakdown: displayCount,
      results: updateResults
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
    message: 'Bot Category Update API',
    description: 'Use POST method to update bot categories and display classifications',
    endpoint: '/api/update-bot-categories',
    features: [
      'Updates bot categories to new 11-category system',
      'Adds display_category field (真面目/ユーモア枠/偏見)',
      'Batch processing for all existing bots',
      'Category and display classification breakdown'
    ]
  });
} 
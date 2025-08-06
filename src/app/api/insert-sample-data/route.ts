import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST() {
  try {
    console.log('Inserting sample bot data from CSV...');
    
    // CSVファイルのデータを基にしたサンプルボットデータ
    const sampleBots = [
      {
        name: '補助金書類を提出直前まで作ってくれる君',
        description: '◯年度版の様式2、最新版でいい？」と毎回確認してくる慎重派。実際に叩き台まで作ってくれる。',
        category: 'ビジネス',
        avatar_url: '/images/icons/placeholder/business.png',
        can_upload_image: false,
        can_send_file: true
      },
      {
        name: '六法全書的にマニア君',
        description: 'すぐに「民法709条によると〜」って言いたくなる条文オタク。趣味は逐条解説読み。',
        category: 'ビジネス',
        avatar_url: '/images/icons/placeholder/business.png',
        can_upload_image: false,
        can_send_file: false
      },
      {
        name: '契約書を出す側視点でチェックするできる風おじさん',
        description: '「ここの解除条項、出す側に不利やで」とドヤる。微妙に知識足りてない時もある。',
        category: 'ビジネス',
        avatar_url: '/images/icons/placeholder/business.png',
        can_upload_image: false,
        can_send_file: true
      },
      {
        name: '契約書を受け取る側で読むガチ勢',
        description: '「これ、相手が損害賠償責任逃げようとしてる可能性あるね」など、不安をあおりつつ守ってくれる。',
        category: 'ビジネス',
        avatar_url: '/images/icons/placeholder/business.png',
        can_upload_image: false,
        can_send_file: true
      },
      {
        name: 'SNS投稿アイデアBot',
        description: 'バズる投稿のアイデアを無限に生成。ハッシュタグやトレンドを分析して効果的な投稿をサポート。',
        category: 'マーケティング',
        avatar_url: '/images/sample/sumple02.png',
        can_upload_image: true,
        can_send_file: false
      },
      {
        name: 'プログラミング学習Bot',
        description: 'コードレビューから学習プランまで、プログラミング学習を総合サポート。初心者から上級者まで対応。',
        category: 'プログラミング',
        avatar_url: '/images/sample/sumple03.png',
        can_upload_image: false,
        can_send_file: true
      },
      {
        name: '料理レシピ提案Bot',
        description: '冷蔵庫の中身や好みに合わせて、オリジナルレシピを提案。栄養バランスも考慮した健康的な料理。',
        category: 'ライフスタイル',
        avatar_url: '/images/sample/sumple04.png',
        can_upload_image: true,
        can_send_file: false
      },
      {
        name: 'デザイン添削Bot',
        description: 'ロゴやWebデザインの添削とアドバイス。デザインの改善点を具体的に指摘します。',
        category: 'デザイン',
        avatar_url: '/images/sample/sumple01.png',
        can_upload_image: true,
        can_send_file: true
      },
      {
        name: '旅行プランニングBot',
        description: '予算と好みに合わせた最適な旅行プランを提案。現地の穴場スポットまで詳しく案内。',
        category: '旅行',
        avatar_url: '/images/sample/sumple02.png',
        can_upload_image: false,
        can_send_file: false
      },
      {
        name: 'フィットネス指導Bot',
        description: '個人の体力レベルに合わせたトレーニングメニューを作成。食事管理もサポート。',
        category: 'フィットネス',
        avatar_url: '/images/sample/sumple03.png',
        can_upload_image: true,
        can_send_file: false
      },
      {
        name: '学習計画Bot',
        description: '目標に向けた効率的な学習計画を立案。進捗管理と定期的な見直しも行います。',
        category: '学習',
        avatar_url: '/images/sample/sumple04.png',
        can_upload_image: false,
        can_send_file: true
      },
      {
        name: 'SEO記事作成Bot',
        description: 'SEOに強い記事を作成。キーワード分析から構成案、執筆まで一貫してサポートします。',
        category: 'マーケティング',
        avatar_url: '/images/sample/sumple01.png',
        can_upload_image: false,
        can_send_file: false
      }
    ];

    // 既存データの削除（テスト用）
    const { error: deleteError } = await supabase
      .from('bots')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.log('Delete warning (may be normal if table is empty):', deleteError);
    }

    // サンプルデータを挿入
    const { data, error } = await supabase
      .from('bots')
      .insert(sampleBots)
      .select();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ 
        error: 'Failed to insert sample data', 
        details: error 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Sample data inserted successfully',
      insertedCount: data.length,
      data: data
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: 'API error', 
      details: error 
    }, { status: 500 });
  }
} 
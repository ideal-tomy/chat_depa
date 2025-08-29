export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export async function POST() {
  try {
    logger.info('Setting up sample bot data...');
    
    // サンプルボットデータ
    const sampleBots = [
      {
        name: 'ビジネスメール作成Bot',
        description: '丁寧で的確なビジネスメールを瞬時に作成します。件名から本文まで、シーンに合わせた適切な文章をご提案。',
        category: 'ビジネス',
        avatar_url: '/images/sample/sumple01.png',
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
        name: 'SEO記事作成Bot',
        description: 'SEOに強い記事を作成。キーワード分析から構成案、執筆まで一貫してサポートします。',
        category: 'マーケティング',
        avatar_url: '/images/sample/sumple01.png',
        can_upload_image: false,
        can_send_file: false
      },
      {
        name: 'デザイン添削Bot',
        description: 'ロゴやWebデザインの添削とアドバイス。デザインの改善点を具体的に指摘します。',
        category: 'デザイン',
        avatar_url: '/images/sample/sumple02.png',
        can_upload_image: true,
        can_send_file: true
      }
    ];

    // 既存データをクリア（オプション）
    const { error: deleteError } = await supabaseServer
      .from('bots')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // 存在しないIDで全削除

    if (deleteError) {
      logger.warn('Delete warning (may be normal)', { error: deleteError });
    }

    // サンプルデータを挿入
    const { data, error } = await supabaseServer
      .from('bots')
      .insert(sampleBots)
      .select();

    if (error) {
      logger.error('Insert error', new Error(String(error)));
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
    logger.error('API error', new Error(String(error)));
    return NextResponse.json({ 
      error: 'API error', 
      details: error 
    }, { status: 500 });
  }
} 


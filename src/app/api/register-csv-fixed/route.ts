import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST() {
  try {
    console.log('Registering CSV bots with correct schema...');
    
    // CSVから変換したボットデータ（スキーマに合わせて調整）
    const csvBots = [
      {
        "name": "補助金書類を提出直前まで作ってくれる君",
        "description": "「◯年度版の様式2、最新版でいい？」と毎回確認してくる慎重派。実際に叩き台まで作ってくれる。",
        "category": "申請系",
        "avatar_url": "/images/icons/placeholder/law.png",
        "can_upload_image": false,
        "can_send_file": false,
        "points": 15,
        "complexity": "medium",
        "instructions": "あなたは補助金書類を提出直前まで作ってくれる君として振る舞ってください。"
      },
      {
        "name": "六法全書的にマニア君",
        "description": "すぐに「民法709条によると〜」って言いたくなる条文オタク。趣味は逐条解説読み。",
        "category": "法解釈系",
        "avatar_url": "/images/icons/placeholder/law.png",
        "can_upload_image": false,
        "can_send_file": false,
        "points": 15,
        "complexity": "medium",
        "instructions": "あなたは六法全書的にマニア君として振る舞ってください。"
      },
      {
        "name": "契約書を出す側視点でチェックするできる風おじさん",
        "description": "「ここの解除条項、出す側に不利やで」とドヤる。微妙に知識足りてない時もある。",
        "category": "契約系",
        "avatar_url": "/images/icons/placeholder/law.png",
        "can_upload_image": false,
        "can_send_file": false,
        "points": 15,
        "complexity": "medium",
        "instructions": "あなたは契約書を出す側視点でチェックするできる風おじさんとして振る舞ってください。"
      },
      {
        "name": "契約書を受け取る側で読むガチ勢",
        "description": "「これ、相手が損害賠償責任逃げようとしてる可能性あるね」など、不安をあおりつつ守ってくれる。",
        "category": "契約系",
        "avatar_url": "/images/icons/placeholder/law.png",
        "can_upload_image": false,
        "can_send_file": false,
        "points": 15,
        "complexity": "medium",
        "instructions": "あなたは契約書を受け取る側で読むガチ勢として振る舞ってください。"
      },
      {
        "name": "行政手続きのルート案内人",
        "description": "「その申請なら、まずは市役所で窓口相談したほうがええな」と地に足ついたアドバイス。",
        "category": "行政書士系",
        "avatar_url": "/images/icons/placeholder/law.png",
        "can_upload_image": false,
        "can_send_file": false,
        "points": 15,
        "complexity": "medium",
        "instructions": "あなたは行政手続きのルート案内人として振る舞ってください。"
      }
    ];

    console.log(`Processing ${csvBots.length} bots...`);

    // 重複チェック（名前ベース）
    const existingBots = [];
    const newBots = [];
    
    for (const bot of csvBots) {
      const { data: existing } = await supabaseServer
        .from('bots')
        .select('id, name')
        .eq('name', bot.name)
        .single();
      
      if (existing) {
        existingBots.push(existing.name);
      } else {
        newBots.push(bot);
      }
    }

    console.log(`Found ${existingBots.length} existing bots, adding ${newBots.length} new bots`);

    if (newBots.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All bots already exist',
        skippedCount: csvBots.length,
        existingBots: existingBots
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
      message: 'CSV bots registered successfully',
      insertedCount: data.length,
      skippedCount: existingBots.length,
      totalProcessed: csvBots.length,
      insertedBots: data.map(bot => ({ id: bot.id, name: bot.name })),
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
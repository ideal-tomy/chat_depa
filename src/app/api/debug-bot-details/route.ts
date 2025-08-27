import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // ボットの詳細情報を取得
    const { data: bots, error } = await supabaseServer
      .from('bots')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching bot details:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch bot details' 
      }, { status: 500 });
    }

    // 各ボットの詳細情報を整形
    const botDetails = bots?.map(bot => ({
      id: bot.id,
      name: bot.name,
      description: bot.description,
      category: bot.category,
      points: bot.points,
      prompt: bot.prompt,
      system_prompt: bot.system_prompt,
      is_pickup: bot.is_pickup,
      is_trending: bot.is_trending,
      is_new: bot.is_new,
      featured_priority: bot.featured_priority,
      created_at: bot.created_at,
      updated_at: bot.updated_at,
      // その他のフィールド
      author: bot.author,
      author_icon: bot.author_icon,
      image_url: bot.image_url,
      can_upload_image: bot.can_upload_image,
      can_send_file: bot.can_send_file,
      manual_sort_order: bot.manual_sort_order
    })) || [];

    return NextResponse.json({
      success: true,
      bots: botDetails,
      total: botDetails.length,
      summary: {
        withPrompt: botDetails.filter(b => b.prompt).length,
        withSystemPrompt: botDetails.filter(b => b.system_prompt).length,
        pickupBots: botDetails.filter(b => b.is_pickup).length,
        trendingBots: botDetails.filter(b => b.is_trending).length,
        newBots: botDetails.filter(b => b.is_new).length,
        categories: [...new Set(botDetails.map(b => b.category))],
        pointRanges: {
          free: botDetails.filter(b => b.points === 0).length,
          low: botDetails.filter(b => b.points > 0 && b.points <= 50).length,
          medium: botDetails.filter(b => b.points > 50 && b.points <= 100).length,
          high: botDetails.filter(b => b.points > 100).length
        }
      }
    });

  } catch (error) {
    console.error('[DEBUG_BOT_DETAILS_API_ERROR]', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

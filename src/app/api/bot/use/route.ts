import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// ボット利用時のポイント消費API
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Authorization ヘッダーからトークンを取得
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Authorization header required'
      }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // トークンからユーザー情報を取得
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token or user not found'
      }, { status: 401 })
    }

    // リクエストボディを取得
    const body = await request.json()
    const { bot_id, message } = body

    // バリデーション
    if (!bot_id) {
      return NextResponse.json({
        success: false,
        error: 'Bot ID is required'
      }, { status: 400 })
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Message is required'
      }, { status: 400 })
    }

    // ボット情報を取得
    const { data: bot, error: botError } = await supabase
      .from('bots')
      .select('id, name, points, description')
      .eq('id', bot_id)
      .single()

    if (botError || !bot) {
      return NextResponse.json({
        success: false,
        error: 'Bot not found'
      }, { status: 404 })
    }

    const requiredPoints = bot.points || 100 // デフォルト100ポイント

    // 現在のポイント残高を確認
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('current_points')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch user profile'
      }, { status: 500 })
    }

    const currentPoints = profile?.current_points || 0
    
    if (currentPoints < requiredPoints) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient points',
        data: {
          current_points: currentPoints,
          required_points: requiredPoints,
          bot_name: bot.name
        }
      }, { status: 400 })
    }

    // ポイント消費処理
    const newBalance = currentPoints - requiredPoints

    // ポイント残高を更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ current_points: newBalance })
      .eq('id', user.id)

    if (updateError) {
      console.error('Points update error:', updateError)
      return NextResponse.json({
        success: false,
        error: 'Failed to update points'
      }, { status: 500 })
    }

    // ポイント履歴に記録
    const { error: historyError } = await supabase
      .from('points_history')
      .insert({
        user_id: user.id,
        points: -requiredPoints, // 消費なのでマイナス
        transaction_type: 'spent',
        description: `${bot.name}の利用`,
        reference_id: bot.id
      })

    if (historyError) {
      console.error('History insert error:', historyError)
      // ポイント履歴の記録に失敗しても、ボット利用自体は成功とする
    }

    // 実際のチャットボット応答を生成（ここではダミー応答）
    const botResponse = generateBotResponse(bot, message)

    return NextResponse.json({
      success: true,
      message: 'Bot used successfully',
      data: {
        bot: {
          id: bot.id,
          name: bot.name,
          description: bot.description
        },
        points_consumed: requiredPoints,
        previous_balance: currentPoints,
        new_balance: newBalance,
        user_message: message,
        bot_response: botResponse
      }
    })

  } catch (error) {
    console.error('Bot use API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// ダミーのボット応答生成（実際のAI連携時に置き換え）
function generateBotResponse(bot: any, userMessage: string): string {
  const responses = [
    `こんにちは！${bot.name}です。「${userMessage}」について回答させていただきます。`,
    `${userMessage}に関して、以下のようにお答えします...`,
    `ご質問「${userMessage}」にお答えします。専門的な観点から...`,
    `${userMessage}について詳しく説明いたします。まず...`,
    `お問い合わせの件「${userMessage}」ですが、こちらの情報が参考になるかと思います...`
  ]

  const randomResponse = responses[Math.floor(Math.random() * responses.length)]
  
  return `${randomResponse}\n\n（※これはテスト応答です。実際のAI機能は今後実装予定です。${bot.points}ポイントが消費されました。）`
}
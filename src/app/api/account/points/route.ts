import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    logger.info('[points] Starting points API request')
    
    // Authorization ヘッダーからトークンを取得
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('[points] No authorization header, returning 0 points')
      return NextResponse.json({ success: true, data: { current_points: 0, user_id: null } });
    }

    const token = authHeader.substring(7)
    
    // Supabase クライアントを作成（サービスロールキーを使用）
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // トークンを使ってユーザー情報を取得
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      logger.error('[points] Auth error', authError instanceof Error ? authError : new Error('Unknown auth error'));
      return NextResponse.json({ success: true, data: { current_points: 0, user_id: null } });
    }

    logger.info('[points] User found', { userId: user.id });

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('current_points')
      .eq('id', user.id)
      .single();

    if (profileError) {
      logger.error('[points] Profile error', profileError instanceof Error ? profileError : new Error('Unknown profile error'));
      if (profileError.code === 'PGRST116') { // No rows found
        logger.info('[points] Profile not found, creating default profile');
        // プロフィールが存在しない場合はデフォルトプロフィールを作成
        const defaultProfile = {
          id: user.id,
          username: user.email?.split('@')[0] || 'ユーザー',
          current_points: 0,
          role: 'user',
          created_at: new Date().toISOString()
        }
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert(defaultProfile)
          .select('current_points')
          .single()
          
        if (createError) {
          logger.error('[points] Create profile error', createError instanceof Error ? createError : new Error('Unknown create error'));
          return NextResponse.json({ success: true, data: { current_points: 0, user_id: user.id } });
        }
        
        return NextResponse.json({
          success: true,
          data: {
            current_points: newProfile?.current_points ?? 0,
            user_id: user.id,
          },
        });
      }
      return NextResponse.json({ success: false, error: 'Failed to fetch points' }, { status: 500 });
    }

    logger.info('[points] Profile found', { points: profile?.current_points });
    return NextResponse.json({
      success: true,
      data: {
        current_points: profile?.current_points ?? 0,
        user_id: user.id,
      },
    });

  } catch (error) {
    logger.error('[points] Unexpected error', error instanceof Error ? error : new Error('Unknown error'));
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }, { status: 500 });
  }
}

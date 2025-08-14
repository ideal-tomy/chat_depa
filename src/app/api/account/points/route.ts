import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('[points] Starting points API request')
    
    // Authorization ヘッダーからトークンを取得
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[points] No authorization header, returning 0 points')
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
      console.error('[points] Auth error:', authError)
      return NextResponse.json({ success: true, data: { current_points: 0, user_id: null } });
    }

    console.log('[points] User found:', user.id)

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('current_points')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('[points] Profile error:', profileError);
      if (profileError.code === 'PGRST116') { // No rows found
        console.log('[points] Profile not found, creating default profile');
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
          console.error('[points] Create profile error:', createError)
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

    console.log('[points] Profile found, points:', profile?.current_points);
    return NextResponse.json({
      success: true,
      data: {
        current_points: profile?.current_points ?? 0,
        user_id: user.id,
      },
    });

  } catch (error: any) {
    console.error('[points] Unexpected error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message ?? 'Internal Server Error' 
    }, { status: 500 });
  }
}

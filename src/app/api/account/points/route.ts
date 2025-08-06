import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError.message);
      return NextResponse.json({ success: false, error: 'Session error' }, { status: 500 });
    }

    if (!session) {
      // ログインしていない場合は、ポイント0として正常に返す
      return NextResponse.json({ success: true, data: { current_points: 0, user_id: null } });
    }

    const { user } = session;
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('current_points')
      .eq('id', user.id)
      .single();

    if (profileError) {
      if (profileError.code === 'PGRST116') { // No rows found
        // プロフィールが存在しない場合もポイント0として扱う
        return NextResponse.json({ success: true, data: { current_points: 0, user_id: user.id } });
      }
      console.error('Points fetch error:', profileError);
      return NextResponse.json({ success: false, error: 'Failed to fetch points' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        current_points: profile?.current_points ?? 0,
        user_id: user.id,
      },
    });

  } catch (error) {
    console.error('Points API error:', error);
    if (error instanceof Error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

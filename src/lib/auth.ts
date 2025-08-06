import { createClient } from '@supabase/supabase-js'

// クライアントサイド用Supabaseインスタンス
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ユーザー認証状態の取得
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('認証エラー:', error)
    return null
  }
}

// セッション取得
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('セッション取得エラー:', error)
    return null
  }
}

// ログアウト
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return true
  } catch (error) {
    console.error('ログアウトエラー:', error)
    return false
  }
}

export { supabase }
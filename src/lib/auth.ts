import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger';

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
    logger.error('認証エラー', new Error(String(error)))
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
    logger.error('セッション取得エラー', new Error(String(error)))
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
    logger.error('ログアウトエラー', new Error(String(error)))
    return false
  }
}

export { supabase }

import { getSession } from './auth'

// API は常に相対パスで叩く（SSRでも Next.js が同一オリジンで解決）
const API_BASE_URL = ''

// API レスポンス型定義
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// API リクエスト共通関数
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const session = await getSession()
    const token = session?.access_token

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include', // クッキー送信を有効化
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`)
    }

    return result
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// プロフィール関連API
export const profileAPI = {
  // プロフィール取得
  async getProfile(): Promise<ApiResponse<{ profile: any; auth: any }>> {
    return apiRequest('/api/account/profile-client')
  },

  // プロフィール更新
  async updateProfile(data: { username: string; avatar_url?: string }): Promise<ApiResponse<{ profile: any }>> {
    return apiRequest('/api/account/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
}

// ポイント関連API
export const pointsAPI = {
  // ポイント残高取得
  async getBalance(): Promise<ApiResponse<{ current_points: number; user_id: string }>> {
    return apiRequest('/api/account/points')
  },

  // ポイント消費
  async spendPoints(data: { points: number; description?: string; reference_id?: string }): Promise<ApiResponse<any>> {
    return apiRequest('/api/account/points', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // ポイント履歴取得
  async getHistory(params: { limit?: number; offset?: number; type?: string } = {}): Promise<ApiResponse<{ history: any[]; pagination: any }>> {
    const searchParams = new URLSearchParams()
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.offset) searchParams.set('offset', params.offset.toString())
    if (params.type) searchParams.set('type', params.type)

    const query = searchParams.toString()
    return apiRequest(`/api/account/points/history${query ? `?${query}` : ''}`)
  },

  // 購入可能プラン取得
  async getPlans(): Promise<ApiResponse<{ plans: any[]; total_plans: number }>> {
    return apiRequest('/api/account/plans')
  },
}

// 管理者用API
export const adminAPI = {
  // ユーザー一覧取得
  async getUsers(params: { limit?: number; offset?: number; search?: string } = {}): Promise<ApiResponse<{ users: any[]; pagination: any; statistics: any }>> {
    const searchParams = new URLSearchParams()
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.offset) searchParams.set('offset', params.offset.toString())
    if (params.search) searchParams.set('search', params.search)

    const query = searchParams.toString()
    return apiRequest(`/api/admin/users${query ? `?${query}` : ''}`)
  },

  // 手動ポイント付与
  async grantPoints(data: { target_user_id: string; points: number; description?: string }): Promise<ApiResponse<any>> {
    return apiRequest('/api/admin/points/grant', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

export default apiRequest
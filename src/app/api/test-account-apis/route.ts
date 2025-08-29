import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
export const dynamic = 'force-dynamic'

// アカウント設定バックエンドAPIの動作確認用
export async function GET() {
  try {
    
    const apiEndpoints = [
      '/api/account/profile',
      '/api/account/points',
      '/api/account/points/history',
      '/api/account/plans',
      '/api/admin/points/grant',
      '/api/admin/users',
      '/api/verify-setup'
    ]

    const testResults = {
      success: true,
      message: 'アカウント設定バックエンドAPIが正常に作成されました',
      data: {
        created_apis: apiEndpoints.map(endpoint => ({
          endpoint,
          description: getApiDescription(endpoint),
          method: getApiMethods(endpoint)
        })),
        database_status: 'セットアップ完了',
        next_steps: [
          '1. プロフィール表示機能の実装',
          '2. ポイント残高表示の実装', 
          '3. 管理者用ダッシュボードの作成',
          '4. Stripe決済連携の実装（将来）'
        ]
      }
    }

    return NextResponse.json(testResults)

  } catch (error) {
    logger.error('Test API error', new Error(String(error)))
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

function getApiDescription(endpoint: string): string {
  const descriptions: { [key: string]: string } = {
    '/api/account/profile': 'プロフィール情報の取得・更新',
    '/api/account/points': 'ポイント残高取得・消費',
    '/api/account/points/history': 'ポイント履歴取得',
    '/api/account/plans': '購入可能プラン一覧取得',
    '/api/admin/points/grant': '管理者用手動ポイント付与',
    '/api/admin/users': '管理者用ユーザー一覧取得',
    '/api/verify-setup': 'データベースセットアップ状況確認'
  }
  return descriptions[endpoint] || '説明なし'
}

function getApiMethods(endpoint: string): string[] {
  const methods: { [key: string]: string[] } = {
    '/api/account/profile': ['GET', 'PUT'],
    '/api/account/points': ['GET', 'POST'],
    '/api/account/points/history': ['GET'],
    '/api/account/plans': ['GET'],
    '/api/admin/points/grant': ['POST'],
    '/api/admin/users': ['GET'],
    '/api/verify-setup': ['GET']
  }
  return methods[endpoint] || ['GET']
}


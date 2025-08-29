import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { supabaseServer } from '@/lib/supabase/server';
import { ApiResponse, DatabaseProfile } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * ユーザープロフィールを取得するAPI
 * GET /api/v1/users/profile
 */
export async function GET(): Promise<NextResponse<ApiResponse<DatabaseProfile>>> {
  try {
    logger.info('[v1/users/profile] Starting profile API request');
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      logger.warn('[v1/users/profile] No authenticated user found');
      return NextResponse.json({
        success: false,
        error: 'Not authenticated',
        timestamp: new Date().toISOString()
      }, { status: 401 });
    }

    logger.info('[v1/users/profile] User found', { userId: user.id });

    const { data: profile, error: profileError } = await supabaseServer
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      logger.error('[v1/users/profile] Profile fetch error', profileError instanceof Error ? profileError : new Error('Unknown profile error'));
      return NextResponse.json({
        success: false,
        error: 'Profile not found',
        timestamp: new Date().toISOString()
      }, { status: 404 });
    }

    logger.info('[v1/users/profile] Profile fetched successfully');
    
    return NextResponse.json({
      success: true,
      data: profile,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('[v1/users/profile] Unexpected error', error instanceof Error ? error : new Error('Unknown error'));
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * ユーザープロフィールを更新するAPI
 * PUT /api/v1/users/profile
 */
export async function PUT(request: NextRequest): Promise<NextResponse<ApiResponse<DatabaseProfile>>> {
  try {
    logger.info('[v1/users/profile] Starting profile update request');
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      logger.warn('[v1/users/profile] No authenticated user found for update');
      return NextResponse.json({
        success: false,
        error: 'Not authenticated',
        timestamp: new Date().toISOString()
      }, { status: 401 });
    }

    const body = await request.json();
    const { username, avatar_url } = body as { username?: string; avatar_url?: string };

    // バリデーション
    if (!username || username.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Username is required',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    if (username.length > 50) {
      return NextResponse.json({
        success: false,
        error: 'Username must be 50 characters or less',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { 
      username: username.trim(),
      updated_at: new Date().toISOString()
    };
    
    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url;
    }

    const { data: updatedProfile, error: updateError } = await supabaseServer
      .from('profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (updateError) {
      logger.error('[v1/users/profile] Profile update error', updateError instanceof Error ? updateError : new Error('Unknown update error'));
      return NextResponse.json({
        success: false,
        error: 'Failed to update profile',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    logger.info('[v1/users/profile] Profile updated successfully');
    
    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('[v1/users/profile] Unexpected error in PUT', error instanceof Error ? error : new Error('Unknown error'));
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}


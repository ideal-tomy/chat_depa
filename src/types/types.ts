export interface Bot {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  authorIcon: string;
  points: number;
  costPoints?: number;
  imageUrl: string;
  isNew?: boolean;
  isPopular?: boolean;
  isUGC?: boolean;
  useCases?: string[];
  instructions?: string;
  complexity?: 'simple' | 'medium' | 'advanced';
  can_upload_image?: boolean;
  can_send_file?: boolean;
  character_desc?: string;
  system_prompt?: string;
  usage_count?: number;
  created_at?: string;
  ui_theme?: string | null;
  // 表示最適化用の新しいフィールド
  featured_priority?: number;
  is_pickup?: boolean;
  is_trending?: boolean;
  manual_sort_order?: number;
  usage_stats?: BotUsageStats;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface PointRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

export interface SortOrder {
  id: string;
  label: string;
}


export interface CategoryOption {
  id: string;
  name: string;
}

export interface PointRangeOption {
  id: string;
  name: string;
  range: [number, number];
}

export interface Message {
  id: string;
  text: string;
  role: 'user' | 'assistant' | 'bot' | 'system';
  timestamp: Date;
}

// ========================================
// ボット表示最適化システム用の型定義
// ========================================

export interface BotUsageStats {
  id: string;
  bot_id: string;
  total_uses: number;
  unique_users: number;
  avg_session_duration: number;
  completion_rate: number;
  user_rating: number;
  last_used_at: string;
  created_at: string;
  updated_at: string;
}

export interface BotFeaturedSetting {
  id: string;
  bot_id: string;
  display_type: 'pickup' | 'new' | 'trending' | 'category_featured';
  category_id?: string;
  priority: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BotUserInteraction {
  id: string;
  user_id: string;
  bot_id: string;
  interaction_type: 'view' | 'start_chat' | 'complete_chat' | 'rate' | 'favorite';
  session_duration?: number;
  rating?: number;
  created_at: string;
}

export interface BotRecommendation {
  id: string;
  source_bot_id: string;
  recommended_bot_id: string;
  recommendation_type: 'collaborative' | 'content_based' | 'hybrid';
  similarity_score: number;
  confidence_score: number;
  click_through_rate: number;
  conversion_rate: number;
  created_at: string;
  updated_at: string;
  // フロントエンド表示用
  bot?: Bot;
  reason?: string;
}

export interface UserRecommendationFeedback {
  id: string;
  user_id: string;
  source_bot_id: string;
  recommended_bot_id: string;
  action_type: 'view' | 'click' | 'use' | 'dismiss';
  session_id?: string;
  created_at: string;
}

export interface BotDisplayScore {
  botId: string;
  score: number;
  factors: {
    manualPriority: number;
    usageScore: number;
    ratingScore: number;
    recencyScore: number;
    personalizationScore: number;
  };
}

export interface DynamicBotRequest {
  displayType: 'pickup' | 'new' | 'trending' | 'category_featured';
  categoryId?: string;
  maxItems?: number;
  userId?: string;
}

export interface UserContext {
  userId?: string;
  preferences?: {
    categories: string[];
    complexity: 'simple' | 'medium' | 'advanced';
    features: string[];
  };
  history?: {
    recentBots: string[];
    favoriteCategories: string[];
  };
}

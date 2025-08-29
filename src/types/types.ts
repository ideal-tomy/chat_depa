

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

// ========================================
// APIレスポンス型定義
// ========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ========================================
// コンポーネントProps型定義
// ========================================

export interface BotCardProps {
  bot: Bot;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'standard' | 'compact';
  hideForm?: boolean;
  compact?: boolean;
  isLarge?: boolean;
  isNew?: boolean;
  onCardClick?: (botId: string) => void;
  onSendMessage?: (botId: string, message: string) => void;
  className?: string;
}

export interface BotCardState {
  message: string;
  isSending: boolean;
  error: string | null;
}

export interface CarouselProps {
  title?: string;
  subtitle?: string;
  bots: Bot[];
  maxItems?: number;
  showRanking?: boolean;
  className?: string;
  isLarge?: boolean;
  isNew?: boolean;
  onBotClick?: (bot: Bot) => void;
  loading?: boolean;
  error?: string | null;
}

export interface CarouselState {
  currentIndex: number;
  isScrolling: boolean;
  scrollDirection: 'left' | 'right' | null;
}

export interface FilterProps {
  categories: CategoryOption[];
  pointRanges: PointRangeOption[];
  sortOrders: SortOrder[];
  onFilterChange: (filters: FilterState) => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}

export interface FilterState {
  category: string;
  pointRange: string;
  sortOrder: string;
  search: string;
}

// ========================================
// チャット関連の型定義
// ========================================

export interface ChatMessage {
  id: string;
  text: string;
  role: 'user' | 'assistant' | 'bot' | 'system';
  timestamp: Date;
  metadata?: {
    botId?: string;
    sessionId?: string;
    messageType?: 'text' | 'image' | 'file';
    attachments?: ChatAttachment[];
  };
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'file' | 'audio';
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
}

export interface ChatSession {
  id: string;
  botId: string;
  userId: string;
  messages: ChatMessage[];
  startedAt: Date;
  lastActivityAt: Date;
  status: 'active' | 'paused' | 'completed' | 'archived';
}

export interface ChatWindowProps {
  session: ChatSession;
  onSendMessage: (message: string) => void;
  onSendAttachment?: (file: File) => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendAttachment?: (file: File) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

// ========================================
// 認証関連の型定義
// ========================================

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  avatarUrl?: string;
  isAuthenticated: boolean;
  lastLoginAt?: Date;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onGoogleLogin?: () => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export interface RegisterFormProps {
  onRegister: (email: string, password: string, username: string) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

// ========================================
// レイアウト関連の型定義
// ========================================

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showSidebar?: boolean;
}

export interface HeaderProps {
  user?: AuthUser;
  onLogin?: () => void;
  onLogout?: () => void;
  onProfileClick?: () => void;
  className?: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: AuthUser;
  className?: string;
}

// ========================================
// 共通UI型定義
// ========================================

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string | null;
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  className?: string;
  maxLength?: number;
  required?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'skeleton';
  className?: string;
  text?: string;
}

// ========================================
// データベース型定義
// ========================================

export interface DatabaseBot {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  author_icon: string;
  points: number;
  cost_points?: number;
  image_url: string;
  is_new?: boolean;
  is_popular?: boolean;
  is_ugc?: boolean;
  use_cases?: string[];
  instructions?: string;
  complexity?: 'simple' | 'medium' | 'advanced';
  can_upload_image?: boolean;
  can_send_file?: boolean;
  character_desc?: string;
  system_prompt?: string;
  usage_count?: number;
  created_at: string;
  updated_at: string;
  ui_theme?: string | null;
  featured_priority?: number;
  is_pickup?: boolean;
  is_trending?: boolean;
  manual_sort_order?: number;
}

export interface DatabaseUser {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  current_points: number;
  total_points_earned: number;
  total_points_spent: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseProfile {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  preferences?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ========================================
// エラーハンドリング型定義
// ========================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// ========================================
// ログシステム型定義
// ========================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
}

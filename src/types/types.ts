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

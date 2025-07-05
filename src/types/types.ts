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
  complexity?: 'simple' | 'medium' | 'advanced'; // ボットの複雑さレベル
  can_upload_image?: boolean; // 画像アップロード機能の有無
  can_send_file?: boolean; // ファイル送信機能の有無
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

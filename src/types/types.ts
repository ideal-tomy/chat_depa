export interface Bot {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  authorIcon: string;
  points: number;
  imageUrl: string;
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

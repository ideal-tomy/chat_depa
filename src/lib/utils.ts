import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * クラス名を組み合わせるためのユーティリティ
 * clsx と tailwind-merge を組み合わせて、クラス名の衝突を解決します
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

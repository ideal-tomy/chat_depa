import React from 'react';
import { LoadingProps } from '@/types';

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  className = '',
  text
}) => {
  // サイズ別クラス
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  // スピナーのSVG
  const Spinner = (): JSX.Element => (
    <svg 
      className={`animate-spin ${sizeClasses[size]}`}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // ドットのSVG
  const Dots = (): JSX.Element => (
    <div className="flex space-x-1">
      <div className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
      <div className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
      <div className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
    </div>
  );

  // スケルトンのSVG
  const Skeleton = (): JSX.Element => (
    <div className={`${sizeClasses[size]} bg-gray-200 rounded animate-pulse`} />
  );

  // バリアントに応じたローディング要素
  const LoadingElement = (): JSX.Element => {
    switch (variant) {
      case 'dots':
        return <Dots />;
      case 'skeleton':
        return <Skeleton />;
      case 'spinner':
      default:
        return <Spinner />;
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LoadingElement />
      {text && (
        <span className="ml-2 text-gray-600">{text}</span>
      )}
    </div>
  );
};

export default Loading;

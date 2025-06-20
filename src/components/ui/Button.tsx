'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // バリアントに応じたスタイル
  const variantStyles = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-md',
    secondary: 'bg-accent-yellow hover:bg-opacity-80 text-text-dark',
    tertiary: 'bg-accent-blue hover:bg-opacity-80 text-white',
    outline: 'bg-white border-2 border-primary text-primary hover:bg-gray-50',
  };

  // サイズに応じたスタイル
  const sizeStyles = {
    sm: 'text-xs py-1 px-3 rounded',
    md: 'text-sm py-2 px-4 rounded-md',
    lg: 'text-base py-3 px-6 rounded-lg',
  };

  // 幅のスタイル
  const widthStyle = fullWidth ? 'w-full' : '';

  // ローディング状態のスタイル
  const loadingStyle = isLoading ? 'opacity-70 cursor-wait' : '';

  // 無効状態のスタイル
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`
        font-medium transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-primary
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyle}
        ${loadingStyle}
        ${disabledStyle}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
}

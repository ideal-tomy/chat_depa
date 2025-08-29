import React, { forwardRef } from 'react';
import { InputProps } from '@/types';

const Input = forwardRef<HTMLInputElement, InputProps>(({
  value,
  onChange,
  placeholder,
  disabled = false,
  error = null,
  type = 'text',
  className = '',
  maxLength,
  required = false
}, ref) => {
  // ベースクラスの計算
  const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // エラー状態に応じたクラス
  const borderClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';
  
  // 最終的なクラス名を組み立て
  const finalClassName = `${baseClasses} ${borderClasses} ${className}`.trim();
  
  // 変更ハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value);
  };
  
  return (
    <div className="relative">
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        required={required}
        className={finalClassName}
      />
      {error && (
        <div className="mt-1 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

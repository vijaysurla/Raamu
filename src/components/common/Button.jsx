import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'base',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  };
  const sizeClasses = {
    sm: 'btn-sm',
    base: '',
    lg: 'btn-lg',
  };

  const buttonClassName = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    loading && 'loading',
    disabled && 'disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClassName}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="spinner"></span>}
      {children}
    </button>
  );
}

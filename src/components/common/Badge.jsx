import React from 'react';

export default function Badge({ children, variant = 'primary', className = '' }) {
  const variantClasses = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
  };

  const badgeClassName = [
    'badge',
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={badgeClassName}>{children}</span>;
}

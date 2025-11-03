import React from 'react';

export default function Avatar({ 
  src, 
  alt = 'Avatar', 
  initials, 
  size = 'base', 
  className = '' 
}) {
  const sizeClasses = {
    sm: 'avatar-sm',
    base: '',
    lg: 'avatar-lg',
  };

  const avatarClassName = [
    'avatar',
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={avatarClassName}>
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <span>{initials || alt.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}

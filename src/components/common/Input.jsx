import React from 'react';

export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  error = false,
  disabled = false,
  className = '',
  ...props
}) {
  const inputClassName = [
    'input',
    error && 'input-error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={inputClassName}
      {...props}
    />
  );
}

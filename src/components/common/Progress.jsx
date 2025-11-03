import React from 'react';

export default function Progress({ value = 0, max = 100, className = '' }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`progress ${className}`}>
      <div 
        className="progress-bar" 
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
}

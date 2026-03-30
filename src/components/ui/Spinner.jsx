import React from 'react';

export default function Spinner({ size = 'md', color = 'purple', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  const colors = {
    purple: 'border-primary/30 border-t-primary',
    orange: 'border-accent/30 border-t-accent',
    white: 'border-white/30 border-t-white',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

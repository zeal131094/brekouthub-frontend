import React from 'react';

export default function Card({ children, className = '', onClick, padding = true }) {
  return (
    <div
      className={`card ${padding ? 'p-4' : ''} ${onClick ? 'cursor-pointer active:scale-[0.99] transition-transform duration-150' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

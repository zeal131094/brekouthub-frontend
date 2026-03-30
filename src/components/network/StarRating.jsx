import React, { useState } from 'react';
import { Star } from 'lucide-react';

export function StarDisplay({ rating, size = 14, showNumber = false }) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= rounded ? 'text-yellow-400' : 'text-muted/30'}
          fill={i <= rounded ? 'currentColor' : 'none'}
        />
      ))}
      {showNumber && (
        <span className="ml-1 text-sm font-semibold text-yellow-400">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
}

export function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="p-0.5 transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            size={28}
            className={i <= (hovered || value) ? 'text-yellow-400' : 'text-muted/30'}
            fill={i <= (hovered || value) ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </div>
  );
}

export default StarDisplay;

import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({
  value = 0,
  onChange = null,
  readOnly = false,
  size = 'md',
  showLabel = true,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const currentDisplay = hoverRating || Number(value) || 0;

  return (
    <div className="inline-flex items-center space-x-1">
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.round(currentDisplay);

          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={() => onChange && onChange(star)}
              onMouseEnter={() => !readOnly && setHoverRating(star)}
              onMouseLeave={() => !readOnly && setHoverRating(0)}
              className={`transition-colors p-0.5 rounded focus:outline-none ${
                readOnly
                  ? 'cursor-default'
                  : 'cursor-pointer hover:scale-110 active:scale-95'
              }`}
              title={readOnly ? `${value} stars` : `Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                className={`${starSizes[size] || starSizes.md} ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-300 stroke-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showLabel && (
        <span className="text-xs font-medium text-gray-500 ml-1.5 min-w-8">
          {Number(value) > 0 ? `${Number(value).toFixed(1)} / 5` : 'No rating'}
        </span>
      )}
    </div>
  );
};

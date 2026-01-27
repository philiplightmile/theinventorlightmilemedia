import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  max = 5,
  size = 'md',
}) => {
  const [hoverValue, setHoverValue] = React.useState(0);

  return (
    <div className="star-rating flex gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          className={cn(
            'star transition-all duration-200 hover:scale-110',
            sizeClasses[size],
            (hoverValue || value) >= star ? 'text-eos-orange' : 'text-muted-foreground/30'
          )}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
        >
          <Star
            className={cn(
              'w-full h-full transition-all',
              (hoverValue || value) >= star ? 'fill-current' : ''
            )}
          />
        </button>
      ))}
    </div>
  );
};

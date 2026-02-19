import React from 'react';
import { AlertTriangle, Pencil, Wifi, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExerciseCardProps {
  exercise: 'friction' | 'makeover' | 'visibility';
  exerciseNumber: number;
  status: 'locked' | 'available' | 'completed';
  onClick: () => void;
}

const exerciseData = {
  friction: {
    icon: AlertTriangle,
    title: 'the friction audit',
    subtitle: 'innovation strategy',
    iconColor: 'text-eos-orange',
    bgColor: 'bg-eos-orange/10',
  },
  makeover: {
    icon: Pencil,
    title: 'the mundane makeover',
    subtitle: 'product design',
    iconColor: 'text-eos-magenta',
    bgColor: 'bg-eos-magenta/10',
  },
  visibility: {
    icon: Wifi,
    title: 'the visibility signal',
    subtitle: 'inclusion & culture',
    iconColor: 'text-eos-mint',
    bgColor: 'bg-eos-mint/10',
  },
};

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, exerciseNumber, status, onClick }) => {
  const { icon: Icon, title, subtitle, iconColor, bgColor } = exerciseData[exercise];

  return (
    <div
      className={cn(
        'exercise-card group',
        status === 'locked' && 'locked'
      )}
      onClick={status !== 'locked' ? onClick : undefined}
    >
      {/* Exercise Number Badge */}
      {exerciseNumber > 0 && (
        <div className="absolute top-4 right-4 text-xs font-medium text-muted-foreground">
          exercise {exerciseNumber}
        </div>
      )}

      {/* Icon */}
      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-4', bgColor)}>
        <Icon className={cn('w-7 h-7', iconColor)} />
      </div>

      {/* Content */}
      <h3 className="heading-lowercase text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>

      {/* Action */}
      {status === 'locked' && (
        <Button variant="outline" disabled className="w-full gap-2">
          <Lock className="w-4 h-4" />
          locked
        </Button>
      )}
      {status === 'available' && (
        <Button variant="eos" className="w-full">
          start
        </Button>
      )}
      {status === 'completed' && (
        <Button variant="eos-outline" className="w-full gap-2 border-eos-mint text-eos-mint">
          <Check className="w-4 h-4" />
          completed
        </Button>
      )}
    </div>
  );
};
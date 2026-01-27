import React from 'react';
import { AlertTriangle, Pencil, Wifi, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ModuleCardProps {
  module: 'friction' | 'makeover' | 'visibility';
  status: 'locked' | 'available' | 'completed';
  onClick: () => void;
}

const moduleData = {
  friction: {
    icon: AlertTriangle,
    title: 'THE FRICTION AUDIT',
    subtitle: 'Innovation Strategy',
    iconColor: 'text-eos-orange',
    bgColor: 'bg-eos-orange/10',
  },
  makeover: {
    icon: Pencil,
    title: 'THE MUNDANE MAKEOVER',
    subtitle: 'Product Design',
    iconColor: 'text-eos-blue',
    bgColor: 'bg-eos-blue/10',
  },
  visibility: {
    icon: Wifi,
    title: 'THE VISIBILITY SIGNAL',
    subtitle: 'Inclusion & Culture',
    iconColor: 'text-eos-mint',
    bgColor: 'bg-eos-mint/10',
  },
};

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, status, onClick }) => {
  const { icon: Icon, title, subtitle, iconColor, bgColor } = moduleData[module];

  return (
    <div
      className={cn(
        'module-card group',
        status === 'locked' && 'locked'
      )}
    >
      {/* Icon */}
      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-4', bgColor)}>
        <Icon className={cn('w-7 h-7', iconColor)} />
      </div>

      {/* Content */}
      <h3 className="font-display text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>

      {/* Action */}
      {status === 'locked' && (
        <Button variant="outline" disabled className="w-full gap-2">
          <Lock className="w-4 h-4" />
          Locked
        </Button>
      )}
      {status === 'available' && (
        <Button variant="eos" onClick={onClick} className="w-full">
          Start
        </Button>
      )}
      {status === 'completed' && (
        <Button variant="outline" onClick={onClick} className="w-full gap-2 border-eos-mint text-eos-mint">
          <Check className="w-4 h-4" />
          Completed
        </Button>
      )}

      {/* Hover effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import type { Pillar } from '@/lib/types';
import { formatMissionStatus } from '@/lib/formatters';

interface DoorCardProps {
  pillar: Pillar;
  isCompleted?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
  className?: string;
}

const iconMap = {
  'dollar-sign': '💰',
  'users': '👥',
  'settings': '⚙️',
  'trending-up': '📈'
} as const;

export const DoorCard: React.FC<DoorCardProps> = ({
  pillar,
  isCompleted = false,
  isLocked = false,
  onClick,
  className = ''
}) => {
  const status = formatMissionStatus(isCompleted);
  const iconKey = pillar.icon as keyof typeof iconMap;
  const displayIcon = iconMap[iconKey] || '🔷';

  return (
    <Card 
      className={`door-card group cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}
      onClick={!isLocked ? onClick : undefined}
      style={{
        backgroundColor: `${pillar.color}08`,
        borderColor: isCompleted ? '#22c55e' : `${pillar.color}40`
      }}
    >
      <CardContent className="p-6 relative">
        {/* LED Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className={`led-indicator ${isCompleted ? 'completed' : 'active'}`} />
          {isCompleted && (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          )}
          {isLocked && (
            <Lock className="w-4 h-4 text-slate-400" />
          )}
        </div>

        {/* Icon */}
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-4 glow-effect"
          style={{ backgroundColor: `${pillar.color}15` }}
        >
          {displayIcon}
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="font-poppins font-semibold text-lg text-slate-800 group-hover:text-slate-900">
              {pillar.name}
            </h3>
            {pillar.description && (
              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                {pillar.description}
              </p>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge className={`mission-status ${status.variant}`}>
              {status.label}
            </Badge>

            {!isLocked && (
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-unimed-primary transition-colors" />
            )}
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div 
            className="w-full h-full rounded-lg"
            style={{
              boxShadow: `0 0 30px ${pillar.color}30`
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DoorCard;

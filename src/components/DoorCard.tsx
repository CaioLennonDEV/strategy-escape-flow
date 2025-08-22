
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Lock, ArrowRight, Zap, Star } from 'lucide-react';
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
      className={`escape-run-card group cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}
      onClick={!isLocked ? onClick : undefined}
      style={{
        backgroundColor: `${pillar.color}08`,
        borderColor: isCompleted ? '#22c55e' : `${pillar.color}40`
      }}
    >
      <CardContent className="p-3 sm:p-4 md:p-6 relative">
        {/* LED Indicator */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 flex items-center gap-1 sm:gap-2">
          <div className={`led-indicator ${isCompleted ? 'completed' : 'active'}`} />
          {isCompleted && (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          )}
          {isLocked && (
            <Lock className="w-4 h-4 text-white/60" />
          )}
        </div>

        {/* Icon */}
        <div 
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 glow-effect"
          style={{ backgroundColor: `${pillar.color}15` }}
        >
          {displayIcon}
        </div>

        {/* Content */}
        <div className="space-y-2 sm:space-y-3">
          <div>
            <h3 className="font-poppins font-semibold text-sm sm:text-base md:text-lg text-white group-hover:text-white/90 leading-tight">
              {pillar.name}
            </h3>
            {pillar.description && (
              <p className="text-xs sm:text-sm text-white/80 mt-1 line-clamp-2 leading-relaxed">
                {pillar.description}
              </p>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge className={`mission-status text-xs sm:text-xs ${status.variant}`}>
              {status.label}
            </Badge>

            {!isLocked && (
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 group-hover:text-unimed-primary transition-colors" />
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


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Lock, ArrowRight, Zap, Star } from 'lucide-react';
import type { Pillar } from '@/lib/types';
import { formatMissionStatus } from '@/lib/formatters';
import { getPillarColor } from '@/lib/color-utils';

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
  
  // Usar cor padronizada baseada no nome do pilar
  const pillarColor = getPillarColor(pillar.name);
  


  return (
    <Card 
      className={`group cursor-pointer transition-all duration-500 hover:scale-105 h-full flex flex-col min-h-[160px] sm:min-h-[200px] md:min-h-[220px] lg:min-h-[240px] overflow-hidden ${className}`}
      onClick={!isLocked ? onClick : undefined}
      style={{
        background: `linear-gradient(135deg, ${pillarColor}15 0%, ${pillarColor}05 50%, ${pillarColor}10 100%)`,
        border: `2px solid ${pillarColor}30`,
        boxShadow: `
          0 20px 40px -12px rgba(0, 0, 0, 0.3),
          0 0 0 1px ${pillarColor}20,
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          0 0 30px ${pillarColor}15
        `
      }}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, ${pillarColor}40 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${pillarColor}30 0%, transparent 50%)
          `
        }}
      />

      <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6 relative flex-1 flex flex-col z-10">
        {/* Header com Status */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-5">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isCompleted 
                  ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                  : 'bg-slate-400 shadow-lg shadow-slate-400/30'
              }`}
            />
            {isCompleted && (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            )}
            {isLocked && (
              <Lock className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {/* Arrow Icon */}
          {!isLocked && (
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-300" />
          )}
        </div>

        {/* Icon Container */}
        <div className="flex-1 flex flex-col items-center justify-center mb-3 sm:mb-4 md:mb-5">
          <div 
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${pillarColor}30 0%, ${pillarColor}20 100%)`,
              boxShadow: `0 8px 32px ${pillarColor}25, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
            }}
          >
            {displayIcon}
          </div>

          {/* Title */}
          <h3 className="font-poppins font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-white text-center mb-2 leading-tight">
            {pillar.name}
          </h3>

          {/* Description */}
          {pillar.description && (
            <p className="text-xs sm:text-sm md:text-base text-white/80 text-center leading-relaxed line-clamp-2">
              {pillar.description}
            </p>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge 
            className={`px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 ${
              isCompleted 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
            }`}
          >
            {status.label}
          </Badge>
        </div>
      </CardContent>

      {/* Hover Effects */}
      <div 
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${pillarColor}20 0%, transparent 50%, ${pillarColor}10 100%)`,
          boxShadow: `inset 0 0 0 1px ${pillarColor}40, 0 0 40px ${pillarColor}25`
        }}
      />

      {/* Glow Effect on Hover */}
      <div 
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `0 0 60px ${pillarColor}30`
        }}
      />
    </Card>
  );
};

export default DoorCard;

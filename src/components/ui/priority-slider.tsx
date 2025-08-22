import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Star, StarOff } from 'lucide-react';

interface PrioritySliderProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
  disabled?: boolean;
  className?: string;
}

export const PrioritySlider: React.FC<PrioritySliderProps> = ({
  value,
  onChange,
  max,
  disabled = false,
  className = ''
}) => {
  const handleValueChange = (newValue: number[]) => {
    if (newValue.length > 0) {
      onChange(newValue[0]);
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return 'bg-red-500';
    if (priority === 2) return 'bg-orange-500';
    if (priority === 3) return 'bg-yellow-500';
    if (priority === 4) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority === 1) return 'Crítica';
    if (priority === 2) return 'Alta';
    if (priority === 3) return 'Média';
    if (priority === 4) return 'Baixa';
    return 'Muito Baixa';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600">Prioridade:</span>
        <Badge className={`${getPriorityColor(value)} text-white text-xs`}>
          {getPriorityLabel(value)}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <StarOff className="w-4 h-4 text-gray-400" />
        <Slider
          value={[value]}
          onValueChange={handleValueChange}
          max={max}
          min={1}
          step={1}
          disabled={disabled}
          className="flex-1"
        />
        <Star className="w-4 h-4 text-yellow-500" />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>1</span>
        <span>{Math.ceil(max / 2)}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}; 
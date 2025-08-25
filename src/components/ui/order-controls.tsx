import React from 'react';
import { Button } from './button';
import { 
  ArrowUpDown, 
  ArrowDownUp, 
  SortAsc, 
  RotateCcw,
  Hash,
  List
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

interface OrderControlsProps {
  onAutoSort: () => void;
  onReverseOrder: () => void;
  onSortAlphabetically: () => void;
  onResetOrder: () => void;
  disabled?: boolean;
  className?: string;
}

export const OrderControls: React.FC<OrderControlsProps> = ({
  onAutoSort,
  onReverseOrder,
  onSortAlphabetically,
  onResetOrder,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            className="h-8 px-3 text-xs border-white/20 text-white/70 hover:text-white hover:bg-unimed-primary/20"
          >
            <ArrowUpDown className="h-3 w-3 mr-1" />
            Ordenar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-black/90 border-white/20">
          <DropdownMenuItem
            onClick={onAutoSort}
            className="text-white/70 hover:text-white hover:bg-unimed-primary/20"
          >
            <Hash className="h-3 w-3 mr-2" />
            Numeração (1, 2, 3...)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onReverseOrder}
            className="text-white/70 hover:text-white hover:bg-unimed-primary/20"
          >
            <ArrowDownUp className="h-3 w-3 mr-2" />
            Inverter Ordem
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onSortAlphabetically}
            className="text-white/70 hover:text-white hover:bg-unimed-primary/20"
          >
            <SortAsc className="h-3 w-3 mr-2" />
            Ordem Alfabética
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onResetOrder}
            className="text-white/70 hover:text-white hover:bg-unimed-primary/20"
          >
            <RotateCcw className="h-3 w-3 mr-2" />
            Resetar Ordem
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="text-xs text-white/50 px-2 py-1 bg-white/5 rounded">
        <List className="h-3 w-3 inline mr-1" />
        {disabled ? 'Congelado' : 'Ativo'}
      </div>
    </div>
  );
}; 
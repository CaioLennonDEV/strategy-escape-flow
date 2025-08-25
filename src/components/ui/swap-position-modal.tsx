import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, AlertTriangle, CheckCircle2, X, ArrowRightLeft, Target } from 'lucide-react';
import { getItemColor, getItemGradient, getItemBorderColor } from '@/lib/color-utils';
import type { Action } from '@/lib/types';

interface SwapPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: Action | null;
  targetPosition: number | null;
  onSelectPosition: (position: number) => void;
  onConfirmSwap: () => void;
  totalItems: number;
  currentPositions: Record<string, number>;
  actions: Action[];
}

export const SwapPositionModal: React.FC<SwapPositionModalProps> = ({
  isOpen,
  onClose,
  selectedItem,
  targetPosition,
  onSelectPosition,
  onConfirmSwap,
  totalItems,
  currentPositions,
  actions
}) => {
  if (!selectedItem) return null;

  const currentPosition = currentPositions[selectedItem.id] || 1;
  const itemColor = getItemColor(selectedItem.id);
  const targetItemId = targetPosition ? 
    Object.entries(currentPositions).find(([id, pos]) => pos === targetPosition)?.[0] : null;
  const targetItem = targetItemId ? 
    actions.find(item => item.id === targetItemId) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] p-0 overflow-hidden rounded-2xl border-2 border-unimed-primary/30 bg-black/40 backdrop-blur-md">
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-unimed-primary/20">
          <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-unimed-primary to-unimed-light flex items-center justify-center">
                              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="font-poppins text-lg sm:text-xl text-white leading-tight">
                Trocar Posição
              </DialogTitle>
              <DialogDescription className="text-sm text-white/70 mt-1">
                Selecione a posição desejada. O item atual trocará de lugar com o escolhido.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 swap-modal-content">
          {/* Aviso importante */}
          <Alert className="border-orange-200/50 bg-orange-500/10 backdrop-blur-sm">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <AlertDescription className="text-orange-200 text-sm">
              <strong>Atenção:</strong> Os dois itens trocarão de lugar. 
              O item selecionado vai para a posição escolhida e o item dessa posição vem para cá.
            </AlertDescription>
          </Alert>

          {/* Item selecionado */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-white/80 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-unimed-primary" />
              Item selecionado:
            </h4>
            <div 
              className="p-4 rounded-xl border-2 backdrop-blur-sm relative overflow-hidden"
              style={{ 
                background: getItemGradient(itemColor),
                borderColor: getItemBorderColor(itemColor)
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
              <div className="relative flex items-center gap-3">
                <Badge 
                  className="text-white font-bold px-3 py-1 text-sm"
                  style={{ backgroundColor: itemColor }}
                >
                  {currentPosition}º
                </Badge>
                <div className="flex-1">
                  <h5 className="font-semibold text-sm text-white">{selectedItem.title}</h5>
                  {selectedItem.description && (
                    <p className="text-xs text-white/70 mt-1">{selectedItem.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Seleção de posição */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-white/80 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-unimed-primary" />
              Selecione a nova posição:
            </h4>
            <div className="swap-modal-grid grid-3 sm:grid-4">
              {Array.from({ length: totalItems }, (_, index) => {
                const position = index + 1;
                const isSelected = targetPosition === position;
                const isCurrentPosition = position === currentPosition;
                
                return (
                  <Button
                    key={position}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    disabled={isCurrentPosition}
                    onClick={() => onSelectPosition(position)}
                    className={`h-12 sm:h-14 relative transition-all duration-200 ${
                      isCurrentPosition 
                        ? 'opacity-50 cursor-not-allowed bg-gray-600/20 border-gray-600/30 text-gray-400' 
                        : isSelected 
                          ? 'bg-unimed-primary text-white border-unimed-primary shadow-lg scale-105' 
                          : 'bg-black/30 border-unimed-primary/30 text-white hover:bg-unimed-primary/20 hover:border-unimed-primary/50 hover:scale-105'
                    }`}
                  >
                    <span className="font-bold text-sm">{position}º</span>
                    {isCurrentPosition && (
                      <X className="w-3 h-3 absolute -top-1 -right-1 text-gray-400" />
                    )}
                    {isSelected && (
                      <CheckCircle2 className="w-3 h-3 absolute -top-1 -right-1 text-white" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Preview da troca */}
          {targetPosition && targetPosition !== currentPosition && targetItem && (
            <div className="p-3 sm:p-4 rounded-xl bg-unimed-primary/10 border border-unimed-primary/30 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge className="text-white font-bold" style={{ backgroundColor: itemColor }}>
                    {currentPosition}º
                  </Badge>
                  <span className="text-white/80 text-xs truncate max-w-[80px] sm:max-w-[100px]">
                    {selectedItem.title}
                  </span>
                </div>
                
                <ArrowRightLeft className="w-4 h-4 text-unimed-primary" />
                
                <div className="flex items-center gap-2">
                  <Badge className="text-white font-bold" style={{ backgroundColor: getItemColor(targetItem.id) }}>
                    {targetPosition}º
                  </Badge>
                  <span className="text-white/80 text-xs truncate max-w-[80px] sm:max-w-[100px]">
                    {targetItem.title}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-white/60 text-center mt-2">
                Trocar posições
              </p>
            </div>
          )}

          {/* Botões de ação */}
                      <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-unimed-primary/20">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-black/30 border-unimed-primary/30 text-white hover:bg-black/50 hover:border-unimed-primary/50"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirmSwap}
              disabled={!targetPosition || targetPosition === currentPosition}
              className="flex-1 escape-run-button"
            >
              Confirmar Troca
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Smartphone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuickOrdering } from '@/hooks/use-quick-ordering';
import { useReorderAnimation } from '@/hooks/use-reorder-animation';
import { QuickActions } from '@/components/ui/quick-actions';
import { getItemColor, getItemGradient, getItemBorderColor } from '@/lib/color-utils';


interface TestItem {
  id: string;
  title: string;
  description: string;
}

const testItems: TestItem[] = [
  { id: '1', title: 'Item 1', description: 'Primeiro item da lista' },
  { id: '2', title: 'Item 2', description: 'Segundo item da lista' },
  { id: '3', title: 'Item 3', description: 'Terceiro item da lista' },
  { id: '4', title: 'Item 4', description: 'Quarto item da lista' },
  { id: '5', title: 'Item 5', description: 'Quinto item da lista' },
];

export const MobileDragTest: React.FC = () => {
  const isMobile = useIsMobile();

  // Hook para animação de reordenação
  const { triggerAnimation, isAnimating } = useReorderAnimation();

  const {
    orderedItems: items,
    moveItem,
    canMoveUp,
    canMoveDown,
    getItemPosition
  } = useQuickOrdering({
    items: testItems,
    onReorder: (newItems) => {
      // Callback opcional para quando a ordem muda
    },
    onItemMove: (itemId, fromPosition, toPosition, direction, affectedItems) => {
      triggerAnimation(itemId, fromPosition, toPosition, direction, affectedItems);
    }
  });

  return (
    <div className="p-4 max-w-md mx-auto">
      <Card className="escape-run-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Smartphone className="w-5 h-5" />
            Teste de Ordenação com Botões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item, index) => {
              const currentPosition = getItemPosition(item.id);
              const itemColor = getItemColor(item.id);
              
              return (
                <div 
                  key={item.id}
                  className={`backdrop-blur-sm p-3 rounded-lg border-2 transition-all duration-300 flex items-center gap-3 unique-color-item ${
                    isAnimating(item.id) ? 'item-reordering' : ''
                  }`}
                  style={{ 
                    background: getItemGradient(itemColor),
                    borderColor: getItemBorderColor(itemColor)
                  }}
                >

                  
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${itemColor} 0%, ${itemColor}80 100%)`
                    }}
                  >
                    <ArrowUpDown className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-sm text-gray-800">{item.title}</h5>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      className="text-white text-xs px-2 py-1"
                      style={{ 
                        backgroundColor: itemColor,
                        borderColor: itemColor
                      }}
                    >
                      {currentPosition}º
                    </Badge>
                    <QuickActions
                      onMoveUp={() => moveItem(item.id, 'up')}
                      onMoveDown={() => moveItem(item.id, 'down')}
                      canMoveUp={canMoveUp(item.id)}
                      canMoveDown={canMoveDown(item.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Instruções:</strong><br/>
              Use os botões ↑ e ↓ para reorganizar os itens. Clique no botão de cima para mover o item para cima, ou no botão de baixo para mover para baixo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
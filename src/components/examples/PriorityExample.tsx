import React from 'react';
import { PriorityList } from '@/components/ui/priority-list';
import type { Action, Pillar } from '@/lib/types';
import type { PriorityItem } from '@/hooks/use-priority-popover';

// Dados de exemplo
const examplePillar: Pillar = {
  id: '1',
  name: 'Financeiro',
  description: 'Estratégias para otimização financeira e crescimento sustentável',
  color: '#009954',
  icon: 'dollar-sign'
};

const exampleActions: Action[] = [
  {
    id: '1',
    pillar_id: '1',
    title: 'Reduzir custos operacionais',
    description: 'Identificar e eliminar gastos desnecessários',
    created_at: '2024-01-01'
  },
  {
    id: '2',
    pillar_id: '1',
    title: 'Aumentar receita',
    description: 'Desenvolver novas fontes de receita',
    created_at: '2024-01-01'
  },
  {
    id: '3',
    pillar_id: '1',
    title: 'Otimizar fluxo de caixa',
    description: 'Melhorar gestão de receitas e despesas',
    created_at: '2024-01-01'
  },
  {
    id: '4',
    pillar_id: '1',
    title: 'Investir em tecnologia',
    description: 'Modernizar sistemas e processos',
    created_at: '2024-01-01'
  }
];

export const PriorityExample: React.FC = () => {
  const handleComplete = (priorities: PriorityItem[]) => {
    console.log('Prioridades definidas:', priorities);
    alert(`Prioridades salvas! Total: ${priorities.length}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Exemplo: Sistema de Priorização com Popover
        </h1>
        
        <PriorityList
          pillar={examplePillar}
          actions={exampleActions}
          onComplete={handleComplete}
          isCompleted={false}
        />
      </div>
    </div>
  );
}; 
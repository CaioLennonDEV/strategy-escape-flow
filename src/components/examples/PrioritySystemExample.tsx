import React from 'react';
import { MissionConsole } from '../MissionConsole';
import type { Action, Pillar } from '@/lib/types';

// Dados de exemplo
const examplePillar: Pillar = {
  id: "1",
  name: "Estratégia de Mercado",
  description: "Definir posicionamento e abordagem de mercado",
  color: "#009954",
  icon: null
};

const exampleActions: Action[] = [
  {
    id: "1",
    title: "Análise de Concorrência",
    description: "Estudar principais concorrentes e suas estratégias",
    pillar_id: "1"
  },
  {
    id: "2",
    title: "Segmentação de Clientes",
    description: "Identificar e categorizar públicos-alvo",
    pillar_id: "1"
  },
  {
    id: "3",
    title: "Posicionamento da Marca",
    description: "Definir proposta de valor única",
    pillar_id: "1"
  },
  {
    id: "4",
    title: "Canais de Distribuição",
    description: "Mapear e otimizar canais de venda",
    pillar_id: "1"
  },
  {
    id: "5",
    title: "Estratégia de Preços",
    description: "Desenvolver política de precificação competitiva",
    pillar_id: "1"
  }
];

export const PrioritySystemExample: React.FC = () => {
  const handleComplete = () => {
    console.log('Priorização concluída!');
    alert('Sistema de priorização funcionando perfeitamente!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Sistema de Priorização com Drag & Drop
          </h1>
          <p className="text-white/70 text-lg mb-4">
            Arraste as ações da área inferior para a superior para definir prioridades
          </p>
          
          {/* Instruções de uso */}
          <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
            <h3 className="text-white font-semibold mb-2">Como usar:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/70">
              <div>
                <h4 className="text-unimed-primary font-medium mb-1">🎯 Drag & Drop</h4>
                <ul className="space-y-1">
                  <li>• Arraste itens entre as áreas</li>
                  <li>• Reordene dentro da área superior</li>
                  <li>• Clique no X para remover</li>
                </ul>
              </div>
              <div>
                <h4 className="text-unimed-primary font-medium mb-1">🔢 Ordenação Numérica</h4>
                <ul className="space-y-1">
                  <li>• Clique no número para editar</li>
                  <li>• Use os controles de ordenação</li>
                  <li>• Numeração automática (1,2,3...)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <MissionConsole
          pillar={examplePillar}
          actions={exampleActions}
          onComplete={handleComplete}
          className="bg-black/20 rounded-3xl p-6 backdrop-blur-sm"
        />
        
        <div className="mt-8 text-center text-white/60 text-sm">
          <p>
            💡 <strong>Dica:</strong> Experimente os diferentes métodos de ordenação no menu "Ordenar"
          </p>
          <p className="mt-2">
            🔒 Após concluir, as prioridades ficarão congeladas para evitar modificações acidentais
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrioritySystemExample; 
import React from 'react';
import { MissionConsole } from '../MissionConsole';
import type { Action, Pillar } from '@/lib/types';

// Dados de exemplo simples
const examplePillar: Pillar = {
  id: "1",
  name: "Teste de Priorização",
  description: "Sistema otimizado para mobile com numeração",
  color: "#009954",
  icon: null
};

const exampleActions: Action[] = [
  {
    id: "1",
    title: "Primeira Ação",
    description: "Esta é a primeira ação para testar o sistema",
    pillar_id: "1"
  },
  {
    id: "2",
    title: "Segunda Ação",
    description: "Esta é a segunda ação para testar o sistema",
    pillar_id: "1"
  },
  {
    id: "3",
    title: "Terceira Ação",
    description: "Esta é a terceira ação para testar o sistema",
    pillar_id: "1"
  },
  {
    id: "4",
    title: "Quarta Ação",
    description: "Esta é a quarta ação para testar o sistema",
    pillar_id: "1"
  },
  {
    id: "5",
    title: "Quinta Ação",
    description: "Esta é a quinta ação para testar o sistema",
    pillar_id: "1"
  }
];

export const SimplePriorityExample: React.FC = () => {
  const handleComplete = () => {
    console.log('Priorização concluída!');
    alert('Sistema funcionando! Prioridades salvas com numeração.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Sistema de Priorização Otimizado
          </h1>
          <p className="text-white/70 text-lg mb-4">
            Numeração automática e otimizado para mobile
          </p>
          
          {/* Instruções de uso */}
          <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
            <h3 className="text-white font-semibold mb-2">Como usar:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/70">
              <div>
                <h4 className="text-unimed-primary font-medium mb-1">🎯 Desktop</h4>
                <ul className="space-y-1">
                  <li>• Arraste itens para reorganizar</li>
                  <li>• Clique em "Adicionar" para priorizar</li>
                  <li>• Clique no X para remover</li>
                </ul>
              </div>
              <div>
                <h4 className="text-unimed-primary font-medium mb-1">📱 Mobile</h4>
                <ul className="space-y-1">
                  <li>• Toque e segure para arrastar</li>
                  <li>• Toque em "Adicionar" para priorizar</li>
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
            💡 <strong>Teste:</strong> Experimente no mobile e desktop
          </p>
          <p className="mt-2">
            🔢 <strong>Numeração:</strong> Posições 1, 2, 3... atualizadas automaticamente
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimplePriorityExample; 
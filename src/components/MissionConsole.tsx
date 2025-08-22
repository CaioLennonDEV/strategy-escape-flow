
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Zap, Target, CheckCircle2 } from 'lucide-react';
import type { Action, Pillar } from '@/lib/types';

interface MissionConsoleProps {
  pillar: Pillar;
  actions: Action[];
  onComplete?: () => void;
  isCompleted?: boolean;
  className?: string;
}

export const MissionConsole: React.FC<MissionConsoleProps> = ({
  pillar,
  actions,
  onComplete,
  isCompleted = false,
  className = ''
}) => {
  const [activeTab, setActiveTab] = React.useState('ranking');
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    // Simular progresso baseado na interação do usuário
    const timer = setTimeout(() => setProgress(isCompleted ? 100 : 45), 100);
    return () => clearTimeout(timer);
  }, [isCompleted]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header da Missão */}
      <Card className="mission-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: `${pillar.color}15` }}
              >
                <Target className="w-6 h-6" style={{ color: pillar.color }} />
              </div>
              <div>
                <CardTitle className="font-poppins text-xl">{pillar.name}</CardTitle>
                <p className="text-sm text-slate-600 mt-1">{pillar.description}</p>
              </div>
            </div>
            
            {isCompleted && (
              <Badge className="mission-status completed">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Concluído
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Progresso da Missão</span>
              <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Console de Priorização */}
      <Card className="mission-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 terminal-font text-lg">
            <Zap className="w-5 h-5 text-unimed-orange" />
            Console de Priorização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="ranking" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Ranking
              </TabsTrigger>
              <TabsTrigger value="points" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Pontos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ranking" className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-800 mb-3">Arraste para priorizar as ações:</h4>
                <div className="space-y-2">
                  {actions.map((action, index) => (
                    <div 
                      key={action.id}
                      className="bg-white p-3 rounded border-l-4 cursor-move hover:shadow-md transition-shadow"
                      style={{ borderLeftColor: pillar.color }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{action.title}</h5>
                          {action.description && (
                            <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                          )}
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {index + 1}º
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="points" className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-800 mb-3">Distribua 10 pontos entre as ações:</h4>
                <div className="space-y-3">
                  {actions.map((action) => (
                    <div key={action.id} className="bg-white p-3 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{action.title}</span>
                        <Badge variant="outline">3 pts</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="w-8 h-8 p-0">-</Button>
                        <Progress value={30} className="flex-1 h-2" />
                        <Button variant="outline" size="sm" className="w-8 h-8 p-0">+</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-700">Pontos restantes:</span>
                    <span className="font-bold text-blue-800">1/10</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button variant="outline">
              Abrir Confessionário
            </Button>
            
            <Button 
              onClick={onComplete}
              disabled={isCompleted}
              className="bg-unimed-primary hover:bg-unimed-primary/90"
            >
              {isCompleted ? 'Missão Concluída' : 'Concluir Pilar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MissionConsole;

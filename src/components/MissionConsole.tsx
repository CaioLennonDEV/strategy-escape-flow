
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Zap, Target, CheckCircle2, GripVertical, Minus, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
  const [actionRanking, setActionRanking] = React.useState<Action[]>(actions);
  const [pointsAllocation, setPointsAllocation] = React.useState<{ [key: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    setActionRanking(actions);
    // Inicializar pontos igualmente distribuídos
    const pointsPerAction = Math.floor(10 / actions.length);
    const initialPoints: { [key: string]: number } = {};
    actions.forEach((action, index) => {
      initialPoints[action.id] = index === 0 ? pointsPerAction + (10 % actions.length) : pointsPerAction;
    });
    setPointsAllocation(initialPoints);
  }, [actions]);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(isCompleted ? 100 : 45), 100);
    return () => clearTimeout(timer);
  }, [isCompleted]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex !== dropIndex) {
      const newRanking = [...actionRanking];
      const draggedAction = newRanking[dragIndex];
      newRanking.splice(dragIndex, 1);
      newRanking.splice(dropIndex, 0, draggedAction);
      setActionRanking(newRanking);
    }
  };

  const adjustPoints = (actionId: string, delta: number) => {
    const currentPoints = pointsAllocation[actionId] || 0;
    const newPoints = Math.max(0, Math.min(10, currentPoints + delta));
    const totalOtherPoints = Object.entries(pointsAllocation)
      .filter(([id]) => id !== actionId)
      .reduce((sum, [, points]) => sum + points, 0);
    
    if (totalOtherPoints + newPoints <= 10) {
      setPointsAllocation(prev => ({
        ...prev,
        [actionId]: newPoints
      }));
    }
  };

  const getTotalPoints = () => {
    return Object.values(pointsAllocation).reduce((sum, points) => sum + points, 0);
  };

  const getRemainingPoints = () => {
    return 10 - getTotalPoints();
  };

  const saveRanking = async () => {
    try {
      setIsSubmitting(true);
      const sessionId = localStorage.getItem('session_id');
      
      if (!sessionId) {
        toast({
          title: "Erro",
          description: "Sessão não encontrada",
          variant: "destructive",
        });
        return;
      }

      // Limpar rankings anteriores para este pilar
      await supabase
        .from('user_priorities')
        .delete()
        .eq('session_id', sessionId)
        .in('action_id', actions.map(a => a.id));

      // Salvar novo ranking
      const rankingData = actionRanking.map((action, index) => ({
        session_id: sessionId,
        action_id: action.id,
        rank: index + 1
      }));

      const { error: rankingError } = await supabase
        .from('user_priorities')
        .insert(rankingData);

      if (rankingError) {
        throw rankingError;
      }

      toast({
        title: "Sucesso",
        description: "Ranking salvo com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar ranking:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar ranking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const savePoints = async () => {
    try {
      setIsSubmitting(true);
      const sessionId = localStorage.getItem('session_id');
      
      if (!sessionId) {
        toast({
          title: "Erro",
          description: "Sessão não encontrada",
          variant: "destructive",
        });
        return;
      }

      // Limpar pontos anteriores para este pilar
      await supabase
        .from('user_points')
        .delete()
        .eq('session_id', sessionId)
        .in('action_id', actions.map(a => a.id));

      // Salvar nova distribuição de pontos
      const pointsData = Object.entries(pointsAllocation).map(([actionId, points]) => ({
        session_id: sessionId,
        action_id: actionId,
        answer: JSON.stringify({ points })
      }));

      const { error: pointsError } = await supabase
        .from('user_points')
        .insert(pointsData);

      if (pointsError) {
        throw pointsError;
      }

      toast({
        title: "Sucesso",
        description: "Pontos salvos com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar pontos:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar pontos",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  {actionRanking.map((action, index) => (
                    <div 
                      key={action.id}
                      className="bg-white p-3 rounded border-l-4 cursor-move hover:shadow-md transition-shadow flex items-center gap-3"
                      style={{ borderLeftColor: pillar.color }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <GripVertical className="w-4 h-4 text-slate-400" />
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{action.title}</h5>
                        {action.description && (
                          <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                        )}
                      </div>
                      <Badge variant="secondary">
                        {index + 1}º
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={saveRanking}
                    disabled={isSubmitting}
                    className="bg-unimed-primary hover:bg-unimed-primary/90"
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Ranking'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="points" className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-800 mb-3">Distribua 10 pontos entre as ações:</h4>
                <div className="space-y-3">
                  {actions.map((action) => {
                    const points = pointsAllocation[action.id] || 0;
                    return (
                      <div key={action.id} className="bg-white p-3 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{action.title}</span>
                          <Badge variant="outline">{points} pts</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-8 h-8 p-0"
                            onClick={() => adjustPoints(action.id, -1)}
                            disabled={points === 0}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Progress value={(points / 10) * 100} className="flex-1 h-2" />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-8 h-8 p-0"
                            onClick={() => adjustPoints(action.id, 1)}
                            disabled={getRemainingPoints() === 0 && points < 10}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-700">Pontos restantes:</span>
                    <span className="font-bold text-blue-800">{getRemainingPoints()}/10</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={savePoints}
                    disabled={isSubmitting || getRemainingPoints() !== 0}
                    className="bg-unimed-primary hover:bg-unimed-primary/90"
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Pontos'}
                  </Button>
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

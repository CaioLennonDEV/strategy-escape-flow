
'use client';

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SessionGuard } from '@/components/SessionGuard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Target, Timer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MissionConsole } from '@/components/MissionConsole';
import { DiaryScreen } from '@/components/ConfessionalScreen';
import { SimplePriorityDragDrop } from '@/components/SimplePriorityDragDrop';
import { usePriorityDragDrop } from '@/hooks/use-priority-drag-drop';
import type { Pillar, Action } from '@/lib/types';

const PillarPage = () => {
  const { pillarId } = useParams<{ pillarId: string }>();
  const navigate = useNavigate();
  const [pillar, setPillar] = React.useState<Pillar | null>(null);
  const [actions, setActions] = React.useState<Action[]>([]);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [showConfessional, setShowConfessional] = React.useState(false);
  const [topAction, setTopAction] = React.useState<Action | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showDragDrop, setShowDragDrop] = React.useState(false);
  
  // Hook para gerenciar prioridades com drag and drop
  const {
    priorities,
    hasPriorities,
    prioritiesCount,
    reorderPriorities,
    setInitialPriorities,
    clearPriorities
  } = usePriorityDragDrop({
    actions,
    pillarId: pillarId || '',
    onPrioritiesChange: (newPriorities) => {
      console.log('Prioridades atualizadas:', newPriorities);
    }
  });

  // Gerar posições fixas para as bolinhas flutuantes
  const floatingElements = React.useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${6 + Math.random() * 4}s`,
      width: `${4 + Math.random() * 8}px`,
      height: `${4 + Math.random() * 8}px`
    }));
  }, []);

  React.useEffect(() => {
    const loadPillarData = async () => {
      if (!pillarId) return;

      try {
        const sessionId = localStorage.getItem('session_id');
        
        if (!sessionId) {
          navigate('/');
          return;
        }

        // Buscar dados do pilar
        const { data: pillarData, error: pillarError } = await supabase
          .from('pillars')
          .select('*')
          .eq('id', pillarId)
          .maybeSingle();

        if (pillarError || !pillarData) {
          console.error('Erro ao buscar pilar:', pillarError);
          navigate('/pillars');
          return;
        }

        // Buscar ações do pilar
        const { data: actionsData, error: actionsError } = await supabase
          .from('actions')
          .select('*')
          .eq('pillar_id', pillarId)
          .order('title');

        if (actionsError) {
          console.error('Erro ao buscar ações:', actionsError);
        }

        // Verificar se o pilar está completo
        const { data: sessionPillar, error: sessionError } = await supabase
          .from('session_pillars')
          .select('is_completed')
          .eq('session_id', sessionId)
          .eq('pillar_id', pillarId)
          .maybeSingle();

        if (sessionError) {
          console.error('Erro ao buscar status do pilar:', sessionError);
        }

        // Buscar ranking para determinar a ação #1
        const { data: prioritiesData } = await supabase
          .from('user_priorities')
          .select('action_id, rank')
          .eq('session_id', sessionId)
          .in('action_id', actionsData?.map(a => a.id) || [])
          .order('rank');

        let firstAction = null;
        if (prioritiesData && prioritiesData.length > 0) {
          const topPriority = prioritiesData.find(p => p.rank === 1);
          if (topPriority && actionsData) {
            firstAction = actionsData.find(a => a.id === topPriority.action_id) || null;
          }
        }

        setPillar(pillarData);
        setActions(actionsData || []);
        setIsCompleted(sessionPillar?.is_completed || false);
        setTopAction(firstAction);
      } catch (error) {
        console.error('Erro ao carregar dados do pilar:', error);
        navigate('/pillars');
      } finally {
        setIsLoading(false);
      }
    };

    loadPillarData();
  }, [pillarId, navigate]);

  const handleBack = () => {
    navigate('/pillars');
  };

  const handleComplete = async () => {
    try {
      const sessionId = localStorage.getItem('session_id');
      
      if (!sessionId || !pillarId) return;

      // Marcar pilar como completo
      const { error } = await supabase
        .from('session_pillars')
        .upsert({
          session_id: sessionId,
          pillar_id: pillarId,
          is_completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao completar pilar:', error);
        return;
      }

      setIsCompleted(true);
      
      // Buscar a ação #1 do ranking para o diário
      const { data: prioritiesData } = await supabase
        .from('user_priorities')
        .select('action_id, rank')
        .eq('session_id', sessionId)
        .in('action_id', actions.map(a => a.id))
        .order('rank')
        .limit(1);

      if (prioritiesData && prioritiesData.length > 0) {
        const topPriorityAction = actions.find(a => a.id === prioritiesData[0].action_id);
        if (topPriorityAction) {
          setTopAction(topPriorityAction);
          setShowConfessional(true);
        }
      }
    } catch (error) {
      console.error('Erro ao completar pilar:', error);
    }
  };

  const handleConfessionalComplete = () => {
    navigate('/pillars');
  };

  if (isLoading) {
    return (
      <SessionGuard>
        <div className="min-h-screen escape-run-body relative overflow-hidden">
          {/* Floating Elements */}
          <div className="floating-elements">
            {floatingElements.map((element) => (
              <div
                key={element.id}
                className="floating-element"
                style={{
                  left: element.left,
                  top: element.top,
                  animationDelay: element.animationDelay,
                  animationDuration: element.animationDuration,
                  width: element.width,
                  height: element.height
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-center min-h-screen relative z-10">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-white/90 font-medium text-sm sm:text-base">Carregando pilar...</p>
            </div>
          </div>
        </div>
      </SessionGuard>
    );
  }

  if (!pillar) {
    return (
      <SessionGuard>
        <div className="min-h-screen escape-run-body relative overflow-hidden">
          {/* Floating Elements */}
          <div className="floating-elements">
            {floatingElements.map((element) => (
              <div
                key={element.id}
                className="floating-element"
                style={{
                  left: element.left,
                  top: element.top,
                  animationDelay: element.animationDelay,
                  animationDuration: element.animationDuration,
                  width: element.width,
                  height: element.height
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-center min-h-screen relative z-10">
            <div className="text-center space-y-3 sm:space-y-4">
              <p className="text-white/90 font-medium text-sm sm:text-base">Pilar não encontrado</p>
              <Button 
                onClick={handleBack} 
                className="text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 font-bold transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  boxShadow: '0 0 15px rgba(255, 255, 255, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Centro de Comando
              </Button>
            </div>
          </div>
        </div>
      </SessionGuard>
    );
  }

          // Se o diário deve ser mostrado
  if (showConfessional && topAction) {
    return (
      <SessionGuard>
        <DiaryScreen
          pillar={pillar}
          topAction={topAction}
          onComplete={handleConfessionalComplete}
        />
      </SessionGuard>
    );
  }

  return (
    <SessionGuard>
      <div className="min-h-screen escape-run-body relative overflow-hidden">
        {/* Floating Elements */}
        <div className="floating-elements">
          {floatingElements.map((element) => (
            <div
              key={element.id}
              className="floating-element"
              style={{
                left: element.left,
                top: element.top,
                animationDelay: element.animationDelay,
                animationDuration: element.animationDuration,
                width: element.width,
                height: element.height
              }}
            />
          ))}
        </div>

        <div className="p-3 sm:p-4 relative z-10">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 sm:gap-4 entrance-animation">
              <Button 
                onClick={handleBack} 
                className="text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 font-bold transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  boxShadow: '0 0 15px rgba(255, 255, 255, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Centro de Comando
              </Button>
            </div>

            {/* Mission Console */}
            <div className="entrance-animation stagger-1">
              <MissionConsole
                pillar={pillar}
                actions={actions}
                onComplete={handleComplete}
                isCompleted={isCompleted}
              />
            </div>

            {/* Drag and Drop Section */}
            {showDragDrop && (
              <div className="entrance-animation stagger-2">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">
                      Prioridades
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        onClick={setInitialPriorities}
                        className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Definir Todas
                      </Button>
                      <Button
                        onClick={clearPriorities}
                        className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700"
                      >
                        Limpar
                      </Button>
                    </div>
                  </div>
                  
                  {hasPriorities ? (
                    <SimplePriorityDragDrop
                      priorities={priorities}
                      onReorder={reorderPriorities}
                      className="bg-transparent"
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-white/60 text-sm mb-4">
                        Clique em "Definir Todas" para começar a organizar as prioridades
                      </p>
                      <Button
                        onClick={setInitialPriorities}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Definir Prioridades
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SessionGuard>
  );
};

export default PillarPage;

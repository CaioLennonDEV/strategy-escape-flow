
'use client';

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SessionGuard } from '@/components/SessionGuard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MissionConsole } from '@/components/MissionConsole';
import { ConfessionalScreen } from '@/components/ConfessionalScreen';
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
      
      // Buscar a ação #1 do ranking para o confessionário
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-unimed-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-600">Carregando pilar...</p>
          </div>
        </div>
      </SessionGuard>
    );
  }

  if (!pillar) {
    return (
      <SessionGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-slate-600">Pilar não encontrado</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Centro de Comando
            </Button>
          </div>
        </div>
      </SessionGuard>
    );
  }

  // Se o confessionário deve ser mostrado
  if (showConfessional && topAction) {
    return (
      <SessionGuard>
        <ConfessionalScreen
          pillar={pillar}
          topAction={topAction}
          onComplete={handleConfessionalComplete}
        />
      </SessionGuard>
    );
  }

  return (
    <SessionGuard>
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button onClick={handleBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>

          {/* Mission Console */}
          <MissionConsole
            pillar={pillar}
            actions={actions}
            onComplete={handleComplete}
            isCompleted={isCompleted}
          />
        </div>
      </div>
    </SessionGuard>
  );
};

export default PillarPage;

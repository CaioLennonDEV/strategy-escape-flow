
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PriorityListV4 } from '@/components/ui/priority-list-v4';
import type { Action, Pillar } from '@/lib/types';
import type { PriorityItem } from '@/hooks/use-priority-v4';

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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handlePrioritiesComplete = async (priorities: PriorityItem[]) => {
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

      // Verificar se todas as ações foram priorizadas
      if (priorities.length !== actions.length) {
        toast({
          title: "Atenção",
          description: "Todas as ações devem ser priorizadas antes de concluir",
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
      const rankingData = priorities.map((priority) => ({
        session_id: sessionId,
        action_id: priority.actionId,
        rank: priority.position
      }));

      const { error: rankingError } = await supabase
        .from('user_priorities')
        .insert(rankingData);

      if (rankingError) {
        throw rankingError;
      }

      toast({
        title: "Sucesso",
        description: "Prioridades salvas com sucesso!",
        variant: "default",
      });

      // Chamar onComplete para finalizar o pilar
      if (onComplete) {
        onComplete();
      }

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

  return (
    <PriorityListV4
      pillar={pillar}
      actions={actions}
      onComplete={handlePrioritiesComplete}
      isCompleted={isCompleted}
      className={className}
    />
  );
};

export default MissionConsole;

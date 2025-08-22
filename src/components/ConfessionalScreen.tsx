
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Pillar, Action } from '@/lib/types';

interface ConfessionalScreenProps {
  pillar: Pillar;
  topAction: Action;
  onComplete: () => void;
}

export const ConfessionalScreen: React.FC<ConfessionalScreenProps> = ({
  pillar,
  topAction,
  onComplete
}) => {
  const [confession, setConfession] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!confession.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, digite sua justificativa estratégica",
        variant: "destructive",
      });
      return;
    }

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

      // Salvar confessionário
      const { error } = await supabase
        .from('confessionals')
        .insert({
          session_id: sessionId,
          pillar_id: pillar.id,
          answer: JSON.stringify({
            topAction: topAction.title,
            confession: confession.trim(),
            timestamp: new Date().toISOString()
          })
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Confessionário finalizado com sucesso!",
      });

      onComplete();

    } catch (error) {
      console.error('Erro ao salvar confessionário:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar confessionário",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Suas Escolhas */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-yellow-400">
              <Crown className="w-6 h-6" />
              Suas Escolhas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-blue-400 text-sm mb-1">Pilar Escolhido:</p>
              <p className="text-white font-medium">{pillar.name}</p>
              <p className="text-slate-400 text-sm mt-1">{pillar.description}</p>
            </div>
            
            <div>
              <p className="text-blue-400 text-sm mb-1">Prioridade #1:</p>
              <p className="text-white font-medium">{topAction.title}</p>
              {topAction.description && (
                <p className="text-slate-400 text-sm mt-1">{topAction.description}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pergunta do Confessionário */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-yellow-400">
              <Lightbulb className="w-6 h-6" />
              Pergunta do Confessionário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-white">
              <p className="mb-2">
                "Por que você colocou <span className="text-yellow-500 font-medium">'{topAction.title}'</span> em 1º lugar?"
              </p>
              <p className="text-slate-400 text-sm">
                Explique seu raciocínio estratégico. Que fatores considerou? Que impacto espera?
              </p>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Digite aqui sua justificativa estratégica..."
                value={confession}
                onChange={(e) => setConfession(e.target.value)}
                className="min-h-[200px] bg-slate-700 border-slate-600 text-white placeholder-slate-400 resize-none"
                maxLength={500}
              />
              <div className="text-right text-sm text-slate-400">
                {confession.length}/500 caracteres
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !confession.trim()}
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-medium px-8"
              >
                {isSubmitting ? 'Enviando...' : 'Finalizar Confessionário'}
              </Button>
            </div>

            <div className="text-center text-slate-400 text-sm mt-4">
              Suas respostas ajudarão a construir o futuro estratégico da Unimed
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfessionalScreen;

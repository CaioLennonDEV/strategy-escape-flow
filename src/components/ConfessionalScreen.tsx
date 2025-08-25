
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Crown, Zap, Star, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Pillar, Action } from '@/lib/types';

interface DiaryScreenProps {
  pillar: Pillar;
  topAction: Action;
  onComplete: () => void;
}

export const DiaryScreen: React.FC<DiaryScreenProps> = ({
  pillar,
  topAction,
  onComplete
}) => {
  const [confession, setConfession] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  // Gerar posições fixas para as bolinhas flutuantes
  const floatingElements = React.useMemo(() => {
    return [...Array(14)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${6 + Math.random() * 4}s`,
      width: `${4 + Math.random() * 8}px`,
      height: `${4 + Math.random() * 8}px`
    }));
  }, []);

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

      // Salvar diário
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
        description: "Diário finalizado com sucesso!",
      });

      onComplete();

    } catch (error) {
              console.error('Erro ao salvar diário:', error);
      toast({
        title: "Erro",
                  description: "Erro ao salvar diário",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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


      <div className="max-w-4xl mx-auto space-y-6 p-4 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 entrance-animation">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-unimed-primary to-unimed-light text-white text-3xl mb-6 pulse-glow">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="font-poppins font-bold text-4xl md:text-5xl text-white text-glow">
                            DIÁRIO ESTRATÉGICO
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
            Compartilhe sua justificativa para a escolha da ação prioritária
          </p>
        </div>

        {/* Suas Escolhas */}
        <Card className="escape-run-card entrance-animation stagger-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Crown className="w-6 h-6 text-unimed-orange" />
              SUAS ESCOLHAS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-unimed-orange/10 to-unimed-primary/10 border border-unimed-orange/20">
              <p className="text-unimed-orange text-sm font-semibold mb-1">Priorindade úmero 1:</p>
              <p className="text-white font-bold text-lg">{topAction.title}</p>
              {topAction.description && (
                <p className="text-white/80 text-sm mt-1">{topAction.description}</p>
              )}
            </div>
          </CardContent>
        </Card>

                    {/* Pergunta do Diário */}
        <Card className="escape-run-card entrance-animation stagger-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg md:text-xl">
              <Crown className="w-6 h-6 text-unimed-orange" />
              <span className="flex flex-wrap items-center gap-x-1 w-full text-base md:text-lg">
                Por que você colocou&nbsp;
                <span className="text-unimed-orange font-bold">{topAction.title}</span>
                &nbsp;em 1º lugar?
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-unimed-primary/5 to-unimed-light/5 border border-unimed-primary/20">
              <p className="text-white/80 text-xs md:text-sm">
                Explique seu raciocínio estratégico. Que fatores considerou? Que impacto espera?
              </p>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Digite aqui sua justificativa estratégica..."
                value={confession}
                onChange={(e) => setConfession(e.target.value)}
                className="escape-run-input min-h-[100px] resize-none"
                maxLength={500}
              />
              <div className="text-right text-sm text-white/60 font-medium">
                {confession.length}/500 caracteres
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !confession.trim()}
                className="escape-run-button"
              >
                {isSubmitting ? 'Enviando...' : 'Finalizar Diário'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiaryScreen;

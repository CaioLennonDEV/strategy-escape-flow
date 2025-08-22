
'use client';

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SessionGuard } from '@/components/SessionGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Pillar, Action } from '@/lib/types';

const PillarPage = () => {
  const { pillarId } = useParams<{ pillarId: string }>();
  const navigate = useNavigate();
  const [pillar, setPillar] = React.useState<Pillar | null>(null);
  const [actions, setActions] = React.useState<Action[]>([]);
  const [isCompleted, setIsCompleted] = React.useState(false);
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

        setPillar(pillarData);
        setActions(actionsData || []);
        setIsCompleted(sessionPillar?.is_completed || false);
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
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${pillar.color}15` }}
                >
                  {pillar.icon === 'dollar-sign' && '💰'}
                  {pillar.icon === 'users' && '👥'}
                  {pillar.icon === 'settings' && '⚙️'}
                  {pillar.icon === 'trending-up' && '📈'}
                  {!['dollar-sign', 'users', 'settings', 'trending-up'].includes(pillar.icon || '') && '🔷'}
                </div>
                <div>
                  <h1 className="font-poppins font-bold text-2xl md:text-3xl text-slate-800">
                    {pillar.name}
                  </h1>
                  {pillar.description && (
                    <p className="text-slate-600 mt-1">
                      {pillar.description}
                    </p>
                  )}
                </div>
                {isCompleted && (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                )}
              </div>
            </div>
          </div>

          {/* Status Card */}
          <Card className="mission-card">
            <CardHeader>
              <CardTitle>Status do Pilar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">
                    {isCompleted ? 'Pilar concluído' : 'Pilar em andamento'}
                  </p>
                  <p className="text-lg font-semibold text-slate-800">
                    {actions.length} {actions.length === 1 ? 'ação disponível' : 'ações disponíveis'}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-yellow-500'}`} />
              </div>
            </CardContent>
          </Card>

          {/* Actions List */}
          {actions.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-poppins font-semibold text-xl text-slate-800">
                Ações Disponíveis
              </h2>
              <div className="grid gap-4">
                {actions.map((action) => (
                  <Card key={action.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg text-slate-800">
                          {action.title}
                        </h3>
                        {action.description && (
                          <p className="text-slate-600">
                            {action.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {actions.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-slate-600">
                  Nenhuma ação disponível para este pilar no momento.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SessionGuard>
  );
};

export default PillarPage;

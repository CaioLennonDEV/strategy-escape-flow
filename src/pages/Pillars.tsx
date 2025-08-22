
'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionGuard } from '@/components/SessionGuard';
import { DoorCard } from '@/components/DoorCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Clock, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Pillar } from '@/lib/types';

const PillarsPage = () => {
  const navigate = useNavigate();
  const [pillars, setPillars] = React.useState<(Pillar & { isCompleted: boolean })[]>([]);
  const [nickname, setNickname] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadPillars = async () => {
      try {
        const sessionId = localStorage.getItem('session_id');
        
        if (!sessionId) {
          navigate('/');
          return;
        }

        // Buscar pilares
        const { data: pillarsData, error: pillarsError } = await supabase
          .from('pillars')
          .select('*')
          .order('name');

        if (pillarsError) {
          console.error('Erro ao buscar pilares:', pillarsError);
          return;
        }

        // Buscar status de completamento dos pilares para esta sessão
        const { data: sessionPillars, error: sessionError } = await supabase
          .from('session_pillars')
          .select('pillar_id, is_completed, completed_at')
          .eq('session_id', sessionId);

        if (sessionError) {
          console.error('Erro ao buscar status dos pilares:', sessionError);
        }

        // Combinar dados
        const pillarsWithStatus = pillarsData.map(pillar => {
          const status = sessionPillars?.find(sp => sp.pillar_id === pillar.id);
          return {
            ...pillar,
            isCompleted: status?.is_completed || false,
            completedAt: status?.completed_at
          };
        });

        setPillars(pillarsWithStatus);
      } catch (error) {
        console.error('Erro ao carregar pilares:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Carregar nickname do localStorage
    const savedNickname = localStorage.getItem('nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }

    loadPillars();
  }, [navigate]);

  const handlePillarClick = (pillarId: string) => {
    navigate(`/pilar/${pillarId}`);
  };

  const completedCount = pillars.filter(p => p.isCompleted).length;
  const progressPercentage = pillars.length > 0 ? (completedCount / pillars.length) * 100 : 0;

  if (isLoading) {
    return (
      <SessionGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-unimed-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-600">Carregando centro de comando...</p>
          </div>
        </div>
      </SessionGuard>
    );
  }

  return (
    <SessionGuard>
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header da Missão */}
          <div className="text-center space-y-4">
            <h1 className="font-poppins font-bold text-3xl md:text-4xl text-slate-800">
              Centro de Comando
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Bem-vindo à sua jornada estratégica, <span className="font-semibold text-unimed-primary">{nickname}</span>. 
              Escolha um pilar para começar sua missão.
            </p>
          </div>

          {/* Status Dashboard */}
          <Card className="mission-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-unimed-primary" />
                Status da Missão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Progresso Geral</span>
                    <span className="text-sm text-slate-500">{completedCount}/{pillars.length}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <p className="text-xs text-slate-600">
                    {completedCount === pillars.length 
                      ? 'Missão concluída! 🎉' 
                      : `${pillars.length - completedCount} pilares restantes`
                    }
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-unimed-light/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-unimed-light" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Agente</p>
                    <p className="text-xs text-slate-600">{nickname}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-unimed-orange/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-unimed-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Sessão Ativa</p>
                    <p className="text-xs text-slate-600">
                      {new Date().toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid de Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, index) => (
              <div 
                key={pillar.id} 
                className={`entrance-animation stagger-${index + 1}`}
              >
                <DoorCard
                  pillar={pillar}
                  isCompleted={pillar.isCompleted}
                  onClick={() => handlePillarClick(pillar.id)}
                />
              </div>
            ))}
          </div>

          {/* Ações Rápidas */}
          {completedCount === pillars.length && (
            <Card className="mission-card border-green-200 bg-green-50">
              <CardContent className="text-center py-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-lg text-green-800">
                      Missão Concluída!
                    </h3>
                    <p className="text-green-700 mt-2">
                      Parabéns! Você completou todos os pilares da jornada estratégica.
                    </p>
                  </div>
                  <Badge className="mission-status completed">
                    Todas as etapas concluídas
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SessionGuard>
  );
};

export default PillarsPage;

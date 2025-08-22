
'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionGuard } from '@/components/SessionGuard';
import { DoorCard } from '@/components/DoorCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, Clock, Target, Trophy, Zap, Star, Timer, Award } from 'lucide-react';
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

  const handleViewAchievement = () => {
    navigate('/achievement');
  };

  const completedCount = pillars.filter(p => p.isCompleted).length;
  const progressPercentage = pillars.length > 0 ? (completedCount / pillars.length) * 100 : 0;
  const allCompleted = completedCount === pillars.length && pillars.length > 0;

  if (isLoading) {
    return (
      <SessionGuard>
        <div className="min-h-screen escape-run-body flex items-center justify-center">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-white/90 font-medium text-sm sm:text-base">Carregando centro de comando...</p>
          </div>
        </div>
      </SessionGuard>
    );
  }

  return (
    <SessionGuard>
      <div className="min-h-screen escape-run-body relative overflow-hidden">
        {/* Floating Elements */}
        <div className="floating-elements">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="floating-element"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`
              }}
            />
          ))}
        </div>

        <div className="p-3 sm:p-4 relative z-10">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
            {/* Header da Missão */}
            <div className="mission-header">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-unimed-primary to-unimed-light text-white text-2xl sm:text-3xl mb-4 sm:mb-6 mission-pulse">
                <Zap className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <h1 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white text-glow leading-tight">
                  CENTRO DE COMANDO
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
                  Bem-vindo à sua jornada estratégica, <span className="font-bold text-unimed-light">{nickname}</span>. 
                  Escolha um pilar para começar sua missão.
                </p>
              </div>
            </div>

            {/* Grid de Pilares */}
            <div className="space-y-6 sm:space-y-8">

              {/* Grid Responsivo */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
            </div>

            {/* Ações Rápidas - Missão Concluída */}
            {allCompleted && (
              <div className="entrance-animation stagger-5">
                <Card className="escape-run-card border-2 border-unimed-primary/50 bg-gradient-to-br from-unimed-primary/5 to-unimed-light/5">
                  <CardContent className="text-center py-8 sm:py-10 md:py-12">
                    <div className="space-y-6 sm:space-y-8">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-unimed-primary to-unimed-light flex items-center justify-center mx-auto pulse-glow">
                        <Trophy className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
                      </div>
                      <div>
                        <h2 className="font-poppins font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-3 sm:mb-4 leading-tight">
                          🎉 MISSÃO CONCLUÍDA!
                        </h2>
                        <p className="text-white/90 text-base sm:text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                          Parabéns! Você completou todos os pilares da jornada estratégica.
                        </p>
                      </div>
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <Button
                            onClick={handleViewAchievement}
                            className="escape-run-button text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 font-bold"
                          >
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3" />
                            VER MINHA CONQUISTA
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </SessionGuard>
  );
};

export default PillarsPage;

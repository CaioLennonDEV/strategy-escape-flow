
'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Zap } from 'lucide-react';

interface SessionGuardProps {
  children: React.ReactNode;
  requireSession?: boolean;
}

export const SessionGuard: React.FC<SessionGuardProps> = ({
  children,
  requireSession = true
}) => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = React.useState(true);
  const [hasSession, setHasSession] = React.useState(false);

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionId = localStorage.getItem('session_id');
        
        if (!sessionId) {
          setHasSession(false);
          if (requireSession) {
            navigate('/');
            return;
          }
        } else {
          // Verificar se a sessão existe no Supabase
          const { data: session, error } = await supabase
            .from('sessions')
            .select('id, nickname, meeting_id')
            .eq('id', sessionId)
            .maybeSingle();

          const isValid = !error && session !== null;
          setHasSession(isValid);
          
          if (requireSession && !isValid) {
            localStorage.removeItem('session_id');
            localStorage.removeItem('nickname');
            navigate('/');
            return;
          }
          
          if (!requireSession && isValid) {
            // Se está na página inicial mas já tem sessão, redirecionar para o dashboard
            const nickname = localStorage.getItem('nickname');
            if (nickname) {
              navigate('/pillars');
              return;
            }
          }
        }
      } catch (error) {
        console.error('Erro ao validar sessão:', error);
        if (requireSession) {
          navigate('/');
        }
        setHasSession(false);
      } finally {
        setIsValidating(false);
      }
    };

    checkSession();
  }, [requireSession, navigate]);

  if (isValidating) {
    return (
      <div className="min-h-screen escape-run-body relative overflow-hidden">
        {/* Floating Elements */}
        <div className="floating-elements">
          {[...Array(10)].map((_, i) => (
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

        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="text-center space-y-6 entrance-animation">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-unimed-primary to-unimed-light text-white text-3xl mb-6 mission-pulse">
              <Shield className="w-10 h-10" />
            </div>
            <div className="space-y-4">
              <h2 className="font-poppins font-bold text-2xl md:text-3xl text-white text-glow">
                🔐 VALIDANDO ACESSO
              </h2>
              <p className="text-white/90 font-medium">Verificando credenciais da missão...</p>
            </div>
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (requireSession && !hasSession) {
    return null; // Redirecionamento já aconteceu
  }

  if (!requireSession && hasSession) {
    return null; // Redirecionamento já aconteceu
  }

  return <>{children}</>;
};

export default SessionGuard;

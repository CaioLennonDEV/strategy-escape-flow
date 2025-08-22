
'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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

          const isValid = !error && session;
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-unimed-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600">Validando acesso à missão...</p>
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

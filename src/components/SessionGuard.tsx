
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface SessionGuardProps {
  children: React.ReactNode;
  requireSession?: boolean;
}

export const SessionGuard: React.FC<SessionGuardProps> = ({
  children,
  requireSession = true
}) => {
  const router = useRouter();
  const [isValidating, setIsValidating] = React.useState(true);
  const [hasSession, setHasSession] = React.useState(false);

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/session/validate');
        const isValid = response.ok;
        
        setHasSession(isValid);
        
        if (requireSession && !isValid) {
          router.push('/');
          return;
        }
        
        if (!requireSession && isValid) {
          // Se está na página inicial mas já tem sessão, redirecionar para o dashboard
          const nickname = localStorage.getItem('nickname');
          if (nickname) {
            router.push('/pillars');
            return;
          }
        }
      } catch (error) {
        console.error('Erro ao validar sessão:', error);
        if (requireSession) {
          router.push('/');
        }
      } finally {
        setIsValidating(false);
      }
    };

    checkSession();
  }, [requireSession, router]);

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

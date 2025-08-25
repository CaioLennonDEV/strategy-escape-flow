
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, Shield, Users, Target, Zap, Trophy, Star, Timer } from 'lucide-react';
import { SessionGuard } from '@/components/SessionGuard';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { LoginForm } from '@/lib/types';
import { formatSessionCode, formatNickname } from '@/lib/formatters';

const Index = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<LoginForm>({
    code: '',
    nickname: ''
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Gerar posições fixas para as bolinhas flutuantes
  const floatingElements = React.useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${6 + Math.random() * 4}s`,
      width: `${4 + Math.random() * 8}px`,
      height: `${4 + Math.random() * 8}px`
    }));
  }, []);

  const handleInputChange = (field: keyof LoginForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'code' ? formatSessionCode(value) : formatNickname(value)
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.nickname) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Verificar se o código existe e está ativo
      const { data: meetingCode, error: codeError } = await supabase
        .from('meeting_codes')
        .select('meeting_id, is_active')
        .eq('code', formData.code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (codeError || !meetingCode) {
        setError('Código inválido ou inativo');
        return;
      }

      // Criar nova sessão
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          meeting_id: meetingCode.meeting_id,
          code: formData.code.toUpperCase(),
          nickname: formData.nickname.trim()
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Erro ao criar sessão:', sessionError);
        setError('Erro interno do servidor');
        return;
      }

      // Salvar dados no localStorage
      localStorage.setItem('session_id', session.id);
      localStorage.setItem('nickname', formData.nickname);
      
      // Redirecionar para o grid de pilares
      navigate('/pillars');

    } catch (err) {
      console.error('Erro no login:', err);
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionGuard requireSession={false}>
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

        <div className="flex items-center justify-center p-3 sm:p-4 min-h-screen">
          <div className="w-full max-w-6xl">
            {/* Hero Section */}
            <div className="mission-header">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-unimed-primary to-unimed-light text-white text-2xl sm:text-3xl mb-4 sm:mb-6 mission-pulse">
                <Zap className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 sm:mb-4 font-orbitron tracking-wider entrance-animation">
                  MISSÃO ESTRATÉGICA
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
                  Jornada da Estratégia • Missão Colaborativa
                </p>
              </div>
            </div>
            <div className="h-8 sm:h-10" />

            {/* Main Content Grid */}
            <div className="grid max-w-3xl mx-auto">
              {/* Login Form */}
              <div className="md:col-span-2 entrance-animation stagger-1">
                <Card className="escape-run-card">
                  <CardHeader className="text-center pb-4 sm:pb-6">
                    <CardTitle className="font-poppins text-xl sm:text-2xl md:text-3xl text-white leading-tight">
                      🚀 INICIAR MISSÃO
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                      Digite o codigo da sala e seu nome para acessar a jornada estratégica
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      {error && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-500/10 to-red-600/10 border-2 border-red-400/30 backdrop-blur-sm text-red-100 text-sm sm:text-base font-medium shadow-lg shadow-red-500/20">
                          <div className="flex items-center gap-3">
                            <span className="leading-relaxed">Ops! Aconteceu um erro: {error}</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="code" className="text-xs sm:text-sm font-semibold text-white/90">
                          🔑 CÓDIGO DE ACESSO
                        </Label>
                        <Input
                          id="code"
                          type="text"
                          placeholder="Digite o código da missão"
                          value={formData.code}
                          onChange={handleInputChange('code')}
                          className="escape-run-input terminal-font text-center text-base sm:text-lg tracking-wider h-12 sm:h-14"
                          maxLength={10}
                        />
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="nickname" className="text-xs sm:text-sm font-semibold text-white/90">
                          👤 NOME DO AGENTE
                        </Label>
                        <Input
                          id="nickname"
                          type="text"
                          placeholder="Como podemos te chamar?"
                          value={formData.nickname}
                          onChange={handleInputChange('nickname')}
                          className="escape-run-input terminal-font text-center text-base sm:text-lg tracking-wider h-12 sm:h-14"
                          maxLength={30}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading || !formData.code || !formData.nickname}
                        className="escape-run-button w-full h-12 sm:h-14 text-white font-bold text-sm sm:text-base md:text-lg"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>ACESSANDO...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>ENTRAR NA JORNADA</span>
                          </div>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>


            </div>
          </div>
        </div>
      </div>
    </SessionGuard>
  );
};

export default Index;

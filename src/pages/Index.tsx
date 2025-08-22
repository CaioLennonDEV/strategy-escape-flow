
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Rocket, Shield, Users, Target } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-unimed-primary to-unimed-light text-white text-3xl mb-6 animate-glow-pulse">
              <Rocket className="w-10 h-10" />
            </div>
            
            <div className="space-y-4">
              <h1 className="font-poppins font-bold text-4xl md:text-5xl text-slate-800 text-glow">
                Jornada da Estratégia
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Uma experiência colaborativa e futurista para definir as prioridades estratégicas da sua equipe
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 backdrop-blur">
                <Shield className="w-5 h-5 text-unimed-primary" />
                <span className="text-sm font-medium text-slate-700">Ambiente Seguro</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 backdrop-blur">
                <Users className="w-5 h-5 text-unimed-light" />
                <span className="text-sm font-medium text-slate-700">Colaborativo</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 backdrop-blur">
                <Target className="w-5 h-5 text-unimed-orange" />
                <span className="text-sm font-medium text-slate-700">Resultados Práticos</span>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <Card className="mission-card max-w-md mx-auto">
            <CardHeader className="text-center pb-6">
              <CardTitle className="font-poppins text-2xl">Iniciar Missão</CardTitle>
              <p className="text-sm text-slate-600">
                Insira suas credenciais para acessar a jornada estratégica
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-medium">
                    Código de Acesso
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Digite o código da missão"
                    value={formData.code}
                    onChange={handleInputChange('code')}
                    className="terminal-font text-center text-lg tracking-wider"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-sm font-medium">
                    Nome do Agente
                  </Label>
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="Como você quer ser chamado?"
                    value={formData.nickname}
                    onChange={handleInputChange('nickname')}
                    maxLength={30}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !formData.code || !formData.nickname}
                  className="w-full bg-unimed-primary hover:bg-unimed-primary/90 text-white font-medium py-3 text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Acessando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      Entrar na Jornada
                    </div>
                  )}
                </Button>
              </form>

              {/* Info Footer */}
              <div className="mt-6 pt-4 border-t text-center">
                <Badge variant="outline" className="text-xs">
                  Sistema Seguro • Unimed
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-slate-500">
            <p>Desenvolvido com tecnologia de ponta para a experiência estratégica Unimed</p>
          </div>
        </div>
      </div>
    </SessionGuard>
  );
};

export default Index;

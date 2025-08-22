
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 401 }
      );
    }

    // Buscar pilares
    const { data: pillars, error: pillarsError } = await supabase
      .from('pillars')
      .select('*')
      .order('name');

    if (pillarsError) {
      console.error('Erro ao buscar pilares:', pillarsError);
      return NextResponse.json(
        { error: 'Erro ao carregar pilares' },
        { status: 500 }
      );
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
    const pillarsWithStatus = pillars.map(pillar => {
      const status = sessionPillars?.find(sp => sp.pillar_id === pillar.id);
      return {
        ...pillar,
        isCompleted: status?.is_completed || false,
        completedAt: status?.completed_at
      };
    });

    return NextResponse.json({
      pillars: pillarsWithStatus
    });

  } catch (error) {
    console.error('Erro na rota /api/pillars:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

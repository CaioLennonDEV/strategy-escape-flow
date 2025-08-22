
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

    // Verificar se a sessão existe
    const { data: session, error } = await supabase
      .from('sessions')
      .select('id, nickname, meeting_id')
      .eq('id', sessionId)
      .single();

    if (error || !session) {
      return NextResponse.json(
        { error: 'Sessão inválida' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      sessionId: session.id,
      nickname: session.nickname,
      meetingId: session.meeting_id
    });

  } catch (error) {
    console.error('Erro ao validar sessão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

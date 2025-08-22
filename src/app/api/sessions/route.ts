
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { code, nickname } = await request.json();

    if (!code || !nickname) {
      return NextResponse.json(
        { error: 'Código e nickname são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o código existe e está ativo
    const { data: meetingCode, error: codeError } = await supabase
      .from('meeting_codes')
      .select('meeting_id, is_active')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (codeError || !meetingCode) {
      return NextResponse.json(
        { error: 'Código inválido ou inativo' },
        { status: 404 }
      );
    }

    // Criar nova sessão
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        meeting_id: meetingCode.meeting_id,
        code: code.toUpperCase(),
        nickname: nickname.trim()
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Erro ao criar sessão:', sessionError);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }

    // Configurar cookie httpOnly
    const cookieStore = cookies();
    cookieStore.set('session_id', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 horas
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      meetingId: meetingCode.meeting_id
    });

  } catch (error) {
    console.error('Erro na rota /api/sessions:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

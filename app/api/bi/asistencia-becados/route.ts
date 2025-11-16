import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AsistenciaBecados } from '@/lib/api/types-bi';

/**
 * GET /api/bi/asistencia-becados
 * Consulta la vista vw_asistencia_becados con filtros opcionales de fecha
 * Query params: ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const desde = searchParams.get('desde');
    const hasta = searchParams.get('hasta');

    const supabase = createServerSupabaseClient();
    
    let query = supabase
      .from('vw_asistencia_becados')
      .select('*')
      .order('fecha', { ascending: true });

    // Aplicar filtros de fecha si se proporcionan
    if (desde) {
      query = query.gte('fecha', desde);
    }
    if (hasta) {
      query = query.lte('fecha', hasta);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error consultando vw_asistencia_becados:', error);
      return NextResponse.json(
        { error: 'Error al consultar datos de asistencia de becados' },
        { status: 500 }
      );
    }

    return NextResponse.json(data as AsistenciaBecados[]);
  } catch (error) {
    console.error('Error inesperado en /api/bi/asistencia-becados:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

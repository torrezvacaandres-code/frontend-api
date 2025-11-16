import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { RotacionInsumos } from '@/lib/api/types-bi';

/**
 * GET /api/bi/rotacion-insumos
 * Consulta la vista vw_rotacion_insumos con filtros opcionales de fecha
 * Query params: ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const desde = searchParams.get('desde');
    const hasta = searchParams.get('hasta');

    const supabase = createServerSupabaseClient();
    
    let query = supabase
      .from('vw_rotacion_insumos')
      .select('*')
      .order('mes', { ascending: true });

    // Aplicar filtros de fecha si se proporcionan
    if (desde) {
      query = query.gte('mes', desde);
    }
    if (hasta) {
      query = query.lte('mes', hasta);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error consultando vw_rotacion_insumos:', error);
      return NextResponse.json(
        { error: 'Error al consultar datos de rotación de insumos' },
        { status: 500 }
      );
    }

    return NextResponse.json(data as RotacionInsumos[]);
  } catch (error) {
    console.error('Error inesperado en /api/bi/rotacion-insumos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

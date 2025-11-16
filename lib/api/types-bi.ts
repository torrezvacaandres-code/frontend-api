/**
 * Tipos TypeScript para las vistas SQL de BI en Supabase
 */

export interface VentasDiarias {
  fecha: string; // date
  tipo_comida: string; // "Almuerzo", "Cena", etc.
  raciones_servidas: number; // bigint
  raciones_becados: number; // bigint
  raciones_regulares: number; // bigint
  ingresos_total: number; // numeric
}

export interface CostoPorRacion {
  fecha: string; // date
  tipo_comida: string;
  raciones_servidas: number; // bigint
  costo_promedio_insumo: number; // numeric
  costo_total_insumos: number; // numeric
}

export interface RotacionInsumos {
  id: number; // bigint
  nombre: string;
  unidad: string; // "kg", "litro", etc.
  mes: string; // timestamp with time zone
  total_entrada: number; // numeric
  total_salida: number; // numeric
  variacion_neta: number; // numeric
}

export interface AsistenciaBecados {
  fecha: string; // date
  tipo_comida: string;
  raciones_becados: number; // bigint
  becas_activas: number; // bigint
}

/**
 * Parámetros para filtros de fecha
 */
export interface DateRangeParams {
  desde?: string; // YYYY-MM-DD
  hasta?: string; // YYYY-MM-DD
}

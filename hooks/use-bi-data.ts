'use client';

import { useQuery } from '@tanstack/react-query';
import type {
  VentasDiarias,
  CostoPorRacion,
  RotacionInsumos,
  AsistenciaBecados,
  DateRangeParams,
} from '@/lib/api/types-bi';

/**
 * Hook para obtener datos de ventas diarias
 */
export function useVentasDiarias(params: DateRangeParams = {}) {
  return useQuery<VentasDiarias[]>({
    queryKey: ['ventas-diarias', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.desde) queryParams.set('desde', params.desde);
      if (params.hasta) queryParams.set('hasta', params.hasta);

      const response = await fetch(`/api/bi/ventas-diarias?${queryParams}`);
      if (!response.ok) {
        throw new Error('Error al obtener datos de ventas diarias');
      }
      return response.json();
    },
  });
}

/**
 * Hook para obtener datos de costos por ración
 */
export function useCostos(params: DateRangeParams = {}) {
  return useQuery<CostoPorRacion[]>({
    queryKey: ['costos', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.desde) queryParams.set('desde', params.desde);
      if (params.hasta) queryParams.set('hasta', params.hasta);

      const response = await fetch(`/api/bi/costos?${queryParams}`);
      if (!response.ok) {
        throw new Error('Error al obtener datos de costos');
      }
      return response.json();
    },
  });
}

/**
 * Hook para obtener datos de rotación de insumos
 */
export function useRotacionInsumos(params: DateRangeParams = {}) {
  return useQuery<RotacionInsumos[]>({
    queryKey: ['rotacion-insumos', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.desde) queryParams.set('desde', params.desde);
      if (params.hasta) queryParams.set('hasta', params.hasta);

      const response = await fetch(`/api/bi/rotacion-insumos?${queryParams}`);
      if (!response.ok) {
        throw new Error('Error al obtener datos de rotación de insumos');
      }
      return response.json();
    },
  });
}

/**
 * Hook para obtener datos de asistencia de becados
 */
export function useAsistenciaBecados(params: DateRangeParams = {}) {
  return useQuery<AsistenciaBecados[]>({
    queryKey: ['asistencia-becados', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.desde) queryParams.set('desde', params.desde);
      if (params.hasta) queryParams.set('hasta', params.hasta);

      const response = await fetch(`/api/bi/asistencia-becados?${queryParams}`);
      if (!response.ok) {
        throw new Error('Error al obtener datos de asistencia de becados');
      }
      return response.json();
    },
  });
}

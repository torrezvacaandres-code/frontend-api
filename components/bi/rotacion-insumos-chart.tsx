'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRotacionInsumos } from '@/hooks/use-bi-data';
import type { DateRangeParams } from '@/lib/api/types-bi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface RotacionInsumosChartProps {
  dateRange?: DateRangeParams;
}

export function RotacionInsumosChart({ dateRange }: RotacionInsumosChartProps) {
  const { data, isLoading, isError, error } = useRotacionInsumos(dateRange);

  if (isLoading) {
    return (
      <Card className="col-span-12">
        <CardHeader>
          <CardTitle>Rotación de Insumos</CardTitle>
          <CardDescription>Entradas y salidas por insumo</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="col-span-12">
        <CardHeader>
          <CardTitle>Rotación de Insumos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            <p>Error al cargar los datos: {error?.message || 'Error desconocido'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-12">
        <CardHeader>
          <CardTitle>Rotación de Insumos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            <p>No hay datos disponibles para el rango seleccionado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Agrupar datos por insumo (sumando todos los meses)
  const insumosMap = new Map<string, { entrada: number; salida: number; unidad: string }>();
  
  data.forEach((item) => {
    const existing = insumosMap.get(item.nombre);
    if (existing) {
      existing.entrada += item.total_entrada;
      existing.salida += item.total_salida;
    } else {
      insumosMap.set(item.nombre, {
        entrada: item.total_entrada,
        salida: item.total_salida,
        unidad: item.unidad,
      });
    }
  });

  // Convertir a array y tomar los top 10
  const chartData = Array.from(insumosMap.entries())
    .map(([nombre, valores]) => ({
      nombre: nombre.length > 15 ? nombre.substring(0, 15) + '...' : nombre,
      entrada: valores.entrada,
      salida: valores.salida,
      unidad: valores.unidad,
    }))
    .sort((a, b) => (b.entrada + b.salida) - (a.entrada + a.salida))
    .slice(0, 10);

  return (
    <Card className="col-span-12">
      <CardHeader>
        <CardTitle>Rotación de Insumos</CardTitle>
        <CardDescription>
          Top 10 insumos por volumen de entradas y salidas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name === 'entrada' ? 'Entradas' : 'Salidas',
              ]}
            />
            <Legend />
            <Bar dataKey="entrada" fill="#10b981" name="Entradas" />
            <Bar dataKey="salida" fill="#ef4444" name="Salidas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

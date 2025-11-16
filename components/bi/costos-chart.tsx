'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCostos } from '@/hooks/use-bi-data';
import type { DateRangeParams } from '@/lib/api/types-bi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CostosChartProps {
  dateRange?: DateRangeParams;
}

export function CostosChart({ dateRange }: CostosChartProps) {
  const { data, isLoading, isError, error } = useCostos(dateRange);

  if (isLoading) {
    return (
      <Card className="col-span-6">
        <CardHeader>
          <CardTitle>Costo por Ración</CardTitle>
          <CardDescription>Evolución del costo promedio</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="col-span-6">
        <CardHeader>
          <CardTitle>Costo por Ración</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            <p>Error al cargar los datos: {error?.message || 'Error desconocido'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-6">
        <CardHeader>
          <CardTitle>Costo por Ración</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            <p>No hay datos disponibles</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Formatear datos para el gráfico
  const chartData = data.map((item) => ({
    fecha: format(new Date(item.fecha), 'dd/MM', { locale: es }),
    costoPromedio: item.costo_promedio_insumo,
    costoTotal: item.costo_total_insumos,
  }));

  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle>Costo por Ración</CardTitle>
        <CardDescription>Evolución del costo promedio de insumos</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="costoPromedio"
              stroke="#f59e0b"
              name="Costo Promedio"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

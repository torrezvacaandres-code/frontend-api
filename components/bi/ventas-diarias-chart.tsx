'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useVentasDiarias } from '@/hooks/use-bi-data';
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

interface VentasDiariasChartProps {
  dateRange?: DateRangeParams;
}

export function VentasDiariasChart({ dateRange }: VentasDiariasChartProps) {
  const { data, isLoading, isError, error } = useVentasDiarias(dateRange);

  if (isLoading) {
    return (
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle>Ventas e Ingresos Diarios</CardTitle>
          <CardDescription>Evolución de raciones servidas e ingresos</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle>Ventas e Ingresos Diarios</CardTitle>
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
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle>Ventas e Ingresos Diarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            <p>No hay datos disponibles para el rango seleccionado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Formatear datos para el gráfico
  const chartData = data.map((item) => ({
    fecha: format(new Date(item.fecha), 'dd/MM', { locale: es }),
    raciones: item.raciones_servidas,
    ingresos: item.ingresos_total,
  }));

  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle>Ventas e Ingresos Diarios</CardTitle>
        <CardDescription>
          Evolución de raciones servidas e ingresos generados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'ingresos') {
                  return [`$${value.toLocaleString()}`, 'Ingresos'];
                }
                return [value.toLocaleString(), 'Raciones'];
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="raciones"
              stroke="#8884d8"
              name="Raciones"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="ingresos"
              stroke="#82ca9d"
              name="Ingresos"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

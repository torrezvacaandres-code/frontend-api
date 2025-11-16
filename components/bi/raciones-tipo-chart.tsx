'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useVentasDiarias } from '@/hooks/use-bi-data';
import type { DateRangeParams } from '@/lib/api/types-bi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface RacionesTipoChartProps {
  dateRange?: DateRangeParams;
}

export function RacionesTipoChart({ dateRange }: RacionesTipoChartProps) {
  const { data, isLoading, isError, error } = useVentasDiarias(dateRange);

  if (isLoading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Raciones por Tipo</CardTitle>
          <CardDescription>Becados vs Regulares</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Raciones por Tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            <p>Error al cargar los datos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Raciones por Tipo</CardTitle>
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
    becados: item.raciones_becados,
    regulares: item.raciones_regulares,
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Raciones por Tipo</CardTitle>
        <CardDescription>Distribución entre becados y regulares</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="becados"
              stackId="1"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              name="Becados"
            />
            <Area
              type="monotone"
              dataKey="regulares"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              name="Regulares"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

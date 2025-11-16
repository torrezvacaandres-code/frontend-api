'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAsistenciaBecados } from '@/hooks/use-bi-data';
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

interface AsistenciaBecadosChartProps {
  dateRange?: DateRangeParams;
}

export function AsistenciaBecadosChart({ dateRange }: AsistenciaBecadosChartProps) {
  const { data, isLoading, isError, error } = useAsistenciaBecados(dateRange);

  if (isLoading) {
    return (
      <Card className="col-span-6">
        <CardHeader>
          <CardTitle>Asistencia de Becados</CardTitle>
          <CardDescription>Asistencia vs becas activas</CardDescription>
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
          <CardTitle>Asistencia de Becados</CardTitle>
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
          <CardTitle>Asistencia de Becados</CardTitle>
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
    asistieron: item.raciones_becados,
    activas: item.becas_activas,
    porcentaje: item.becas_activas > 0 
      ? ((item.raciones_becados / item.becas_activas) * 100).toFixed(1)
      : 0,
  }));

  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle>Asistencia de Becados</CardTitle>
        <CardDescription>Comparativa entre asistencia real y becas activas</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="asistieron"
              stroke="#8b5cf6"
              name="Asistieron"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="activas"
              stroke="#06b6d4"
              name="Becas Activas"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

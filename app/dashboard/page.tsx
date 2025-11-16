'use client';

import { useState, useMemo } from 'react';
import { KpiCard } from '@/components/bi/kpi-card';
import { VentasDiariasChart } from '@/components/bi/ventas-diarias-chart';
import { RacionesTipoChart } from '@/components/bi/raciones-tipo-chart';
import { RotacionInsumosChart } from '@/components/bi/rotacion-insumos-chart';
import { CostosChart } from '@/components/bi/costos-chart';
import { AsistenciaBecadosChart } from '@/components/bi/asistencia-becados-chart';
import { useVentasDiarias, useCostos, useAsistenciaBecados } from '@/hooks/use-bi-data';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, DollarSign, TrendingUp, Users, Award } from 'lucide-react';
import { DateRange } from 'react-day-picker';

export default function DashboardPage() {
  // Estado para el rango de fechas (últimos 30 días por defecto)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Convertir el dateRange a formato de API
  const dateRangeParams = useMemo(() => {
    if (!dateRange?.from) return {};
    return {
      desde: format(dateRange.from, 'yyyy-MM-dd'),
      hasta: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    };
  }, [dateRange]);

  // Obtener datos para los KPIs
  const { data: ventasData, isLoading: ventasLoading } = useVentasDiarias(dateRangeParams);
  const { data: costosData, isLoading: costosLoading } = useCostos(dateRangeParams);
  const { data: asistenciaData, isLoading: asistenciaLoading } = useAsistenciaBecados(dateRangeParams);

  // Calcular KPIs
  const kpis = useMemo(() => {
    const totalIngresos = ventasData?.reduce((sum, item) => sum + item.ingresos_total, 0) || 0;
    const totalRaciones = ventasData?.reduce((sum, item) => sum + item.raciones_servidas, 0) || 0;
    const costoPromedio = costosData?.length 
      ? costosData.reduce((sum, item) => sum + item.costo_promedio_insumo, 0) / costosData.length 
      : 0;
    const totalBecados = asistenciaData?.reduce((sum, item) => sum + item.raciones_becados, 0) || 0;

    return {
      totalIngresos,
      totalRaciones,
      costoPromedio,
      totalBecados,
    };
  }, [ventasData, costosData, asistenciaData]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-8">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard de Business Intelligence</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 space-y-6 p-8">
        {/* Filtros */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Análisis y Métricas</h2>
            <p className="text-muted-foreground">
              Visualiza las estadísticas clave del comedor universitario
            </p>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'dd MMM yyyy', { locale: es })} -{' '}
                      {format(dateRange.to, 'dd MMM yyyy', { locale: es })}
                    </>
                  ) : (
                    format(dateRange.from, 'dd MMM yyyy', { locale: es })
                  )
                ) : (
                  <span>Seleccionar rango de fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                locale={es}
              />
              <div className="border-t p-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setDateRange({
                        from: subDays(new Date(), 7),
                        to: new Date(),
                      })
                    }
                  >
                    Últimos 7 días
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setDateRange({
                        from: subDays(new Date(), 30),
                        to: new Date(),
                      })
                    }
                  >
                    Últimos 30 días
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* KPIs Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Ingresos Totales"
            value={kpis.totalIngresos}
            isLoading={ventasLoading}
            formatter={(val) => `$${val.toLocaleString()}`}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiCard
            title="Raciones Servidas"
            value={kpis.totalRaciones}
            isLoading={ventasLoading}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiCard
            title="Costo Promedio/Ración"
            value={kpis.costoPromedio}
            isLoading={costosLoading}
            formatter={(val) => `$${val.toFixed(2)}`}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiCard
            title="Asistencia Becados"
            value={kpis.totalBecados}
            isLoading={asistenciaLoading}
            icon={<Award className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* Charts Grid - Fila 1 */}
        <div className="grid gap-4 grid-cols-12">
          <VentasDiariasChart dateRange={dateRangeParams} />
          <RacionesTipoChart dateRange={dateRangeParams} />
        </div>

        {/* Charts Grid - Fila 2 */}
        <div className="grid gap-4 grid-cols-12">
          <CostosChart dateRange={dateRangeParams} />
          <AsistenciaBecadosChart dateRange={dateRangeParams} />
        </div>

        {/* Charts Grid - Fila 3 */}
        <div className="grid gap-4 grid-cols-12">
          <RotacionInsumosChart dateRange={dateRangeParams} />
        </div>
      </div>
    </div>
  );
}

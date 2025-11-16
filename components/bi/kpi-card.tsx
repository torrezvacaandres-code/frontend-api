'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number | string;
  previousValue?: number;
  isLoading?: boolean;
  formatter?: (value: number) => string;
  icon?: React.ReactNode;
}

export function KpiCard({
  title,
  value,
  previousValue,
  isLoading = false,
  formatter,
  icon,
}: KpiCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[120px] mb-2" />
          <Skeleton className="h-4 w-[80px]" />
        </CardContent>
      </Card>
    );
  }

  // Calcular cambio porcentual
  let percentageChange: number | null = null;
  let changeDirection: 'up' | 'down' | 'neutral' = 'neutral';

  if (previousValue !== undefined && typeof value === 'number' && previousValue > 0) {
    percentageChange = ((value - previousValue) / previousValue) * 100;
    if (percentageChange > 0.5) changeDirection = 'up';
    else if (percentageChange < -0.5) changeDirection = 'down';
  }

  const formattedValue = typeof value === 'number' && formatter 
    ? formatter(value) 
    : value.toLocaleString();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {percentageChange !== null && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {changeDirection === 'up' && (
              <>
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+{percentageChange.toFixed(1)}%</span>
              </>
            )}
            {changeDirection === 'down' && (
              <>
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-red-600">{percentageChange.toFixed(1)}%</span>
              </>
            )}
            {changeDirection === 'neutral' && (
              <>
                <Minus className="h-4 w-4 text-gray-600" />
                <span className="text-gray-600">Sin cambios</span>
              </>
            )}
            <span className="ml-1">vs período anterior</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import { AlertCircle } from 'lucide-react'
import { Button } from './button'
import { Card } from './card'

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
}

export function ErrorMessage({ 
  message = 'Ocurrió un error al cargar los datos', 
  onRetry 
}: ErrorMessageProps) {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-red-100 p-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-1">Error</h3>
          <p className="text-sm text-muted-foreground mb-4">{message}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Reintentar
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

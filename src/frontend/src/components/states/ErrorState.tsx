import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <div className="container py-12">
      <Alert variant="destructive" className="mx-auto max-w-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="mt-2">{message}</AlertDescription>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm" className="mt-4">
            Try Again
          </Button>
        )}
      </Alert>
    </div>
  );
}

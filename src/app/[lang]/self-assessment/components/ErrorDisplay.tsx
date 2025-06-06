import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';

interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  const { t } = useI18n();
  
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t('selfAssessment.error.title')}</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
} 
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Coffee, X } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { BuyMeCoffeeButton } from '@/components/common/buy-me-coffee-button';
import { useMonetizationVisibility } from '@/hooks/use-monetization-visibility';

interface CelebrationSupportProps {
  completionType: 'assessment' | 'checkin' | 'journal' | 'expense';
  className?: string;
}

interface CelebrationSupportToastProps {
  completionType: 'assessment' | 'checkin' | 'journal' | 'expense';
  className?: string;
  onSupportClick?: () => void;
  onClose?: () => void;
  translations: {
    title: string;
    message: string;
    gentleMessage: string;
    buttonText: string;
    dialogTitle: string;
    dialogDescription: string;
  };
}

/**
 * Celebration component that appears after meaningful completions,
 * offering support in a positive, celebratory context
 */
export function CelebrationSupport({ 
  className = '' 
}: CelebrationSupportProps) {
  const { t } = useI18n();
  const { showCelebrationSupport } = useMonetizationVisibility();

  // Only render if progressive disclosure indicates user is ready
  if (!showCelebrationSupport) {
    return null;
  }

  return (
    <Card className={`bg-gradient-to-br from-primary/5 to-accent/5 border-primary/30 ${className}`}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          <div>
            <CardTitle className="text-lg">{t('completion.celebration.title')}</CardTitle>
            <CardDescription>
              {t('completion.celebration.message')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{t('monetization.gentle.message')}</span>
          </div>
          <BuyMeCoffeeButton 
            placement="celebration"
            variant="default" 
            size="sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Version of CelebrationSupport for use in toasts where context is not available.
 * Accepts translations as props instead of using useI18n hook.
 */
export function CelebrationSupportToast({ 
  className = '',
  onSupportClick,
  onClose,
  translations
}: CelebrationSupportToastProps) {
  const { showCelebrationSupport } = useMonetizationVisibility();

  // Only render if progressive disclosure indicates user is ready
  if (!showCelebrationSupport) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-br from-green-50 to-primary/20 border-2 border-green-200 rounded-lg p-4 shadow-lg ${className}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <div>
              <div className="font-semibold text-sm">{translations.title}</div>
              <div className="text-xs text-muted-foreground">
                {translations.message}
              </div>
            </div>
          </div>
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Heart className="w-3 h-3 text-red-500" />
            <span>{translations.gentleMessage}</span>
          </div>
          <Button 
            variant="default" 
            size="sm"
            onClick={onSupportClick}
            className="flex items-center gap-2"
          >
            <Coffee className="w-4 h-4" />
            {translations.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
} 
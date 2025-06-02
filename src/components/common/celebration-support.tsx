'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Heart } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { BuyMeCoffeeButton } from '@/components/common/buy-me-coffee-button';
import { useMonetizationVisibility } from '@/hooks/use-monetization-visibility';

interface CelebrationSupportProps {
  completionType: 'assessment' | 'checkin' | 'journal' | 'expense';
  className?: string;
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
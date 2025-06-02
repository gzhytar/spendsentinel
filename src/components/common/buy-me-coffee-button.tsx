'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Coffee } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { useAnalyticsContext } from '@/contexts/analytics-context';
import { cn } from '@/lib/utils';

interface BuyMeCoffeeButtonProps {
  placement: 'footer' | 'card' | 'celebration' | 'settings';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function BuyMeCoffeeButton({ 
  placement, 
  variant = 'outline', 
  size = 'sm',
  className = ''
}: BuyMeCoffeeButtonProps) {
  const { t } = useI18n();
  const { trackEvent } = useAnalyticsContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    // Track the event and open dialog
    trackEvent('support_cta_clicked', {
      placement,
      variant,
      size
    });
    
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button 
        variant={variant}
        size={size}
        onClick={handleClick}
        className={cn("flex items-center gap-2", className)}
      >
        <Coffee className="w-4 h-4" />
        {t(`support.button.${placement}`)}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-lg h-[90vh] max-h-[800px] p-0 flex flex-col">
          <DialogHeader className="p-4 pb-2 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-primary" />
                <DialogTitle className="text-lg">{t('support.dialog.title')}</DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-sm">
              {t('support.dialog.description')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 p-4 pt-0 min-h-0">
            <iframe
              src="https://buymeacoffee.com/spendsentinel"
              className="w-full h-full border-0 rounded-md bg-white"
              title="Buy Me a Coffee"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 
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
  onClose?: () => void;
  translations?: {
    buttonText: string;
    dialogTitle: string;
    dialogDescription: string;
  };
}

export function BuyMeCoffeeButton({ 
  placement, 
  variant = 'outline', 
  size = 'sm',
  className = '',
  onClose,
  translations
}: BuyMeCoffeeButtonProps) {
  const analyticsContext = useAnalyticsContext();
  const { t } = useI18n();

  // Use analytics context only if translations are not provided (normal context)
  // When translations are provided (toast context), analytics might not be available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let trackEvent: ((eventName: string, parameters?: any) => void) | undefined;
  try {
    if (!translations) {
      trackEvent = analyticsContext.trackEvent;
    }
  } catch (error) {
    console.error('Error accessing analytics context:', error);
    // Analytics context not available (e.g., in toast), continue without tracking
    trackEvent = undefined;
  }
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    // Track the event and open dialog (if analytics available)
    if (trackEvent) {
      trackEvent('support_cta_clicked', {
        placement,
        variant,
        size
      });
    }
    
    // Open dialog first
    setIsDialogOpen(true);
    
    // Close parent container (e.g., toast) after a short delay to allow dialog to mount
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 100); // Small delay to ensure dialog is mounted
    }
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
        {translations ? translations.buttonText : t(`support.button.${placement}`)}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-lg h-[90vh] max-h-[800px] p-0 flex flex-col">
          <DialogHeader className="p-4 pb-2 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-primary" />
                <DialogTitle className="text-lg">
                  {translations ? translations.dialogTitle : t('support.dialog.title')}
                </DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-sm">
              {translations ? translations.dialogDescription : t('support.dialog.description')}
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
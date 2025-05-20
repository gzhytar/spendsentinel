"use client";

import { Button, ButtonProps } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { usePremiumStatus } from '@/hooks/use-premium-status';
import { cn } from '@/lib/utils';

interface PremiumButtonProps extends Omit<ButtonProps, 'className'> {
  tooltipText?: string;
  className?: string;
}

/**
 * A button that visually indicates premium functionality.
 * - Shows a crown icon when premium is enabled
 * - Shows a lock icon when premium is disabled
 * - Is disabled and shows a tooltip when premium is disabled
 * - Has a gold/amber gradient when premium is enabled
 * 
 * @example
 * <PremiumButton onClick={handlePremiumFeature}>
 *   Analyze Financial Patterns
 * </PremiumButton>
 */
export function PremiumButton({ 
  onClick, 
  children, 
  tooltipText = "This is a premium feature. Contact admin to enable premium functionality.",
  className,
  ...props
}: PremiumButtonProps) {
  const { isPremiumEnabled } = usePremiumStatus();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={isPremiumEnabled ? onClick : undefined}
            disabled={!isPremiumEnabled}
            className={cn(
              `relative`,
              isPremiumEnabled 
                ? 'bg-gradient-to-r from-amber-300 to-amber-500 text-black hover:from-amber-400 hover:to-amber-600 shadow-md' 
                : 'bg-muted text-muted-foreground cursor-not-allowed',
              className
            )}
            {...props}
          >
            {children}
            {isPremiumEnabled ? ( <Crown className="w-4 h-4 mr-2 text-amber-200" /> ) : ( <Lock className="w-4 h-4 mr-2 text-muted-foreground" /> )}
            <span className="absolute -top-1 -right-1 bg-amber-200 text-amber-800 text-xs font-bold px-1 rounded-full">
              PRO
            </span>
          </Button>
        </TooltipTrigger>
        {!isPremiumEnabled && (
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
} 
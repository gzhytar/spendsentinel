"use client";

import { Button, ButtonProps } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { usePremiumStatus } from '@/hooks/use-premium-status';
import { cn } from '@/lib/utils';

interface PremiumButtonProps extends Omit<ButtonProps, 'className'> {
  tooltipText?: string;
  className?: string;
  wrap?: boolean;
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
  wrap,
  ...props
}: PremiumButtonProps) {
  const { isPremiumEnabled } = usePremiumStatus();
  
  const button = (
    <Button
      onClick={isPremiumEnabled ? onClick : undefined}
      disabled={!isPremiumEnabled}
      wrap={wrap}
      className={cn(
        "relative",
        isPremiumEnabled 
          ? 'bg-gradient-to-r from-amber-300 to-amber-500 text-black hover:from-amber-400 hover:to-amber-600 shadow-md' 
          : 'bg-muted text-muted-foreground cursor-not-allowed',
        className
      )}
      {...props}
    >
      {isPremiumEnabled ? (
        <Crown className="w-4 h-4 mr-2 text-amber-200" />
      ) : (
        <Lock className="w-4 h-4 mr-2 text-muted-foreground" />
      )}
      {children}
      <span className="absolute -top-1 -right-1 bg-amber-200 text-amber-800 text-xs font-bold px-1 rounded-full">
        PRO
      </span>
    </Button>
  );

  // Only wrap with Tooltip if premium is disabled and we need to show tooltip
  if (!isPremiumEnabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Return button without tooltip when premium is enabled
  return button;
} 
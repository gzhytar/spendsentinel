"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/contexts/i18n-context';

interface FeatureNavigationButtonProps {
  href: string;
  translationKey: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

export function FeatureNavigationButton({ 
  href,
  translationKey,
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true,
  fullWidth = false,
  onClick
}: FeatureNavigationButtonProps) {
  const { t, locale } = useI18n();
  const localePrefix = `/${locale}`;
  const fullHref = href.startsWith('/') ? `${localePrefix}${href}` : href;
  
  const buttonClasses = `${fullWidth ? 'w-full sm:w-auto' : ''} ${className}`;

  return (
    <Button 
      className={buttonClasses} 
      variant={variant}
      size={size}
      wrap={true} 
      asChild
    >
      <Link href={fullHref} onClick={onClick}>
        <span>
          {t(translationKey)}
          {showIcon && <ArrowRight className="ml-2 h-4 w-4 inline" />}
        </span>
      </Link>
    </Button>
  );
} 
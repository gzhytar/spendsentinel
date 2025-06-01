'use client';

import { useI18n } from '@/contexts/i18n-context';
import { usePreferences, currencyConfigs, Currency } from '@/contexts/preferences-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Globe, DollarSign } from 'lucide-react';
import { locales, localeNames, localeFlags } from '@/lib/i18n/config';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const { currency, setCurrency, getCurrencySymbol } = usePreferences();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Change language and currency" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">{localeFlags[locale]}</span>
          <DollarSign className="h-3 w-3" />
          <span className="text-xs font-medium">{getCurrencySymbol()}</span>
          <span className="sr-only">Change language and currency</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Language</DropdownMenuLabel>
        {locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLocale(l)}
            className={locale === l ? 'bg-accent' : ''}
          >
            <span className="mr-2">{localeFlags[l]}</span>
            <span className="flex-1">{localeNames[l]}</span>
            {locale === l && <span className="text-xs text-muted-foreground">✓</span>}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs text-muted-foreground">Currency</DropdownMenuLabel>
        {(Object.keys(currencyConfigs) as Currency[]).map((currencyCode) => {
          const config = currencyConfigs[currencyCode];
          return (
            <DropdownMenuItem
              key={currencyCode}
              onClick={() => setCurrency(currencyCode)}
              className={currency === currencyCode ? 'bg-accent' : ''}
            >
              <span className="mr-2">{config.symbol}</span>
              <span className="text-md">{config.name}</span>
              {currency === currencyCode && <span className="ml-2 text-xs text-muted-foreground">✓</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 
import { usePreferences } from '@/contexts/preferences-context';

/**
 * Hook that provides currency formatting utilities
 */
export function useCurrency() {
  const { currency, getCurrencySymbol, getCurrencyConfig } = usePreferences();

  /**
   * Format an amount with the current currency symbol
   * @param amount - The amount to format
   * @param options - Formatting options
   * @returns Formatted currency string
   */
  const formatAmount = (
    amount: number, 
    options: {
      showSymbol?: boolean;
      showCode?: boolean;
      decimals?: number;
      prefix?: boolean; // true = symbol before amount, false = symbol after amount
    } = {}
  ): string => {
    const {
      showSymbol = true,
      showCode = false,
      decimals = 2,
      prefix = false,
    } = options;

    const formattedAmount = amount.toFixed(decimals);
    const symbol = getCurrencySymbol();
    const code = getCurrencyConfig().code;

    let result = formattedAmount;

    if (showSymbol) {
      if (prefix) {
        result = `${symbol}${result}`;
      } else {
        result = `${result} ${symbol}`;
      }
    }

    if (showCode) {
      result = `${result} ${code}`;
    }

    return result;
  };

  /**
   * Get the currency symbol for display
   */
  const getSymbol = () => getCurrencySymbol();

  /**
   * Get the currency code (USD, EUR, etc.)
   */
  const getCode = () => getCurrencyConfig().code;

  /**
   * Get the full currency name
   */
  const getName = () => getCurrencyConfig().name;

  return {
    currency,
    formatAmount,
    getSymbol,
    getCode,
    getName,
  };
} 
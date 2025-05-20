import { useState, useEffect } from 'react';

/**
 * Custom hook to check whether premium functionality is enabled
 * @returns {Object} Object containing isPremiumEnabled status
 * @example
 * const { isPremiumEnabled } = usePremiumStatus();
 * if (isPremiumEnabled) {
 *   // Render premium feature
 * }
 */
export function usePremiumStatus() {
  const [isPremiumEnabled, setIsPremiumEnabled] = useState(false);
  
  useEffect(() => {
    // Access the environment variable
    // Note: Next.js requires prefixing environment variables with NEXT_PUBLIC_ 
    // to make them available on the client side
    const premiumEnabled = process.env.NEXT_PUBLIC_PREMIUM_ENABLED === 'true';
    setIsPremiumEnabled(premiumEnabled);
  }, []);
  
  return { isPremiumEnabled };
} 
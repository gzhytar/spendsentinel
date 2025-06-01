import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting debug mode safely on the client side
 * Checks both development environment and URL parameters without causing hydration mismatches
 * 
 * @returns {boolean} Whether debug mode is active
 */
export function useDebugMode(): boolean {
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    // Check if running in development environment
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.includes('localhost');

    // Check URL parameters for debug flag
    const urlParams = new URLSearchParams(window.location.search);
    const hasDebugParam = urlParams.has('debug') || urlParams.get('debug') === 'true';

    // Enable debug mode if either condition is met
    setIsDebugMode(isDevelopment || hasDebugParam);
  }, []);

  return isDebugMode;
} 
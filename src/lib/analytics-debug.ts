import { environmentConfig } from '@/app/firebase';

/**
 * Analytics Debug Utility
 * Use this to test and validate your analytics configuration
 */

export const analyticsDebug = {
  /**
   * Get current environment configuration
   */
  getEnvironmentInfo: () => {
    return {
      ...environmentConfig,
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'server-side',
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'server-side',
      port: typeof window !== 'undefined' ? window.location.port : 'server-side',
    };
  },

  /**
   * Log environment configuration to console
   */
  logEnvironmentInfo: () => {
    const info = analyticsDebug.getEnvironmentInfo();
    console.group('📊 Analytics Environment Configuration');
    console.log('Environment:', info.environment);
    console.log('Traffic Type:', info.traffic_type);
    console.log('Should Track:', info.shouldTrack);
    console.log('Current URL:', info.currentUrl);
    console.log('Hostname:', info.hostname);
    console.log('Port:', info.port);
    console.groupEnd();
    return info;
  },

  /**
   * Test if current environment should track analytics
   */
  shouldTrackInCurrentEnvironment: () => {
    return environmentConfig.shouldTrack;
  },

  /**
   * Get the traffic type for current environment
   */
  getCurrentTrafficType: () => {
    return environmentConfig.traffic_type;
  },

  /**
   * Simulate what parameters would be sent with an event
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  simulateEventParameters: (customParams: Record<string, any> = {}) => {
    const defaultParams = {
      traffic_type: environmentConfig.traffic_type,
      environment: environmentConfig.environment,
      event_timestamp: new Date().toISOString(),
    };

    return {
      ...defaultParams,
      ...customParams,
    };
  },

  /**
   * Check if running on the specific testing environment (localhost:9002)
   */
  isTestingEnvironment: () => {
    if (typeof window === 'undefined') return false;
    return window.location.hostname === 'localhost' && window.location.port === '9002';
  }
};

// Export for use in components
export default analyticsDebug; 
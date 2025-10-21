// Simple environment debug utility for Vercel Analytics
export const analyticsDebug = {
  /**
   * Get current environment configuration
   */
  getEnvironmentInfo: () => {
    if (typeof window === 'undefined') {
      return {
        environment: 'server',
        traffic_type: 'server',
        shouldTrack: false,
        currentUrl: 'server-side',
        hostname: 'server-side',
        port: 'server-side',
      };
    }

    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // Check for specific testing environment
    if (hostname === 'localhost' && port === '9002') {
      return {
        environment: 'testing',
        traffic_type: 'testing',
        shouldTrack: false,
        currentUrl: window.location.href,
        hostname,
        port,
      };
    }
    
    // Check for other local development
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('local')) {
      return {
        environment: 'staging',
        traffic_type: 'staging',
        shouldTrack: true,
        currentUrl: window.location.href,
        hostname,
        port,
      };
    }
    
    // Production environment
    return {
      environment: 'production',
      traffic_type: 'production',
      shouldTrack: true,
      currentUrl: window.location.href,
      hostname,
      port,
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
    return analyticsDebug.getEnvironmentInfo().shouldTrack;
  },

  /**
   * Get the traffic type for current environment
   */
  getCurrentTrafficType: () => {
    return analyticsDebug.getEnvironmentInfo().traffic_type;
  },

  /**
   * Simulate what parameters would be sent with an event
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  simulateEventParameters: (customParams: Record<string, any> = {}) => {
    const info = analyticsDebug.getEnvironmentInfo();
    const defaultParams = {
      traffic_type: info.traffic_type,
      environment: info.environment,
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

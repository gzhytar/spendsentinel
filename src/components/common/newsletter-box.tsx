'use client';

import { useEffect } from 'react';

interface NewsletterBoxProps {
  children?: React.ReactNode;
}

export function NewsletterBox({ children }: NewsletterBoxProps) {
  useEffect(() => {
    // Load Beehiiv script
    const script = document.createElement('script');
    script.src = 'https://subscribe-forms.beehiiv.com/embed.js';
    script.async = true;
    
    // Check if script is already loaded
    if (!document.querySelector('script[src="https://subscribe-forms.beehiiv.com/embed.js"]')) {
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup if needed - though we might want to keep the script loaded
      // for performance across page navigations
    };
  }, []);

  return (
    <div className="bg-teal-50 border border-teal-200 p-4 sm:p-6 rounded-lg my-8">
      <div className="text-center space-y-4">
        {children}
        
        {/* Beehiiv Embed */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto">
          <iframe 
            src="https://subscribe-forms.beehiiv.com/e4875908-179f-4756-8e57-841bf3c33669" 
            className="beehiiv-embed w-full h-auto min-h-[100px] border-0 rounded-lg bg-transparent"
            data-test-id="beehiiv-embed" 
            frameBorder="0" 
            scrolling="no"
            style={{
              width: '100%',
              height: 'auto',
              minHeight: '100px',
              margin: 0,
              borderRadius: '8px',
              backgroundColor: 'transparent',
              boxShadow: 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
} 
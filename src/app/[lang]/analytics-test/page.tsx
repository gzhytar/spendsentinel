import { AnalyticsTest } from '@/components/common';

export default function AnalyticsTestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Analytics Configuration Test</h1>
          <p className="text-muted-foreground mt-2">
            Verify your GA4 analytics setup and environment detection
          </p>
        </div>
        
        <AnalyticsTest />
        
        <div className="max-w-2xl text-sm text-muted-foreground">
          <h2 className="font-semibold mb-2">How to test:</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open your browser's developer console (F12)</li>
            <li>Click the test buttons above to send events</li>
            <li>Check the console for event logs and analytics status</li>
            <li>
              On localhost:9002, you should see "🚫 Analytics tracking disabled" messages
            </li>
            <li>
              On other environments, you should see "✅ Analytics Event Sent" messages
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
} 
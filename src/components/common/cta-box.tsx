'use client';

interface CTABoxProps {
  children: React.ReactNode;
  className?: string;
}

export function CTABox({ children, className = '' }: CTABoxProps) {
  return (
    <div className={`bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200 my-8 ${className}`}>
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to put this into practice?</h2>
        <p className="text-lg">Start your personalized financial wellness journey with SpendSentinel's compassionate tools.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/self-assessment" 
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-purple-600 text-white hover:bg-purple-700 h-auto min-h-10 px-4 py-2"
          >
            Take Your Assessment
          </a>
          <a 
            href="/daily-checkin" 
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-purple-600 text-white hover:bg-purple-700 h-auto min-h-10 px-4 py-2"
          >
            Start Daily Check-ins
          </a>
        </div>
      </div>
    </div>
  );
} 
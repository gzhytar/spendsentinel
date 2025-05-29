'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { StreakMessage } from './StreakMessage';

interface CheckinTimelineProps {
  lang: string;
}

interface CheckinDay {
  date: string;
  completed: boolean;
}

/**
 * CheckinTimeline Component
 * 
 * Focused component responsible for displaying checkin timeline visualization.
 * Follows SOLID principles:
 * - Single Responsibility: Displays timeline and progress visualization only
 * - Open/Closed: Extensible through props without modification
 * - Dependency Inversion: Depends on StreakMessage for streak functionality
 */
export function CheckinTimeline({ lang }: CheckinTimelineProps) {
  const { t } = useI18n();
  const [checkinHistory, setCheckinHistory] = useState<CheckinDay[]>([]);

  useEffect(() => {
    loadCheckinHistory();
    
    // Listen for storage changes to update timeline in real-time
    const handleStorageChange = () => {
      loadCheckinHistory();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadCheckinHistory = () => {
    try {
      const completedCheckIns = JSON.parse(localStorage.getItem('completedCheckIns') || '[]');
      const days: CheckinDay[] = [];
      const today = new Date();
      
      // Generate last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const completed = completedCheckIns.includes(dateStr);
        
        days.push({ date: dateStr, completed });
      }
      
      setCheckinHistory(days);
    } catch (error) {
      console.warn('Failed to load checkin history:', error);
      setCheckinHistory([]);
    }
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const completedCount = checkinHistory.filter(d => d.completed).length;
  const totalDays = checkinHistory.length;
  const completionPercentage = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header with icon and title */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Check-in Progress</span>
          <span className="text-xs text-muted-foreground">
            {completedCount}/{totalDays} days ({completionPercentage}%)
          </span>
        </div>
        
        {/* Progress Bar with Dots */}
        <div className="space-y-3">
          <div className="flex gap-1">
            {checkinHistory.map((day) => {
              const today = isToday(day.date);
              
              return (
                <div
                  key={day.date}
                  className={`flex-1 h-3 rounded-full transition-all duration-300 relative group
                    ${day.completed 
                      ? 'bg-primary shadow-sm' 
                      : 'bg-muted border border-muted-foreground/20'
                    }
                    ${today ? 'ring-2 ring-primary ring-offset-1 scale-110' : ''}
                    hover:scale-105
                  `}
                  title={`${new Date(day.date).toLocaleDateString(lang)} - ${
                    day.completed ? t('dailyCheckIn.timeline.completed') : t('dailyCheckIn.timeline.missed')
                  }`}
                >
                </div>
              );
            })}
          </div>
          
          {/* Week markers */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>4 weeks ago</span>
            <span>3 weeks ago</span>
            <span>2 weeks ago</span>
            <span>1 week ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Streak Information */}
        <div className="pt-3 border-t">
          <StreakMessage 
            checkinHistory={checkinHistory}
            showVisualStreak={true} 
          />
        </div>
      </div>
    </Card>
  );
} 
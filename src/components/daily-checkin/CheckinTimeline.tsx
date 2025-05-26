'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, Calendar } from 'lucide-react';

interface CheckinTimelineProps {
  lang: string;
}

interface CheckinDay {
  date: string;
  completed: boolean;
}

export function CheckinTimeline({ lang }: CheckinTimelineProps) {
  const { t } = useI18n();
  const [checkinHistory, setCheckinHistory] = useState<CheckinDay[]>([]);

  useEffect(() => {
    // Generate last 30 days
    const days: CheckinDay[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Check if this date has a completed check-in in localStorage
      const completedCheckIns = JSON.parse(localStorage.getItem('completedCheckIns') || '[]');
      const completed = completedCheckIns.includes(dateStr);
      
      days.push({ date: dateStr, completed });
    }
    
    setCheckinHistory(days);
  }, []);

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const currentStreak = calculateStreak(checkinHistory);
  const completedCount = checkinHistory.filter(d => d.completed).length;
  const totalDays = checkinHistory.length;
  const completionPercentage = Math.round((completedCount / totalDays) * 100);

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
            {checkinHistory.map((day, index) => {
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
                  {/* Today indicator dot */}
                  {today && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
                  )}
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

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4">
            {/* Current Streak */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                ${currentStreak > 0 ? 'bg-primary text-white' : 'bg-muted'}
              `}>
                <span className="text-sm font-bold">
                  {currentStreak > 0 ? '🔥' : '○'}
                </span>
              </div>
              <div className="text-sm">
                <div className="font-medium">
                  {currentStreak > 0 
                    ? `${currentStreak} ${t('dailyCheckIn.timeline.days')}` 
                    : 'No streak'
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('dailyCheckIn.timeline.streak')}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>{t('dailyCheckIn.timeline.completed')}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-muted border border-muted-foreground/20" />
              <span>{t('dailyCheckIn.timeline.missed')}</span>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        {currentStreak > 0 && (
          <div className="text-center py-2">
            <span className="text-sm text-primary font-medium">
              {currentStreak === 1 
                ? "Great start! Keep it going! 🌟"
                : currentStreak < 7
                ? `${currentStreak} days strong! You're building momentum! 💪`
                : currentStreak < 14
                ? `Amazing ${currentStreak}-day streak! You're on fire! 🔥`
                : `Incredible ${currentStreak}-day streak! You're a champion! 🏆`
              }
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

function calculateStreak(history: CheckinDay[]): number {
  let streak = 0;
  
  // Start from today and go backwards
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].completed) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
} 
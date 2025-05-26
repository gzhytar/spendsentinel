'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import { use } from 'react';

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getDate().toString();
  };

  const getMonthName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang, { month: 'short' });
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  // Group days by week for display
  const weeks: CheckinDay[][] = [];
  for (let i = 0; i < checkinHistory.length; i += 7) {
    weeks.push(checkinHistory.slice(i, i + 7));
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Legend */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>{t('dailyCheckIn.timeline.completed')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-4 h-4" />
            <span>{t('dailyCheckIn.timeline.missed')}</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i}>{day}</div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((day, dayIndex) => {
                const isFirstOfMonth = formatDate(day.date) === '1';
                const today = isToday(day.date);
                
                return (
                  <div
                    key={day.date}
                    className={`relative flex flex-col items-center justify-center p-2 rounded-lg transition-colors
                      ${today ? 'ring-2 ring-primary' : ''}
                      ${day.completed ? 'bg-primary/10' : 'bg-muted/50'}
                      hover:bg-muted
                    `}
                  >
                    {/* Month label for first day of month */}
                    {isFirstOfMonth && (
                      <span className="absolute -top-5 text-xs text-muted-foreground">
                        {getMonthName(day.date)}
                      </span>
                    )}
                    
                    {/* Day number */}
                    <span className="text-sm font-medium">
                      {formatDate(day.date)}
                    </span>
                    
                    {/* Completion indicator */}
                    <div className="mt-1">
                      {day.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('dailyCheckIn.timeline.streak')}</span>
            <span className="font-medium">{calculateStreak(checkinHistory)} {t('dailyCheckIn.timeline.days')}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">{t('dailyCheckIn.timeline.totalCompleted')}</span>
            <span className="font-medium">
              {checkinHistory.filter(d => d.completed).length} / {checkinHistory.length}
            </span>
          </div>
        </div>
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
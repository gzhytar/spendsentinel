'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, Calendar, AlertTriangle } from 'lucide-react';

interface CheckinTimelineProps {
  lang: string;
}

interface CheckinDay {
  date: string;
  completed: boolean;
}

interface StreakResult {
  streak: number;
  todayCompleted: boolean;
  streakAtRisk: boolean;
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

  const streakResult = calculateStreak(checkinHistory);
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
                ${streakResult.streak > 0 ? 'bg-primary text-white' : 'bg-muted'}
              `}>
                <span className="text-sm font-bold">
                  {streakResult.streak > 0 ? '🔥' : '○'}
                </span>
              </div>
              <div className="text-sm">
                <div className="font-medium">
                  {streakResult.streak > 0 
                    ? `${streakResult.streak} ${t('dailyCheckIn.timeline.days')}` 
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
            
              <div className="w-3 h-3 rounded-full bg-muted border border-muted-foreground/20" />
              <span>{t('dailyCheckIn.timeline.missed')}</span>
            </div>

            
          </div>
        </div>

        {/* Streak at risk warning */}
        {streakResult.streakAtRisk && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">
                Streak at risk! Complete today's check-in to maintain your {streakResult.streak}-day streak.
              </span>
            </div>
          </div>
        )}

        {/* Motivational Message */}
        {streakResult.streak > 0 && streakResult.todayCompleted && (
          <div className="text-center py-2">
            <span className="text-sm text-primary font-medium">
              {streakResult.streak === 1 
                ? "Great start! Keep it going! 🌟"
                : streakResult.streak < 7
                ? `${streakResult.streak} days strong! You're building momentum! 💪`
                : streakResult.streak < 14
                ? `Amazing ${streakResult.streak}-day streak! You're on fire! 🔥`
                : `Incredible ${streakResult.streak}-day streak! You're a champion! 🏆`
              }
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

function calculateStreak(history: CheckinDay[]): StreakResult {
  let streak = 0;
  const todayIndex = history.length - 1;
  const todayCompleted = history[todayIndex]?.completed || false;
  
  // If today is not completed, start counting from yesterday
  const startIndex = todayCompleted ? todayIndex : todayIndex - 1;
  
  // Count consecutive completed days starting from the appropriate day
  for (let i = startIndex; i >= 0; i--) {
    if (history[i].completed) {
      streak++;
    } else {
      break;
    }
  }
  
  // Streak is at risk if today is not completed but there's an active streak
  const streakAtRisk = !todayCompleted && streak > 0;
  
  return {
    streak,
    todayCompleted,
    streakAtRisk
  };
} 
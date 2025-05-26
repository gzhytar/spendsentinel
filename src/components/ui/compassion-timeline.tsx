'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Card } from '@/components/ui/card';
import { Frown, Meh, Smile } from 'lucide-react';

interface CompassionTimelineProps {
  lang: string;
}

interface CompassionDay {
  date: string;
  score: number | null;
}

interface CalmScoreData {
  date: string;
  score: number;
}

export function CompassionTimeline({ lang }: CompassionTimelineProps) {
  const { t } = useI18n();
  const [compassionHistory, setCompassionHistory] = useState<CompassionDay[]>([]);

  useEffect(() => {
    const loadCompassionHistory = () => {
      // Generate last 30 days
      const days: CompassionDay[] = [];
      const today = new Date();
      
      // Load calm history from localStorage
      const storedHistory = localStorage.getItem('calmHistory');
      const calmHistory: CalmScoreData[] = storedHistory ? JSON.parse(storedHistory) : [];
      
      // Create a map of dates to scores for quick lookup
      const scoreMap = new Map<string, number>();
      calmHistory.forEach(entry => {
        try {
          // Handle different date formats that might be stored
          let dateStr: string;
          
          // If the date is already in ISO format (YYYY-MM-DD), use it directly
          if (/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
            dateStr = entry.date;
          } else {
            // Try to parse the date and convert to ISO format
            const date = new Date(entry.date);
            if (isNaN(date.getTime())) {
              // If date is invalid, skip this entry
              console.warn('Invalid date found in calm history:', entry.date);
              return;
            }
            dateStr = date.toISOString().split('T')[0];
          }
          
          scoreMap.set(dateStr, entry.score);
        } catch (error) {
          console.warn('Error processing date in calm history:', entry.date, error);
        }
      });
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const score = scoreMap.get(dateStr) || null;
        days.push({ date: dateStr, score });
      }
      
      setCompassionHistory(days);
    };

    // Load initial data
    loadCompassionHistory();

    // Listen for storage events to update when new scores are saved
    const handleStorageChange = () => {
      loadCompassionHistory();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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

  const getScoreIcon = (score: number | null) => {
    if (score === null) {
      return <div className="w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground/20" />;
    }
    
    if (score < 4) {
      return <Frown className="w-4 h-4 text-red-500" />;
    } else if (score <= 7) {
      return <Meh className="w-4 h-4 text-yellow-500" />;
    } else {
      return <Smile className="w-4 h-4 text-green-500" />;
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'bg-muted/50';
    
    if (score < 4) {
      return 'bg-red-50 dark:bg-red-950/20';
    } else if (score <= 7) {
      return 'bg-yellow-50 dark:bg-yellow-950/20';
    } else {
      return 'bg-green-50 dark:bg-green-950/20';
    }
  };

  // Group days by week for display
  const weeks: CompassionDay[][] = [];
  for (let i = 0; i < compassionHistory.length; i += 7) {
    weeks.push(compassionHistory.slice(i, i + 7));
  }

  // Calculate statistics
  const scoresWithData = compassionHistory.filter(d => d.score !== null);

  return (
    <Card className="p-4 sm:p-6 w-full overflow-hidden">
      <div className="space-y-4 min-w-0">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Smile className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>{t('selfCompassion.timeline.high')} (8-10)</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Meh className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            <span>{t('selfCompassion.timeline.medium')} (4-7)</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Frown className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{t('selfCompassion.timeline.low')} (1-3)</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground/20 flex-shrink-0" />
            <span>{t('selfCompassion.timeline.noData')}</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2 min-w-0">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-xs text-muted-foreground text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="min-w-0">{day}</div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1 sm:gap-2">
              {week.map((day, dayIndex) => {
                const isFirstOfMonth = formatDate(day.date) === '1';
                const today = isToday(day.date);
                
                return (
                  <div
                    key={day.date}
                    className={`relative flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg transition-colors min-w-0
                      ${today ? 'ring-2 ring-primary' : ''}
                      ${getScoreColor(day.score)}
                      hover:bg-muted
                    `}
                    title={day.score !== null ? `Score: ${day.score}` : 'No data'}
                  >
                    {/* Month label for first day of month */}
                    {isFirstOfMonth && (
                      <span className="absolute -top-5 text-xs text-muted-foreground whitespace-nowrap">
                        {getMonthName(day.date)}
                      </span>
                    )}
                    
                    {/* Day number */}
                    <span className="text-xs sm:text-sm font-medium">
                      {formatDate(day.date)}
                    </span>
                    
                    {/* Score indicator */}
                    <div className="mt-1">
                      {getScoreIcon(day.score)}
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
            <span className="text-muted-foreground">{t('selfCompassion.timeline.totalEntries')}</span>
            <span className="font-medium">
              {scoresWithData.length} / {compassionHistory.length}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Card } from '@/components/ui/card';
import { Heart, Calendar } from 'lucide-react';

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

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'bg-muted border border-muted-foreground/20';
    
    if (score < 4) {
      return 'bg-red-500 shadow-sm';
    } else if (score <= 7) {
      return 'bg-yellow-500 shadow-sm';
    } else {
      return 'bg-green-500 shadow-sm';
    }
  };

  const getScoreEmoji = (score: number | null) => {
    if (score === null) return '○';
    if (score < 4) return '😔';
    if (score <= 7) return '😐';
    return '😊';
  };

  // Calculate statistics
  const scoresWithData = compassionHistory.filter(d => d.score !== null);
  const totalEntries = scoresWithData.length;
  const totalDays = compassionHistory.length;
  const completionPercentage = Math.round((totalEntries / totalDays) * 100);

  // Calculate current streak of entries (not score-based)
  const calculateEntryStreak = () => {
    let streak = 0;
    for (let i = compassionHistory.length - 1; i >= 0; i--) {
      if (compassionHistory[i].score !== null) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateEntryStreak();

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header with icon and title */}
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Self-Compassion Journey</span>
          <span className="text-xs text-muted-foreground">
            {totalEntries}/{totalDays} days ({completionPercentage}%)
          </span>
        </div>
        
        {/* Progress Bar with Score-Colored Dots */}
        <div className="space-y-3">
          <div className="flex gap-1">
            {compassionHistory.map((day, index) => {
              const today = isToday(day.date);
              
              return (
                <div
                  key={day.date}
                  className={`flex-1 h-3 rounded-full transition-all duration-300 relative group
                    ${getScoreColor(day.score)}
                    ${today ? 'ring-2 ring-primary ring-offset-1 scale-110' : ''}
                    hover:scale-105
                  `}
                  title={`${new Date(day.date).toLocaleDateString(lang)} - ${
                    day.score !== null 
                      ? `Score: ${day.score}/10 ${getScoreEmoji(day.score)}`
                      : t('selfCompassion.timeline.noData')
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
        <div className="space-y-3 pt-3 border-t">
          {/* Entry Streak */}
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
              ${currentStreak > 0 ? 'bg-green-500 text-white' : 'bg-muted'}
            `}>
              <span className="text-sm font-bold">
                {currentStreak > 0 ? '📅' : '○'}
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
                Entry streak
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>{t('selfCompassion.timeline.high')} (8-10)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>{t('selfCompassion.timeline.medium')} (4-7)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>{t('selfCompassion.timeline.low')} (1-3)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-muted border border-muted-foreground/20" />
              <span>{t('selfCompassion.timeline.noData')}</span>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        {currentStreak > 0 && (
          <div className="text-center py-2">
            <span className="text-sm text-primary font-medium">
              {currentStreak === 1 
                ? "Great start! Keep tracking your self-compassion journey! 🌟"
                : currentStreak < 7
                ? `${currentStreak} days of mindful tracking! You're building a healthy habit! 💪`
                : currentStreak < 14
                ? `Amazing ${currentStreak}-day streak! Your self-awareness is growing! 🌱`
                : `Incredible ${currentStreak}-day streak! You're truly committed to self-compassion! 💚`
              }
            </span>
          </div>
        )}
      </div>
    </Card>
  );
} 
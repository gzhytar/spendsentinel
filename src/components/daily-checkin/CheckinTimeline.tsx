'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Card } from '@/components/ui/card';
import { Calendar, Heart } from 'lucide-react';
import { StreakMessage } from './StreakMessage';

interface CheckinTimelineProps {
  lang: string;
}

interface CheckinDay {
  date: string;
  completed: boolean;
  compassionScore?: number | null;
}

interface CalmScoreData {
  date: string;
  score: number;
}

/**
 * CheckinTimeline Component
 * 
 * Enhanced component responsible for displaying checkin timeline visualization
 * with self-compassion score visualization.
 * Follows SOLID principles:
 * - Single Responsibility: Displays timeline, progress, and compassion level visualization
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
      // Load completed check-ins
      const completedCheckIns = JSON.parse(localStorage.getItem('completedCheckIns') || '[]');
      
      // Load compassion scores
      const calmHistory: CalmScoreData[] = JSON.parse(localStorage.getItem('calmHistory') || '[]');
      const scoreMap = new Map<string, number>();
      
      calmHistory.forEach((entry) => {
        try {
          let dateStr: string;
          
          if (typeof entry.date === 'string') {
            // Handle both ISO format and simple date format
            if (entry.date.includes('T')) {
              dateStr = entry.date.split('T')[0];
            } else if (entry.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
              dateStr = entry.date;
            } else {
              const date = new Date(entry.date);
              if (isNaN(date.getTime())) {
                console.warn('Invalid date found in calm history:', entry.date);
                return;
              }
              dateStr = date.toISOString().split('T')[0];
            }
          } else {
            const date = new Date(entry.date);
            if (isNaN(date.getTime())) {
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

      const days: CheckinDay[] = [];
      const today = new Date();
      
      // Generate last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const completed = completedCheckIns.includes(dateStr);
        const compassionScore = scoreMap.get(dateStr) || null;
        
        days.push({ 
          date: dateStr, 
          completed,
          compassionScore
        });
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

  
  const getScoreColor = (score: number | null, completed: boolean) => {
    if (!completed) {
      return 'bg-muted border border-muted-foreground/20';
    }
    
    if (score === null) {
      return 'bg-primary/60 shadow-sm'; // Completed but no compassion score
    }
    
    // Trauma-informed color progression: avoid red, use calming blues/greens
    if (score < 4) {
      return 'bg-blue-300 shadow-sm'; // Light, calm blue for lower scores
    } else if (score <= 7) {
      return 'bg-blue-500 shadow-sm'; // Medium blue for moderate scores
    } else {
      return 'bg-green-500 shadow-sm'; // Green for higher scores (growth/progress)
    }
  };

  const getScoreEmoji = (score: number | null) => {
    if (score === null) return '○';
    if (score < 4) return '😔';
    if (score <= 7) return '😐';
    return '😊';
  };

  const getTooltipText = (day: CheckinDay) => {
    const dateText = new Date(day.date).toLocaleDateString(lang);
    
    if (!day.completed) {
      return `${dateText} - ${t('dailyCheckIn.timeline.missed')}`;
    }
    
    if (day.compassionScore !== null && day.compassionScore !== undefined) {
      return `${dateText} - Completed | Self-compassion: ${day.compassionScore}/10 ${getScoreEmoji(day.compassionScore)}`;
    }
    
    return `${dateText} - ${t('dailyCheckIn.timeline.completed')} | No compassion score`;
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
          <span className="font-medium text-sm">Check-in Journey</span>
          <span className="text-xs text-muted-foreground">
            {completedCount}/{totalDays} days ({completionPercentage}%)
          </span>
        </div>
        
        {/* Progress Bar with Emoji-Based Dots */}
        <div className="space-y-3">
          <div className="flex gap-1">
            {checkinHistory.map((day) => {
              const today = isToday(day.date);
              
              return (
                <div
                  key={day.date}
                  className={`flex-1 h-8 rounded-full transition-all duration-300 relative group flex items-center justify-center text-xs
                    ${getScoreColor(day.compassionScore ?? null, day.completed)}
                    ${today ? 'ring-2 ring-primary ring-offset-1 scale-110' : ''}
                    hover:scale-105
                  `}
                  title={getTooltipText(day)}
                >
                  {day.completed && (
                    <span className="text-xs text-white drop-shadow-sm">
                      {getScoreEmoji(day.compassionScore ?? null)}
                    </span>
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

        {/* Streak Information */}
        <div className="pt-3 border-t">
          <StreakMessage 
            checkinHistory={checkinHistory.map(d => ({ date: d.date, completed: d.completed }))}
            showVisualStreak={true} 
          />
        </div>
      </div>
    </Card>
  );
} 
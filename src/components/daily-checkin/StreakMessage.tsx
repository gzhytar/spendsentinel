import { AlertTriangle } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { useState, useEffect } from 'react';

interface CheckinDay {
  date: string;
  completed: boolean;
}

interface StreakMessageProps {
  checkinHistory: CheckinDay[];
  showVisualStreak?: boolean;
}

interface MessageConfig {
  type: 'warning' | 'success' | 'motivation';
  icon?: React.ReactNode;
  message: string;
  className: string;
}

interface StreakResult {
  streak: number;
  todayCompleted: boolean;
  streakAtRisk: boolean;
}

/**
 * StreakMessage Component
 * 
 * Reusable component that handles streak calculation and visualization:
 * - Calculates current streak and risk status from provided checkin history
 * - Displays visual indicators and contextual messages
 * - Updates automatically when checkin history changes
 * 
 * Follows SOLID principles:
 * - Single Responsibility: Calculates and displays streak information only
 * - Open/Closed: Extensible through props without modification
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Depends on injected data rather than concrete data sources
 */
export function StreakMessage({ 
  checkinHistory,
  showVisualStreak = false,
}: StreakMessageProps) {
  const { t } = useI18n();
  const [streakData, setStreakData] = useState<StreakResult>({
    streak: 0,
    todayCompleted: false,
    streakAtRisk: false
  });

  useEffect(() => {
    const streakResult = calculateStreak(checkinHistory);
    setStreakData(streakResult);
  }, [checkinHistory]);

  const calculateStreak = (history: CheckinDay[]): StreakResult => {
    if (history.length === 0) {
      return { streak: 0, todayCompleted: false, streakAtRisk: false };
    }

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
  };

  const getMessageConfig = (): MessageConfig | null => {
    const { streak, todayCompleted, streakAtRisk } = streakData;
    
    // Priority: Warning messages first, then motivational messages
    if (streakAtRisk && streak > 0) {
      return {
        type: 'warning',
        icon: <AlertTriangle className="h-4 w-4 flex-shrink-0" />,
        message: `Streak at risk! Complete today's check-in to maintain your ${streak}-day streak.`,
        className: "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3 text-amber-800 dark:text-amber-200"
      };
    }

    if (streak > 0 && todayCompleted) {
      return {
        type: 'motivation',
        message: getMotivationalMessage(streak),
        className: "text-primary font-medium"
      };
    }

    return null;
  };

  const getMotivationalMessage = (streakCount: number): string => {
    const messages = {
      1: "Great start! Keep it going! 🌟",
      7: `${streakCount} days strong! You're building momentum! 💪`,
      14: `Amazing ${streakCount}-day streak! You're on fire! 🔥`,
      21: `Incredible ${streakCount}-day streak! You're a champion! 🏆`
    };

    // Find the appropriate message based on streak thresholds
    if (streakCount === 1) return messages[1];
    if (streakCount < 7) return `${streakCount} days strong! You're building momentum! 💪`;
    if (streakCount < 14) return messages[7].replace('7', streakCount.toString());
    if (streakCount < 21) return messages[14].replace('14', streakCount.toString());
    return messages[21].replace('21', streakCount.toString());
  };

  const messageConfig = getMessageConfig();
  const { streak } = streakData;

  // If no visual streak and no message, return null
  if (!showVisualStreak && !messageConfig) {
    return null;
  }

  // If only message without visual streak
  if (!showVisualStreak && messageConfig) {
    return (
      <div className={`${messageConfig.className}`}>
        {messageConfig.type === 'warning' ? (
          <div className="flex items-center gap-2">
            {messageConfig.icon}
            <span className="text-sm font-medium">
              {messageConfig.message}
            </span>
          </div>
        ) : (
          <span className="text-sm">{messageConfig.message}</span>
        )}
      </div>
    );
  }

  // Combined layout with visual streak and optional message
  return (
    <div className={`w-full`}>
      {messageConfig?.type === 'warning' ? (
        // Warning messages get full-width treatment
        <div className={messageConfig.className}>
          <div className="flex items-center gap-2">
            {messageConfig.icon}
            <span className="text-sm font-medium">
              {messageConfig.message}
            </span>
          </div>
        </div>
      ) : (
        // Normal layout: streak on left, message on right
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Visual Streak Display */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
              ${streak > 0 ? 'bg-primary text-white' : 'bg-muted'}
            `}>
              <span className="text-sm font-bold">
                {streak > 0 ? '🔥' : '○'}
              </span>
            </div>
            <div className="text-sm">
              <div className="font-medium">
                {streak > 0 
                  ? `${streak} ${t('dailyCheckIn.timeline.days')}` 
                  : 'No streak'
                }
              </div>
              <div className="text-xs text-muted-foreground hidden sm:block">
                {t('dailyCheckIn.timeline.streak')}
              </div>
            </div>
          </div>

          {/* Message Display */}
          {messageConfig && (
            <div className="flex-1 min-w-0">
              <div className={`text-sm ${messageConfig.className}`}>
                {messageConfig.message}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 
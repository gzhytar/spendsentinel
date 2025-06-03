import { useState, useEffect } from 'react';

export enum EngagementLevel {
  STARTER = 0,
  BEGINNER = 1, 
  ADVANCED = 2,
  EXPERT = 3
}

interface MonetizationVisibility {
  showSupportMention: boolean;
  showPremiumTeaser: boolean;
  showSubscriptionOffer: boolean;
  showCelebrationSupport: boolean;
  showMissionMention: boolean;
}

/**
 * Hook for managing when monetization elements should be visible
 * Following trauma-informed progressive disclosure approach
 */
export function useMonetizationVisibility(): MonetizationVisibility {
  const [visibility, setVisibility] = useState<MonetizationVisibility>({
    showSupportMention: false,
    showPremiumTeaser: false,
    showSubscriptionOffer: false,
    showCelebrationSupport: false,
    showMissionMention: false,
  });

  useEffect(() => {
    setVisibility({
      showSupportMention: getEngagementLevel() >= EngagementLevel.STARTER,
      showCelebrationSupport: getEngagementLevel() >= EngagementLevel.BEGINNER,
      showMissionMention: getEngagementLevel() >= EngagementLevel.ADVANCED,
      showPremiumTeaser: getEngagementLevel() >= EngagementLevel.ADVANCED,
      showSubscriptionOffer: getEngagementLevel() >= EngagementLevel.EXPERT,
    });
    console.log('EngagementLevel', getEngagementLevel());
  }, []);

  return visibility;
}

/**
 * Get engagement level for analytics
 * @returns EngagementLevel enum value that supports comparison operations
 * @example
 * if (getEngagementLevel() >= EngagementLevel.BEGINNER) {
 *   // Show monetization content
 * }
 */
export function getEngagementLevel(): EngagementLevel {
    let score = 0;
    
    try {
        // Check various engagement indicators
        const hasExpenses = localStorage.getItem('expenses');
        if (hasExpenses) score += 2;
        
        const hasBudget = localStorage.getItem('monthlyBudget');
        if (hasBudget) score += 2;

        const hasCompletedAssessment = localStorage.getItem('firefighterQuizResults');
        if (hasCompletedAssessment) score += 4;

        // ToDo: count completed checkins
        const hasCompletedCheckin = localStorage.getItem('completedCheckIns');
        if (hasCompletedCheckin) score += 3;

        // ToDo: count completed parts journal sessions
        const hasPartsJournal = localStorage.getItem('completedPartsJournalSessions');
        if (hasPartsJournal) score += 3;
       
        if (score >= 12) return EngagementLevel.EXPERT;
        if (score >= 8) return EngagementLevel.ADVANCED;
        if (score >= 4) return EngagementLevel.BEGINNER;
        
        return EngagementLevel.STARTER;

      } catch {
        return EngagementLevel.STARTER;
      }
    }

/**
 * Convert EngagementLevel enum to string for display/analytics
 */
export function getEngagementLevelString(level: EngagementLevel): string {
  switch (level) {
    case EngagementLevel.EXPERT: return 'expert';
    case EngagementLevel.ADVANCED: return 'advanced'; 
    case EngagementLevel.BEGINNER: return 'beginner';
    case EngagementLevel.STARTER: return 'starter';
    default: return 'starter';
  }
} 
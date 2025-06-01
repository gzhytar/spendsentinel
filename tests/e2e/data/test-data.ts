/**
 * Test data for Playwright E2E tests
 */

// Quiz answer patterns that lead to specific firefighter types
export const QUIZ_ANSWER_PATTERNS = {
  spender: [0, 0, 1, 0, 1], // Patterns that typically result in "spender" type
  hoarder: [1, 1, 0, 1, 0], // Patterns that typically result in "hoarder" type
  avoider: [2, 2, 2, 2, 2], // Patterns that typically result in "avoider" type
  indulger: [0, 1, 0, 1, 0], // Patterns that typically result in "indulger" type
  unsure: [3, 3, 3, 3, 3],  // "I'm not sure" responses
} as const;

// Sample deep assessment responses
export const DEEP_ASSESSMENT_SAMPLES = {
  anxious_spender: {
    financialSituation: `I currently earn $50,000 per year and have about $2,000 in savings. I have some credit card debt (around $3,000) that I'm trying to pay off. I live paycheck to paycheck and often worry about unexpected expenses. I want to save more but struggle to stick to a budget.`,
    recentBehavior: `Last week, I bought an expensive gadget I didn't really need when I was feeling stressed about work. I also signed up for another streaming service subscription even though I already have several. When I'm anxious, I tend to shop online to make myself feel better, but then I feel guilty afterward.`
  },
  
  over_saver: {
    financialSituation: `I have a stable job making $75,000 annually with excellent benefits. I've saved $30,000 in my emergency fund and max out my 401k. I track every expense and have multiple savings accounts for different goals. However, I rarely spend money on myself or experiences, even when I can afford it.`,
    recentBehavior: `This month, my friends invited me on a weekend trip that I could easily afford, but I declined because I didn't want to "waste" the money. I also bought generic groceries instead of the brands I prefer to save $15. I constantly research purchases for weeks before buying anything, even small items.`
  },
  
  financial_avoider: {
    financialSituation: `I honestly don't know exactly how much I make or spend each month. I think I earn around $45,000, but I've never created a budget. I have some money in checking and savings, but I'm not sure how much. I avoid looking at my bank statements and credit card bills because they make me anxious.`,
    recentBehavior: `I got a credit card bill last week but haven't opened it yet. I just pay the minimum and hope for the best. When my friends talk about investments or retirement planning, I change the subject because it overwhelms me. I know I should be more involved in my finances, but I don't know where to start.`
  },
  
  impulse_buyer: {
    financialSituation: `I make decent money ($60,000/year) but never seem to have much saved. I have various debts - credit cards, car loan, some student loans. I earn enough to cover my bills, but I often find myself short on cash by the end of the month despite having no idea where all the money went.`,
    recentBehavior: `Yesterday I saw a flash sale and bought three items I didn't plan to purchase. I often buy things in the moment without checking my budget first. I use "Buy Now, Pay Later" services frequently and have several active payment plans. When I see something I want, I rationalize why I "need" it and buy it immediately.`
  }
} as const;

// Mock AI responses for consistent testing
export const MOCK_AI_RESPONSES = {
  identifyPart: {
    default: {
      identifiedPart: {
        partName: 'The Anxious Spender',
        role: 'To provide comfort and relief through purchasing when feeling overwhelmed or stressed.',
        burden: 'Believes that buying things is the only way to cope with difficult emotions and that denying purchases leads to misery.',
        concern: 'Deep fear of feeling deprived, unloved, or that life is too hard without the comfort that spending provides.'
      },
      suggestedEngagement: 'Approach The Anxious Spender with curiosity and compassion. Ask what they are trying to protect you from and what they need to feel safe. Acknowledge their positive intention to help you feel better while exploring alternative ways to address underlying emotional needs.'
    },
    
    worrier_type: {
      identifiedPart: {
        partName: 'The Financial Worrier',
        role: 'To protect you from financial disaster by constantly monitoring and worrying about money.',
        burden: 'Carries the belief that catastrophic financial ruin is always just around the corner.',
        concern: 'Intense fear of not having enough money to survive and ending up destitute or homeless.'
      },
      suggestedEngagement: 'Connect with The Financial Worrier through validation of their protective role. Thank them for their vigilance while gently exploring what specific safety they need to feel more at ease with financial decisions.'
    }
  },
  
  resolvePart: {
    default: {
      role: 'Acts as a protector by providing emotional comfort through retail therapy and material acquisitions.',
      burden: 'Carries the responsibility of managing difficult emotions through spending and fears that without this outlet, overwhelming feelings will become unbearable.',
      concern: 'Worried that if spending stops, there will be no other way to cope with stress, sadness, or feelings of inadequacy.',
      engagementStrategy: 'gentle'
    },
    
    direct_engagement: {
      role: 'Serves as a guardian against financial vulnerability by maintaining strict control over spending.',
      burden: 'Bears the weight of preventing any financial mistakes that could lead to ruin.',
      concern: 'Fears that any relaxation of financial vigilance will result in catastrophic consequences.',
      engagementStrategy: 'direct'
    }
  }
} as const;

// Test user scenarios for different user journeys
export const USER_SCENARIOS = {
  new_user_complete_flow: {
    description: 'New user discovers app, completes assessment, gets results',
    startPage: '/',
    expectedJourney: [
      'landing',
      'self-assessment', 
      'quiz-complete',
      'results-view'
    ]
  },
  
  returning_user_with_data: {
    description: 'User with existing assessment data views results',
    startPage: '/self-assessment',
    localStorage: {
      'firefighterQuizResults': [{
        result: 'spender',
        timestamp: new Date().toISOString(),
        locale: 'en'
      }]
    },
    expectedJourney: [
      'self-assessment',
      'existing-results-view'
    ]
  },
  
  deep_assessment_user: {
    description: 'User completes deep assessment for AI-powered insights',
    startPage: '/self-assessment',
    expectedJourney: [
      'self-assessment',
      'deep-assessment-form',
      'ai-processing',
      'detailed-results'
    ]
  }
} as const;

// Localization test data
export const LOCALIZED_TEXT_SAMPLES = {
  en: {
    selfAssessmentTitle: /self.*assessment/i,
    quizStartButton: /start.*quiz/i,
    identifyButton: /identify.*part/i,
    financialSituationLabel: /financial.*situation/i,
  },
  cs: {
    selfAssessmentTitle: /sebehodnocení/i,
    quizStartButton: /spustit.*kvíz/i,
    identifyButton: /identifikovat.*část/i,
    financialSituationLabel: /finanční.*situace/i,
  },
  // Add more locales as needed
} as const;

// Expected firefighter types (matching the app's implementation)
export const FIREFIGHTER_TYPES = [
  'spender',
  'hoarder', 
  'avoider',
  'indulger'
] as const;

// Page URLs for navigation testing
export const APP_ROUTES = {
  home: (locale: string = 'en') => `/${locale}`,
  selfAssessment: (locale: string = 'en') => `/${locale}/self-assessment`,
  dailyCheckin: (locale: string = 'en') => `/${locale}/daily-checkin`,
  partsJournal: (locale: string = 'en') => `/${locale}/parts-journal`,
  expenseHighlighter: (locale: string = 'en') => `/${locale}/expense-highlighter`,
  privacyPolicy: (locale: string = 'en') => `/${locale}/privacy-policy`,
  termsOfService: (locale: string = 'en') => `/${locale}/terms-of-service`,
} as const;
export const en = {
  common: {
    appName: 'InnerBalance',
    loading: 'Loading...',
    error: 'An error occurred',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
  },
  navigation: {
    home: 'Home',
    overview: 'Overview',
    expenseHighlighter: 'Expense Highlighter',
    financialGPS: 'Financial GPS',
    ifsDialogue: 'IFS Dialogue',
    selfCompassion: 'Self-Compassion',
  },
  landing: {
    hero: {
      title: 'Transform Your Relationship with Money',
      subtitle: 'Discover how understanding your emotional patterns can lead to better financial decisions and lasting change.',
      cta: 'Start Your Journey',
    },
    theory: {
      title: 'The Financial Firefighters Model',
      subtitle: 'Understanding the emotional landscape of financial decisions',
      description: 'Financial decisions are rarely just about numbers. They\'re deeply intertwined with our emotions, past experiences, and psychological patterns. The Financial Firefighters model helps you understand and transform these patterns.',
      emotionsMatter: {
        title: 'Why Emotions Matter',
        description: 'Traditional financial advice often focuses on knowledge and discipline, but ignores the emotional factors that drive our decisions. Understanding these emotional patterns is key to lasting change.',
      },
      ifsConnection: {
        title: 'The IFS Connection',
        description: 'Based on Internal Family Systems (IFS) therapy, this model helps you identify and work with the different "parts" of yourself that influence your financial behaviors.',
      },
    },
    firefighters: {
      title: 'Types of Financial Firefighters',
      subtitle: 'Recognize your patterns and understand their purpose',
      spender: {
        title: 'The Spender',
        description: 'Uses shopping and spending to cope with stress, seeking immediate comfort through purchases.',
      },
      hoarder: {
        title: 'The Hoarder',
        description: 'Saves excessively, often driven by fear and anxiety about future security.',
      },
      avoider: {
        title: 'The Avoider',
        description: 'Avoids dealing with finances altogether, often due to past negative experiences.',
      },
    },
    features: {
      title: 'Core Features',
      subtitle: 'Tools designed to help you transform your financial relationship',
      expenseHighlighter: {
        title: 'Expense Highlighter',
        description: 'Categorize expenses as \'Living\' vs. \'Lifestyle\' to promote mindful spending decisions.',
        button: 'Track Your Expenses'
      },
            financialGPS: {        title: 'Financial GPS',        description: 'Track your financial journey with a clear view of past decisions and future goals.',        button: 'Explore Your Journey'      },
            ifsDialogue: {        title: 'IFS Dialogue',        description: 'Engage in guided conversations with your financial parts to understand their needs.',        button: 'Start a Dialogue'      },
            selfCompassion: {        title: 'Self-Compassion Practice',        description: 'Develop a kinder relationship with yourself and your financial journey.',        button: 'Practice Self-Compassion'      },
    },
  },
  selfCompassion: {
    title: 'Daily Self-Compassion',
    subtitle: 'A moment for kindness and reflection.',
    calmScore: {
      label: 'How calm do you feel right now? (1-10)',
      saveButton: 'Save Score & Reflect',
      newPromptButton: 'Get a New Self-Compassion Prompt'
    },
    journey: {
      title: 'Your Calm Journey',
      subtitle: 'Track your self-reported calm scores over time.',
      currentAverage: 'Current average calm:'
    },
    criticalThoughts: {
      title: 'Ratio of Self-Critical Statements',
      subtitle: 'Monitor your inner dialogue. (Placeholder for tracking)',
      comingSoon: 'Feature coming soon. This section will help you track and understand patterns in self-critical thoughts, promoting a more compassionate inner voice.'
    },
    prompts: [
      'Today, I will treat myself with the same kindness I would offer a good friend.',
      'Mistakes are a part of learning. I forgive myself for any financial missteps.',
      'I am doing my best with what I have, and that is enough.',
      'I acknowledge my financial fears without judgment and offer myself comfort.',
      'I choose to focus on progress, not perfection, in my financial journey.'
    ]
  },
  expenseHighlighter: {
    title: 'Expense Highlighter',
    subtitle: 'Track and categorize your expenses to understand your spending patterns.',
    addExpense: 'Add Expense',
    editExpense: 'Edit Expense',
    deleteExpense: 'Delete Expense',
    overview: 'Overview',
    total: 'Total Expenses',
    yourExpenses: 'Your Expenses',
    noExpenses: 'You haven\'t added any expenses yet. Click "Add Expense" to get started.',
    actions: 'Actions',
    selectCategory: 'Select a category',
    addDescription: 'Fill in the details below to add a new expense.',
    editDescription: 'Update the details of this expense.',
    livingDescription: 'Essential costs like rent/mortgage, utilities, groceries, transportation for work, insurance.',
    lifestyleDescription: 'Discretionary spending like dining out, entertainment, hobbies, travel, luxury items.',
    unassigned: 'Unassigned',
    categories: {
      living: 'Living Expenses',
      lifestyle: 'Lifestyle Expenses'
    },
    form: {
      amount: 'Amount',
      description: 'Description',
      category: 'Category',
      date: 'Date'
    }
  },
  financialGPS: {
    title: 'Financial GPS',
    subtitle: 'Map your financial journey: Past, Present, and Future.',
    timeline: {
      title: 'Your Financial Timeline',
      subtitle: 'Key moments that shaped your financial landscape and your current standing.',
      empty: 'No timeline events yet. Add one to get started!',
      addEvent: 'Add Timeline Event',
      addEventDescription: 'Document a significant financial moment or your current status.',
      form: {
        title: 'Title',
        date: 'Date',
        type: 'Type',
        description: 'Description',
        save: 'Save Event',
        types: {
          past: 'Past Influence',
          present: 'Present Snapshot',
          future: 'Future Goal/Vision'
        }
      }
    },
    visionBoard: {
      title: 'Financial Vision Board',
      subtitle: 'Visualize your financial goals and aspirations.',
      empty: 'Your vision board is empty. Add items to visualize your goals!',
      addItem: 'Add to Vision Board',
      addItemDescription: 'Add text affirmations or images to visualize your financial goals.',
      imageAlt: 'Vision board image',
      form: {
        type: 'Type',
        content: 'Content',
        description: 'Description',
        save: 'Add Item',
        types: {
          text: 'Text Affirmation',
          image: 'Image (URL)'
        }
      }
    },
    youAreHere: {
      title: 'You Are Here',
      description: "Reflect on your current financial position based on your timeline.",
      content: "Based on the timeline events you've added, particularly your 'Present Snapshot' entries, take a moment to consider where you currently stand in your financial journey. This is your 'You Are Here' point. Understanding this clearly is the first step towards navigating to your desired future."
    }
  },
  ifsDialogue: {
    title: 'IFS Dialogue: Understand Your Financial Parts',
    subtitle: 'Use AI to identify and understand your inner financial "firefighter" parts using the 6F framework.',
    form: {
      financialSituation: {
        label: 'Your Current Financial Situation',
        placeholder: 'e.g., I\'m struggling with debt, I\'m saving for a house...',
        error: 'Please describe your financial situation in more detail.'
      },
      recentFinancialBehavior: {
        label: 'Recent Financial Behavior/Decisions',
        placeholder: 'e.g., I recently made a large impulse purchase, I avoided looking at my bank account...',
        error: 'Please describe your recent financial behavior.'
      },
      personalityType: {
        label: 'Primary Communication Style',
        placeholder: 'Select your preferred style',
        error: 'Please select a personality type.',
        options: {
          analytical: 'Analytical & Direct',
          expressive: 'Expressive & Enthusiastic',
          amiable: 'Amiable & Supportive',
          driver: 'Driver & Results-Oriented',
          gentle: 'Gentle & Cautious'
        }
      }
    },
    identifyButton: 'Identify Financial Part',
    error: {
      title: 'Error',
      identifyFailed: 'Failed to identify part. Please try again.',
      resolveFailed: 'Failed to resolve part. Please try again.'
    },
    result: {
      title: 'Identified Part: {partName}',
      role: 'Role',
      burden: 'Burden',
      concern: 'Concern',
      suggestedEngagement: 'Suggested Engagement',
      engagementDescription: 'This strategy suggests a tailored approach to communicate with this part based on its nature and your profile.'
    }
  }
} as const; 
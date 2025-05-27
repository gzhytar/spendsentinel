export interface JournalSession {
  id: string;
  partName: string;
  startTime: string;
  lastSaved: string;
  completed: boolean;
  currentStep: number;
  content: {
    step1: string; // Safe Environment
    step2: string; // Find Focus
    step3: {
      positiveIntention: string;
      fears: string;
      protectionOrigins: string;
      agePerception: string;
      trustNeeds: string;
      additionalInsights: string;
    }; // Curious Dialogue
    step4: string; // Appreciate & Log
  };
}

export interface JournalSessionSummary {
  id: string;
  partName: string;
  startTime: string;
  lastSaved: string;
  completed: boolean;
  currentStep: number;
}

const JOURNAL_SESSIONS_KEY = 'partsJournalSessions';

export class PartsJournalStorage {
  static getAllSessions(): JournalSession[] {
    try {
      const stored = localStorage.getItem(JOURNAL_SESSIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading journal sessions:', error);
      return [];
    }
  }

  static getSessionSummaries(): JournalSessionSummary[] {
    const sessions = this.getAllSessions();
    return sessions.map(session => ({
      id: session.id,
      partName: session.partName,
      startTime: session.startTime,
      lastSaved: session.lastSaved,
      completed: session.completed,
      currentStep: session.currentStep
    }));
  }

  static getSession(id: string): JournalSession | null {
    const sessions = this.getAllSessions();
    return sessions.find(session => session.id === id) || null;
  }

  static saveSession(session: JournalSession): void {
    try {
      const sessions = this.getAllSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      session.lastSaved = new Date().toISOString();
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }
      
      // Keep only the most recent 50 sessions
      const sortedSessions = sessions
        .sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime())
        .slice(0, 50);
      
      localStorage.setItem(JOURNAL_SESSIONS_KEY, JSON.stringify(sortedSessions));
    } catch (error) {
      console.error('Error saving journal session:', error);
    }
  }

  static deleteSession(id: string): void {
    try {
      const sessions = this.getAllSessions();
      const filteredSessions = sessions.filter(session => session.id !== id);
      localStorage.setItem(JOURNAL_SESSIONS_KEY, JSON.stringify(filteredSessions));
    } catch (error) {
      console.error('Error deleting journal session:', error);
    }
  }

  static createNewSession(partName: string): JournalSession {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    return {
      id,
      partName,
      startTime: now,
      lastSaved: now,
      completed: false,
      currentStep: 1,
      content: {
        step1: '',
        step2: '',
        step3: {
          positiveIntention: '',
          fears: '',
          protectionOrigins: '',
          agePerception: '',
          trustNeeds: '',
          additionalInsights: ''
        },
        step4: ''
      }
    };
  }

  static getSessionsForPart(partName: string): JournalSessionSummary[] {
    const summaries = this.getSessionSummaries();
    return summaries.filter(session => session.partName === partName);
  }

  static getIdentifiedParts(): string[] {
    try {
      const quizResults = localStorage.getItem('quizResults');
      const assessmentResults = localStorage.getItem('assessmentResults');
      
      const parts: string[] = [];
      
      // Get parts from quiz results
      if (quizResults) {
        const results = JSON.parse(quizResults);
        if (Array.isArray(results)) {
          results.forEach((result: any) => {
            if (result.result && typeof result.result === 'string') {
              parts.push(result.result);
            }
          });
        }
      }
      
      // Get parts from assessment results
      if (assessmentResults) {
        const results = JSON.parse(assessmentResults);
        if (Array.isArray(results)) {
          results.forEach((result: any) => {
            if (result.identifiedPart?.partName) {
              parts.push(result.identifiedPart.partName);
            }
          });
        }
      }
      
      // Remove duplicates and return
      return [...new Set(parts)];
    } catch (error) {
      console.error('Error getting identified parts:', error);
      return [];
    }
  }
} 
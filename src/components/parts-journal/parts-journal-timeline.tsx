'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Heart, Trash2 } from 'lucide-react';

interface PartsJournalTimelineProps {
  lang: string;
}

interface CompletedJournalSession {
  id: string;
  partName: string;
  completionTime: string;
  content: {
    step1: string;
    step2: string;
    step3: {
      positiveIntention: string;
      fears: string;
      protectionOrigins: string;
      agePerception: string;
      trustNeeds: string;
      additionalInsights: string;
    };
    step4: string;
  };
}

export function PartsJournalTimeline({ lang }: PartsJournalTimelineProps) {
  const { t } = useI18n();
  const [sessions, setSessions] = useState<CompletedJournalSession[]>([]);

  useEffect(() => {
    loadSessions();
    
    // Listen for storage changes to update timeline
    const handleStorageChange = () => {
      loadSessions();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadSessions = () => {
    const completedSessions = JSON.parse(localStorage.getItem('completedPartsJournalSessions') || '[]');
    // Sort by completion time, newest first
    const sortedSessions = completedSessions.sort((a: CompletedJournalSession, b: CompletedJournalSession) => 
      new Date(b.completionTime).getTime() - new Date(a.completionTime).getTime()
    );
    setSessions(sortedSessions);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(lang, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewSession = (session: CompletedJournalSession) => {
    // Store session details for viewing (optional - could show a modal or detailed view)
    console.log('Viewing session:', session);
    // For now, just log - you could implement a detailed view modal here
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm(t('partsJournal.confirmDelete'))) {
      // Remove from completed sessions
      const completedSessions = JSON.parse(localStorage.getItem('completedPartsJournalSessions') || '[]');
      const updatedSessions = completedSessions.filter((s: CompletedJournalSession) => s.id !== sessionId);
      localStorage.setItem('completedPartsJournalSessions', JSON.stringify(updatedSessions));
      
      // Reload sessions
      loadSessions();
    }
  };

  if (sessions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('partsJournal.noSessionsTitle')}</h3>
        <p className="text-muted-foreground">{t('partsJournal.noSessionsMessage')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{session.partName}</h3>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(session.completionTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(session.completionTime)}</span>
                </div>
                <span className="text-green-600">{t('partsJournal.completed')}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteSession(session.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 
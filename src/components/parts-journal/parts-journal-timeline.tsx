'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Heart, Edit, Trash2 } from 'lucide-react';

interface PartsJournalTimelineProps {
  lang: string;
}

interface JournalSessionSummary {
  id: string;
  partName: string;
  startTime: string;
  lastSaved: string;
  completed: boolean;
  currentStep: number;
}

export function PartsJournalTimeline({ lang }: PartsJournalTimelineProps) {
  const { t } = useI18n();
  const [sessions, setSessions] = useState<JournalSessionSummary[]>([]);

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
    const sessionList = JSON.parse(localStorage.getItem('partsJournalSessions') || '[]');
    // Sort by start time, newest first
    const sortedSessions = sessionList.sort((a: JournalSessionSummary, b: JournalSessionSummary) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
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

  const handleContinueSession = (session: JournalSessionSummary) => {
    window.location.href = `/parts-journal?part=${session.partName}&session=${session.id}`;
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm(t('partsJournal.confirmDelete'))) {
      // Remove from localStorage
      localStorage.removeItem(`partsJournal_${sessionId}`);
      
      // Update session list
      const sessionList = JSON.parse(localStorage.getItem('partsJournalSessions') || '[]');
      const updatedList = sessionList.filter((s: JournalSessionSummary) => s.id !== sessionId);
      localStorage.setItem('partsJournalSessions', JSON.stringify(updatedList));
      
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
                <Badge variant={session.completed ? "default" : "secondary"}>
                  {session.completed ? t('partsJournal.completed') : t('partsJournal.inProgress')}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(session.startTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(session.startTime)}</span>
                </div>
                {!session.completed && (
                  <span>{t('partsJournal.stepProgress', { step: session.currentStep, total: 4 })}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContinueSession(session)}
              >
                <Edit className="h-4 w-4 mr-1" />
                {session.completed ? t('partsJournal.view') : t('partsJournal.continue')}
              </Button>
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
'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Heart, Trash2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { SessionSummary } from './session-summary';
import Image from 'next/image';

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

// Utility function to map part names to firefighter type IDs for image display
const getFirefighterTypeId = (partName: string, t: (key: string) => string): string => {
  // Get the firefighter type names from translations
  const firefighterTypeNames = {
    spender: t('landing.firefighters.spender.title'),
    hoarder: t('landing.firefighters.hoarder.title'),
    avoider: t('landing.firefighters.avoider.title'),
    indulger: t('landing.firefighters.indulger.title')
  };
  
  // Find the type ID that matches the part name
  for (const [typeId, typeName] of Object.entries(firefighterTypeNames)) {
    if (typeName === partName) {
      return typeId;
    }
  }
  
  // Default fallback
  return 'spender';
};

export function PartsJournalTimeline({ lang }: PartsJournalTimelineProps) {
  const { t } = useI18n();
  const [sessions, setSessions] = useState<CompletedJournalSession[]>([]);
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);

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

  // const handleViewSession = (session: CompletedJournalSession) => {
  //   // Store session details for viewing (optional - could show a modal or detailed view)
  //   console.log('Viewing session:', session);
  //   // For now, just log - you could implement a detailed view modal here
  // };

  const handleToggleSummary = (sessionId: string) => {
    setExpandedSummaryId(expandedSummaryId === sessionId ? null : sessionId);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm(t('partsJournal.confirmDelete'))) {
      // Remove from completed sessions
      const completedSessions = JSON.parse(localStorage.getItem('completedPartsJournalSessions') || '[]');
      const updatedSessions = completedSessions.filter((s: CompletedJournalSession) => s.id !== sessionId);
      localStorage.setItem('completedPartsJournalSessions', JSON.stringify(updatedSessions));
      
      // Close summary if it was expanded for this session
      if (expandedSummaryId === sessionId) {
        setExpandedSummaryId(null);
      }
      
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
      {sessions.map((session) => {
        const isExpanded = expandedSummaryId === session.id;
        const firefighterTypeId = getFirefighterTypeId(session.partName, t);
        
        return (
          <Card key={session.id} className="p-4">
            {/* Mobile-optimized layout */}
            <div className="space-y-3">
              {/* Header with part name and date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 flex-shrink-0 relative rounded-lg overflow-hidden bg-primary/10">
                    <Image
                      src={`/images/${firefighterTypeId}.jpg`}
                      alt={session.partName}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{session.partName}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{formatDate(session.completionTime)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-2 ml-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleSummary(session.id)}
                    className="flex items-center justify-center gap-1 text-xs sm:text-sm px-2 sm:px-3 h-8"
                  >
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{t('partsJournal.showSummary')}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSession(session.id)}
                    className="text-destructive hover:text-destructive flex items-center justify-center px-2 sm:px-3 h-8"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Session Summary */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-border">
                <SessionSummary sessionContent={session.content} />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
} 
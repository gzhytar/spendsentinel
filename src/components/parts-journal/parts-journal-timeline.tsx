'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Heart, Trash2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { SessionSummary } from './session-summary';
import Image from 'next/image';
import { getPartImageId } from '@/lib/part-image-utils';
import { createFirefighterTypeData } from '@/lib/assessment-utils';

interface PartsJournalTimelineProps {
  lang: string;
  selectedPartName?: string;
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

export function PartsJournalTimeline({ lang, selectedPartName }: PartsJournalTimelineProps) {
  const { t } = useI18n();
  const [sessions, setSessions] = useState<CompletedJournalSession[]>([]);
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);

  // Helper function to check if a session matches the selected part
  const isSessionForPart = (sessionPartName: string, selectedPartName: string): boolean => {
    // Direct match
    if (sessionPartName === selectedPartName) {
      return true;
    }

    // Create mapping of predefined types to handle ID vs display name mismatches
    const firefighterTypes = createFirefighterTypeData(t);
    
    // Check if selectedPartName is a display name that maps to sessionPartName (internal ID)
    const matchingType = firefighterTypes.find(type => type.title === selectedPartName && type.id === sessionPartName);
    if (matchingType) {
      return true;
    }

    // Check if sessionPartName is a display name that maps to selectedPartName (internal ID)
    const reverseMatchingType = firefighterTypes.find(type => type.title === sessionPartName && type.id === selectedPartName);
    if (reverseMatchingType) {
      return true;
    }

    return false;
  };

  // Helper function to get the proper display name for a part
  const getDisplayName = (partName: string): string => {
    // First try to find it in predefined types
    const firefighterTypes = createFirefighterTypeData(t);
    const matchingType = firefighterTypes.find(type => type.id === partName || type.title === partName);
    
    if (matchingType) {
      return matchingType.title; // Always return the localized display name
    }
    
    // For custom parts, return as-is
    return partName;
  };

  useEffect(() => {
    loadSessions();
    
    // Listen for storage changes to update timeline
    const handleStorageChange = () => {
      loadSessions();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectedPartName, t]);

  const loadSessions = () => {
    const completedSessions = JSON.parse(localStorage.getItem('completedPartsJournalSessions') || '[]');
    
    // Filter by selected part if provided, using flexible matching
    let filteredSessions = completedSessions;
    if (selectedPartName) {
      filteredSessions = completedSessions.filter(
        (session: CompletedJournalSession) => isSessionForPart(session.partName, selectedPartName)
      );
    }
    
    // Sort by completion time, newest first
    const sortedSessions = filteredSessions.sort((a: CompletedJournalSession, b: CompletedJournalSession) => 
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
        <h3 className="text-lg font-semibold mb-2">
          {selectedPartName 
            ? t('partsJournal.noSessionsForPartTitle')
            : t('partsJournal.noSessionsTitle')
          }
        </h3>
        <p className="text-muted-foreground">
          {selectedPartName 
            ? t('partsJournal.noSessionsForPartMessage', { partName: selectedPartName })
            : t('partsJournal.noSessionsMessage')
          }
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const isExpanded = expandedSummaryId === session.id;
        const displayName = getDisplayName(session.partName);
        const imageId = getPartImageId(displayName, t);
        
        return (
          <Card key={session.id} className="p-4 w-full overflow-hidden">
            {/* Mobile-optimized layout */}
            <div className="space-y-3 w-full min-w-0">
              {/* Header with part name and date */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                  <div className="w-10 h-10 flex-shrink-0 relative rounded-lg overflow-hidden bg-primary/10">
                    <Image
                      src={`/images/${imageId}.jpg`}
                      alt={displayName}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base break-words leading-tight">
                      {displayName}
                    </h3>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate" title={formatDate(session.completionTime)}>
                        {formatDate(session.completionTime)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons - responsive layout */}
                <div className="flex items-start gap-1 flex-shrink-0 mt-0.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleSummary(session.id)}
                    className="flex items-center justify-center gap-1 text-xs px-2 h-8 min-w-0 max-w-24 sm:max-w-none"
                    title={t('partsJournal.showSummary')}
                  >
                    <FileText className="h-3 w-3 flex-shrink-0" />
                    <span className="hidden sm:inline text-xs truncate">{t('partsJournal.showSummary')}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-3 w-3 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-3 w-3 flex-shrink-0" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSession(session.id)}
                    className="text-destructive hover:text-destructive flex items-center justify-center px-2 h-8 w-8 flex-shrink-0"
                    title="Delete session"
                  >
                    <Trash2 className="h-3 w-3" />
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
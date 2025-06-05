'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useConsent } from '@/contexts/consent-context';
import { useI18n } from '@/contexts/i18n-context';
import { Cookie, Shield, Eye, Settings, RotateCcw } from 'lucide-react';

export function ConsentControlWidget() {
  const { consentState, openSettings, withdrawConsent, hasConsent } = useConsent();
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't show if user hasn't interacted yet (banner will handle first interaction)
  if (!consentState.hasUserInteracted) {
    return null;
  }

  const analyticsConsent = hasConsent('analytics');
  const preferencesConsent = hasConsent('preferences');
  const essentialConsent = hasConsent('essential'); // Always true

  const getConsentSummary = () => {
    const granted = [essentialConsent, analyticsConsent, preferencesConsent].filter(Boolean).length;
    return `${granted}/3`;
  };

  const getConsentStatus = () => {
    if (analyticsConsent && preferencesConsent) return 'all';
    if (!analyticsConsent && !preferencesConsent) return 'essential';
    return 'partial';
  };

  const getStatusColor = () => {
    const status = getConsentStatus();
    switch (status) {
      case 'all': return 'bg-emerald-500 text-white';
      case 'partial': return 'bg-amber-500 text-white';
      case 'essential': return 'bg-slate-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2">
        {/* Expanded Panel */}
        {isExpanded && (
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-4 w-80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-900 flex items-center gap-2">
                <Cookie className="h-4 w-4" />
                {t('consent.widget.title')}
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            {/* Consent Status Overview */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded bg-emerald-50 border border-emerald-200">
                <Shield className="h-3 w-3 text-emerald-600" />
                <span className="text-xs text-emerald-800 flex-1">{t('consent.widget.essential')}</span>
                <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                  {t('consent.widget.required')}
                </Badge>
              </div>

              <div className={`flex items-center gap-2 p-2 rounded border ${
                analyticsConsent 
                  ? 'bg-blue-50 border-blue-200 text-blue-800' 
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <Eye className="h-3 w-3" />
                <span className="text-xs flex-1">{t('consent.widget.analytics')}</span>
                <Badge variant={analyticsConsent ? 'default' : 'secondary'} className="text-xs">
                  {analyticsConsent ? t('consent.widget.enabled') : t('consent.widget.disabled')}
                </Badge>
              </div>

              <div className={`flex items-center gap-2 p-2 rounded border ${
                preferencesConsent 
                  ? 'bg-purple-50 border-purple-200 text-purple-800' 
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <Settings className="h-3 w-3" />
                <span className="text-xs flex-1">{t('consent.widget.preferences')}</span>
                <Badge variant={preferencesConsent ? 'default' : 'secondary'} className="text-xs">
                  {preferencesConsent ? t('consent.widget.enabled') : t('consent.widget.disabled')}
                </Badge>
              </div>
            </div>

            {/* Last Consent Date */}
            {consentState.lastConsentDate && (
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                {t('consent.widget.lastUpdated')}: {new Date(consentState.lastConsentDate).toLocaleDateString()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={openSettings}
                className="flex-1 text-xs"
              >
                {t('consent.widget.customize')}
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={withdrawConsent}
                    className="px-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('consent.widget.withdrawAll')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}

        {/* Compact Toggle Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`${getStatusColor()} hover:opacity-90 shadow-lg rounded-full w-12 h-12 p-0`}
            >
              <div className="flex flex-col items-center">
                <Cookie className="h-4 w-4" />
                <span className="text-xs font-medium">{getConsentSummary()}</span>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <div className="text-sm space-y-1">
              <p className="font-medium">{t('consent.widget.tooltip.title')}</p>
              <p>{t('consent.widget.tooltip.status')}: {getConsentSummary()} {t('consent.widget.tooltip.granted')}</p>
              <p className="text-xs opacity-75">{t('consent.widget.tooltip.click')}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
} 
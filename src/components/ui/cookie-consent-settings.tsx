'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useConsent } from '@/contexts/consent-context';
import { useI18n } from '@/contexts/i18n-context';
import { ConsentManager } from '@/lib/consent-manager';
import { Shield, Eye, Settings, Cookie, Info, AlertCircle } from 'lucide-react';

export function CookieConsentSettings() {
  const { showSettings, closeSettings, updateConsent, consentState, purposes } = useConsent();
  const { t } = useI18n();
  const [localDecisions, setLocalDecisions] = useState<Record<string, boolean>>({});

  // Initialize local state with current consent decisions
  useEffect(() => {
    if (showSettings) {
      const initialDecisions: Record<string, boolean> = {};
      purposes.forEach(purpose => {
        if (purpose.required) {
          initialDecisions[purpose.id] = true; // Essential cookies always enabled
        } else {
          initialDecisions[purpose.id] = consentState.currentDecisions[purpose.id] || false;
        }
      });
      setLocalDecisions(initialDecisions);
    }
  }, [showSettings, purposes, consentState.currentDecisions]);

  const handleToggle = (purposeId: string, enabled: boolean) => {
    const purpose = purposes.find(p => p.id === purposeId);
    if (purpose?.required) return; // Cannot toggle essential cookies

    setLocalDecisions(prev => ({
      ...prev,
      [purposeId]: enabled
    }));
  };

  const handleSave = () => {
    updateConsent(localDecisions);
  };

  const handleAcceptAll = () => {
    const allAccepted = ConsentManager.acceptAll();
    setLocalDecisions(allAccepted);
    updateConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const allRejected = ConsentManager.rejectAllNonEssential();
    setLocalDecisions(allRejected);
    updateConsent(allRejected);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'essential':
        return <Shield className="h-5 w-5 text-emerald-600" />;
      case 'analytics':
        return <Eye className="h-5 w-5 text-blue-600" />;
      case 'preferences':
        return <Settings className="h-5 w-5 text-purple-600" />;
      default:
        return <Cookie className="h-5 w-5 text-slate-600" />;
    }
  };

  const getCategoryColorClasses = (category: string) => {
    switch (category) {
      case 'essential':
        return 'border-emerald-200 bg-emerald-50';
      case 'analytics':
        return 'border-blue-200 bg-blue-50';
      case 'preferences':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-slate-200 bg-slate-50';
    }
  };

  return (
    <Dialog open={showSettings} onOpenChange={(open) => !open && closeSettings()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#EADDCB]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-[#0F5850] flex items-center gap-2">
            <Cookie className="h-6 w-6" />
            {t('cookie.settings.title')}
          </DialogTitle>
          <DialogDescription className="text-slate-700">
            {t('cookie.settings.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* GDPR Information */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800 space-y-1">
                  <p className="font-medium">{t('cookie.settings.gdprTitle')}</p>
                  <p>{t('cookie.settings.gdprDescription')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Categories */}
          <div className="space-y-4">
            {purposes.map((purpose) => (
              <Card key={purpose.id} className={`border ${getCategoryColorClasses(purpose.category)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(purpose.category)}
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {t(purpose.name)}
                          {purpose.required && (
                            <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                              {t('cookie.settings.required')}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {t(purpose.description)}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={localDecisions[purpose.id] || false}
                        onCheckedChange={(checked) => handleToggle(purpose.id, checked)}
                        disabled={purpose.required}
                        className={purpose.required ? 'opacity-50' : ''}
                      />
                    </div>
                  </div>
                </CardHeader>

                {/* Additional information for analytics category */}
                {purpose.id === 'analytics' && (
                  <CardContent className="pt-0">
                    <div className="p-3 rounded-lg bg-blue-100 border border-blue-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-800 space-y-1">
                          <p className="font-medium">{t('cookie.settings.analyticsDetails')}</p>
                          <ul className="space-y-1 ml-2">
                            <li>• {t('cookie.settings.analyticsFeature1')}</li>
                            <li>• {t('cookie.settings.analyticsFeature2')}</li>
                            <li>• {t('cookie.settings.analyticsFeature3')}</li>
                          </ul>
                          <p className="text-xs opacity-75">
                            {t('cookie.settings.analyticsProvider')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}

                {/* Additional information for preferences category */}
                {purpose.id === 'preferences' && (
                  <CardContent className="pt-0">
                    <div className="p-3 rounded-lg bg-purple-100 border border-purple-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-purple-800 space-y-1">
                          <p className="font-medium">{t('cookie.settings.preferencesDetails')}</p>
                          <ul className="space-y-1 ml-2">
                            <li>• {t('cookie.settings.preferencesFeature1')}</li>
                            <li>• {t('cookie.settings.preferencesFeature2')}</li>
                            <li>• {t('cookie.settings.preferencesFeature3')}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Consent History Information */}
          {consentState.consentRecord && (
            <Card className="border-slate-200 bg-slate-50">
              <CardContent className="pt-4">
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-medium">{t('cookie.settings.lastConsent')}</p>
                  <p>
                    {t('cookie.settings.consentDate')}: {new Date(consentState.lastConsentDate!).toLocaleDateString()}
                  </p>
                  <p>
                    {t('cookie.settings.consentMethod')}: {consentState.consentRecord.method}
                  </p>
                  <p>
                    {t('cookie.settings.refreshInfo')}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={handleRejectAll}
              className="flex-1 border-[#0F5850] text-[#0F5850] hover:bg-[#0F5850] hover:text-white"
            >
              {t('cookie.button.rejectAll')}
            </Button>
            
            <Button
              variant="secondary"
              onClick={closeSettings}
              className="flex-1"
            >
              {t('cookie.button.cancel')}
            </Button>
            
            <Button
              onClick={handleAcceptAll}
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white"
            >
              {t('cookie.button.acceptAll')}
            </Button>
            
            <Button
              onClick={handleSave}
              className="flex-1 bg-[#B5B7E8] hover:bg-[#A5A7D8] text-[#0F5850]"
            >
              {t('cookie.button.saveSettings')}
            </Button>
          </div>

          {/* Privacy Policy Link */}
          <div className="text-center pt-2">
            <a
              href="/privacy-policy"
              className="text-xs text-[#0F5850] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('cookie.link.privacyPolicy')}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
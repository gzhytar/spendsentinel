'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useConsent } from '@/contexts/consent-context';
import { useI18n } from '@/contexts/i18n-context';
import { Shield, Settings, Cookie, Eye } from 'lucide-react';

export function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectAll, openSettings, consentState } = useConsent();
  const { t } = useI18n();

  if (!showBanner) {
    return null;
  }

  const isRefresh = consentState.needsRefresh;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" />
      
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 max-h-[90vh] overflow-y-auto">
        <Card className="max-w-4xl mx-auto border-2 border-[#B5B7E8] shadow-2xl bg-[#EADDCB]/95 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <Cookie className="h-6 w-6 text-[#0F5850]" />
              </div>
              <div className="flex-1 space-y-2">
                <CardTitle className="text-[#0F5850] text-lg font-semibold flex items-center gap-2">
                  {isRefresh ? t('cookie.banner.titleRefresh') : t('cookie.banner.title')}
                  {isRefresh && (
                    <Badge variant="outline" className="text-xs border-[#B5B7E8] text-[#0F5850]">
                      {t('cookie.banner.refreshBadge')}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-slate-700 text-sm leading-relaxed">
                  {isRefresh ? t('cookie.banner.descriptionRefresh') : t('cookie.banner.description')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Cookie Categories Summary */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <Shield className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium text-emerald-900">{t('cookie.category.essential')}</div>
                  <div className="text-xs text-emerald-700">{t('cookie.category.essentialDesc')}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Eye className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-blue-900">{t('cookie.category.analytics')}</div>
                  <div className="text-xs text-blue-700">{t('cookie.category.analyticsDesc')}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 border border-purple-200">
                <Settings className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="text-sm font-medium text-purple-900">{t('cookie.category.preferences')}</div>
                  <div className="text-xs text-purple-700">{t('cookie.category.preferencesDesc')}</div>
                </div>
              </div>
            </div>

            {/* GDPR Compliance Notice */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  <strong>{t('cookie.gdpr.title')}</strong> {t('cookie.gdpr.description')}
                </p>
                <p>
                  {t('cookie.gdpr.rights')}
                </p>
              </div>
            </div>

            {/* Action Buttons - Equal Prominence */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {/* Reject All - Equally prominent */}
              <Button
                variant="outline"
                size="lg"
                onClick={rejectAll}
                className="flex-1 border-2 border-[#0F5850] text-[#0F5850] hover:bg-[#0F5850] hover:text-white font-semibold h-12"
              >
                {t('cookie.button.rejectAll')}
              </Button>

              {/* Customize - Secondary */}
              <Button
                variant="secondary"
                size="lg"
                onClick={openSettings}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 h-12"
              >
                {t('cookie.button.customize')}
              </Button>

              {/* Accept All - Equally prominent */}
              <Button
                size="lg"
                onClick={acceptAll}
                className="flex-1 bg-[#B5B7E8] hover:bg-[#A5A7D8] text-[#0F5850] font-semibold h-12 border-2 border-[#B5B7E8]"
              >
                {t('cookie.button.acceptAll')}
              </Button>
            </div>

            {/* Privacy Policy Link */}
            <div className="text-center">
              <a
                href="/privacy-policy"
                className="text-xs text-[#0F5850] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('cookie.link.privacyPolicy')}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useConsent } from '@/contexts/consent-context';
import { useI18n } from '@/contexts/i18n-context';
import { ConsentManager } from '@/lib/consent-manager';
import { Cookie, Shield, Eye, Settings, History, Download, Trash2 } from 'lucide-react';

export default function CookieSettingsPage() {
  const { openSettings, withdrawConsent, consentState, hasConsent } = useConsent();
  const { t } = useI18n();

  const consentHistory = ConsentManager.getConsentHistory();

  const handleDownloadData = () => {
    const data = {
      consentState,
      consentHistory,
      exportDate: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spendsentinel-consent-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearAllData = () => {
    if (confirm(t('cookie.settings.confirmClear'))) {
      ConsentManager.clearAllConsent();
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Cookie className="h-8 w-8 text-[#B5B7E8]" />
          <h1 className="text-3xl font-bold text-[#0F5850]">
            {t('cookie.settings.title')}
          </h1>
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          {t('cookie.settings.pageDescription')}
        </p>
      </div>

      {/* Current Consent Status */}
      <Card className="border-[#B5B7E8] bg-[#EADDCB]/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0F5850]">
            <Shield className="h-5 w-5" />
            {t('cookie.settings.currentStatus')}
          </CardTitle>
          <CardDescription>
            {t('cookie.settings.statusDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-emerald-900">{t('consent.widget.essential')}</span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800">
                {t('consent.widget.required')}
              </Badge>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg border ${
              hasConsent('analytics')
                ? 'bg-blue-50 border-blue-200'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-slate-900">{t('consent.widget.analytics')}</span>
              </div>
              <Badge variant={hasConsent('analytics') ? 'default' : 'secondary'}>
                {hasConsent('analytics') ? t('consent.widget.enabled') : t('consent.widget.disabled')}
              </Badge>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg border ${
              hasConsent('preferences')
                ? 'bg-purple-50 border-purple-200'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-slate-900">{t('consent.widget.preferences')}</span>
              </div>
              <Badge variant={hasConsent('preferences') ? 'default' : 'secondary'}>
                {hasConsent('preferences') ? t('consent.widget.enabled') : t('consent.widget.disabled')}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <Button onClick={openSettings} className="flex-1 bg-[#B5B7E8] hover:bg-[#A5A7D8] text-[#0F5850]">
              {t('consent.widget.customize')}
            </Button>
            <Button variant="outline" onClick={withdrawConsent} className="flex-1">
              {t('consent.widget.withdrawAll')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Consent History */}
      {consentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#0F5850]">
              <History className="h-5 w-5" />
              {t('cookie.settings.consentHistory')}
            </CardTitle>
            <CardDescription>
              {t('cookie.settings.historyDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {consentHistory.slice(-5).reverse().map((record) => (
                <div key={record.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">
                        {new Date(record.timestamp).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-600">
                        {t('cookie.settings.method')}: {record.method} | 
                        {t('cookie.settings.version')}: {record.version}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-600">
                        {record.decisions.filter(d => d.granted).length}/{record.decisions.length} {t('cookie.settings.categoriesEnabled')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0F5850]">
            <Download className="h-5 w-5" />
            {t('cookie.settings.dataManagement')}
          </CardTitle>
          <CardDescription>
            {t('cookie.settings.dataDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={handleDownloadData} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              {t('cookie.settings.downloadData')}
            </Button>
            <Button variant="destructive" onClick={handleClearAllData} className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" />
              {t('cookie.settings.clearAllData')}
            </Button>
          </div>
          
          <div className="text-xs text-slate-600 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <p>
              <strong>{t('cookie.settings.gdprNote')}</strong> {t('cookie.settings.gdprNoteText')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
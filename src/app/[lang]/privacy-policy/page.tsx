"use client";

import { useI18n } from '@/contexts/i18n-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Heart, FileText, Lock, Users, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { t } = useI18n();
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary">{t('privacyPolicy.title')}</h1>
          </div>
          <p className="text-muted-foreground">
            {t('privacyPolicy.lastUpdated', { date: currentDate })}
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              {t('privacyPolicy.sections.intro.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{t('privacyPolicy.sections.intro.content')}</p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t('privacyPolicy.sections.informationWeCollect.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{t('privacyPolicy.sections.informationWeCollect.financialInfo.title')}</h3>
              <ul className="space-y-2 ml-4">
                {(t('privacyPolicy.sections.informationWeCollect.financialInfo.items') as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{t('privacyPolicy.sections.informationWeCollect.emotionalData.title')}</h3>
              <ul className="space-y-2 ml-4">
                {(t('privacyPolicy.sections.informationWeCollect.emotionalData.items') as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{t('privacyPolicy.sections.informationWeCollect.technicalInfo.title')}</h3>
              <ul className="space-y-2 ml-4">
                {(t('privacyPolicy.sections.informationWeCollect.technicalInfo.items') as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t('privacyPolicy.sections.howWeUseInfo.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{t('privacyPolicy.sections.howWeUseInfo.primaryPurposes.title')}</h3>
              <ul className="space-y-2 ml-4">
                {(t('privacyPolicy.sections.howWeUseInfo.primaryPurposes.items') as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{t('privacyPolicy.sections.howWeUseInfo.aiProcessing.title')}</h3>
              <ul className="space-y-2 ml-4">
                {(t('privacyPolicy.sections.howWeUseInfo.aiProcessing.items') as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              {t('privacyPolicy.sections.dataSecurityAndProtection.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="leading-relaxed">{t('privacyPolicy.sections.dataSecurityAndProtection.securityFirst')}</p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{t('privacyPolicy.sections.dataSecurityAndProtection.technicalSafeguards.title')}</h3>
              <ul className="space-y-2 ml-4">
                {(t('privacyPolicy.sections.dataSecurityAndProtection.technicalSafeguards.items') as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{t('privacyPolicy.sections.dataSecurityAndProtection.accessControls.title')}</h3>
              <ul className="space-y-2 ml-4">
                {(t('privacyPolicy.sections.dataSecurityAndProtection.accessControls.items') as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t('privacyPolicy.sections.yourRights.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{t('privacyPolicy.sections.yourRights.accessAndControl.title')}</h3>
              <ul className="space-y-2 ml-4">
                {(t('privacyPolicy.sections.yourRights.accessAndControl.items') as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-red-600">{t('privacyPolicy.sections.yourRights.panicMode.title')}</h3>
              <ul className="space-y-2 ml-4">
                {(t('privacyPolicy.sections.yourRights.panicMode.items') as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Ethical Commitment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              {t('privacyPolicy.sections.ethicalCommitment.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{t('privacyPolicy.sections.ethicalCommitment.content')}</p>
          </CardContent>
        </Card>

        {/* Contact Us */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              {t('privacyPolicy.sections.contactUs.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed">{t('privacyPolicy.sections.contactUs.content')}</p>
            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:privacy@spendsentinel.app" className="text-primary hover:underline">
                {t('privacyPolicy.sections.contactUs.email')}
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('privacyPolicy.sections.contactUs.responseTime')}
            </p>
          </CardContent>
        </Card>

        {/* Trust Is Sacred */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Heart className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <p className="leading-relaxed font-medium text-primary">
                {t('privacyPolicy.sections.trustIsSacred')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
"use client";

import { useI18n } from '@/contexts/i18n-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertTriangle, Users, Heart, Shield, Mail } from 'lucide-react';

export default function TermsOfServicePage() {
  const { t } = useI18n();
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary">{t('termsOfService.title')}</h1>
          </div>
          <p className="text-muted-foreground">
            {t('termsOfService.lastUpdated', { date: currentDate })}
          </p>
        </div>

        {/* Welcome */}
        <Card>
          <CardContent className="pt-6">
            <p className="leading-relaxed text-center italic text-lg">
              {t('termsOfService.sections.welcome')}
            </p>
          </CardContent>
        </Card>

        {/* Acceptance of Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t('termsOfService.sections.acceptanceOfTerms.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{t('termsOfService.sections.acceptanceOfTerms.content')}</p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              {t('termsOfService.sections.serviceDescription.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed">{t('termsOfService.sections.serviceDescription.content')}</p>
            <ul className="space-y-2 ml-4">
              {(t('termsOfService.sections.serviceDescription.features') as string[]).map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Important Limitation */}
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">{t('common.importantLimitation')}</h3>
                <p className="leading-relaxed text-orange-700">
                  {t('termsOfService.sections.importantLimitation')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Eligibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t('termsOfService.sections.userEligibility.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                {t('termsOfService.sections.userEligibility.ageRequirements.title')}
              </h3>
              <ul className="space-y-2 ml-4">
                {(t('termsOfService.sections.userEligibility.ageRequirements.items') as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Protocol */}
        <Card id="emergency-protocol" className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              {t('termsOfService.sections.emergencyProtocol.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-red-700">
              {t('termsOfService.sections.emergencyProtocol.content')}
            </p>
            <ul className="space-y-2 ml-4">
              {(t('termsOfService.sections.emergencyProtocol.contacts') as string[]).map((contact: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm leading-relaxed text-red-700 font-medium">{contact}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              {t('termsOfService.sections.contactInfo.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed">{t('termsOfService.sections.contactInfo.content')}</p>
            <div className="grid gap-3">
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">{t('footer.generalSupport')}</p>
                  <a href="mailto:support@spendsentinel.com" className="text-primary hover:underline text-sm">
                    {t('termsOfService.sections.contactInfo.generalSupport')}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <FileText className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">{t('common.legalQuestions')}</p>
                  <a href="mailto:legal@spendsentinel.com" className="text-primary hover:underline text-sm">
                    {t('termsOfService.sections.contactInfo.legalQuestions')}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Shield className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">{t('footer.privacyQuestions')}</p>
                  <a href="mailto:privacy@spendsentinel.com" className="text-primary hover:underline text-sm">
                    {t('termsOfService.sections.contactInfo.privacyConcerns')}
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commitment */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Heart className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <p className="leading-relaxed font-medium text-primary">
                {t('termsOfService.sections.commitment')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
"use client";

import { useI18n } from '@/contexts/i18n-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Heart, FileText, Lock, Users, Mail, BarChart3 } from 'lucide-react';

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
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Analytics and Usage Data</h3>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Anonymized user journey patterns and navigation flows (only when actively engaging with onboarding)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Feature usage statistics (e.g., assessment type preferences, completion rates)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Session duration and interaction timing (aggregated and anonymized)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Temporary session identifiers for tracking complete user journeys (not linked to personal information)
                  </span>
                </li>
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
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Analytics and User Experience Improvement</h3>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Analyze anonymized usage patterns to identify areas where users might struggle or succeed in our onboarding process
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Optimize the user interface and experience to be more intuitive and trauma-informed
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Understand which features are most valuable for users&apos; financial wellness journey
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Ensure our application design remains accessible and non-triggering for all users
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Analytics and Usage Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Analytics and Usage Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <p className="leading-relaxed text-blue-800 dark:text-blue-200">
                <strong>Privacy-First Analytics:</strong> We collect anonymized usage patterns to improve your experience while protecting your personal information and maintaining trauma-informed principles.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">What We Track</h3>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong>User Journey Patterns:</strong> How users navigate through our onboarding process (button clicks, page transitions, feature usage)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Feature Engagement:</strong> Which assessment types users prefer (quick discovery vs. deep assessment)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Completion Rates:</strong> Where users might struggle or succeed in our onboarding flow
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Session Duration:</strong> Time spent on different parts of the application (anonymized and aggregated)
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-green-600">What We DO NOT Track</h3>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Personal Content:</strong> We never track your journal entries, assessment responses, or personal financial details
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Individual Behavior:</strong> All analytics are aggregated and anonymized - we analyze patterns, not individuals
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Personal Identifiers:</strong> We use temporary session IDs, not personal information, to track user journeys
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Sensitive Financial Data:</strong> Only general category information (e.g., &quot;living expenses&quot;) is tracked, never specific amounts or descriptions
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">How We Use Analytics</h3>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Improve User Experience:</strong> Identify where users might get stuck or confused in our onboarding process
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Feature Development:</strong> Understand which features are most helpful for users&apos; financial wellness journey
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Optimize Flow:</strong> Make the onboarding experience more intuitive and less overwhelming
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Trauma-Informed Design:</strong> Ensure our application feels safe and non-triggering for all users
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Your Control Over Analytics</h3>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong>Automatic & Consensual:</strong> Analytics tracking only begins when you actively engage with our onboarding flow by clicking &quot;Explore my financial parts.&quot; 
                  You can opt out of analytics through your browser settings or by contacting us directly. The application will function fully without analytics tracking.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Third-Party Analytics</h3>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Google Analytics 4:</strong> We use GA4 for anonymized usage analytics with enhanced privacy settings enabled
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Data Processing:</strong> All analytics data is processed in accordance with GDPR and privacy-first principles
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Data Retention:</strong> Analytics data is automatically deleted according to our retention policies and your privacy preferences
                  </span>
                </li>
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
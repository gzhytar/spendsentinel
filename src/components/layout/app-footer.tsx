"use client";

import Link from 'next/link';
import { Shield, Heart, Mail, AlertTriangle } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';

export function AppFooter() {
  const { t, locale } = useI18n();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-8 border-t bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          {/* Brand and Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">{t('common.appName')}</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">{t('footer.legal')}</h4>
            <div className="flex flex-col space-y-1">
              <Link 
                href={`/${locale}/privacy-policy`}
                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <Shield className="h-3 w-3" />
                {t('footer.privacyPolicy')}
              </Link>
              <Link 
                href={`/${locale}/terms-of-service`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t('footer.termsOfService')}
              </Link>
            </div>
          </div>

          {/* Contact and Support */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">{t('footer.support')}</h4>
            <div className="flex flex-col space-y-1">
              <Link 
                href={`/${locale}/terms-of-service#emergency-protocol`}
                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <AlertTriangle className="h-3 w-3" />
                {t('footer.emergencyProtocol')}
              </Link>
              <a 
                href="mailto:privacy@innerbalance.app"
                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <Mail className="h-3 w-3" />
                {t('footer.privacyQuestions')}
              </a>
              <a 
                href="mailto:support@innerbalance.app"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t('footer.generalSupport')}
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <strong>{t('footer.disclaimerLabel')}:</strong> {t('footer.disclaimer')}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
            <p>
              © {currentYear} {t('common.appName')}. {t('footer.allRightsReserved')}
            </p>
            <p className="text-center sm:text-right">
              {t('footer.madeWithLove')} <Heart className="h-3 w-3 inline text-red-500" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 
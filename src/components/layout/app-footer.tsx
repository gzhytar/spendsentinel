"use client";

import Link from 'next/link';
import { Shield, Heart, Mail, AlertTriangle, Cookie } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { BuyMeCoffeeButton } from '@/components/common/buy-me-coffee-button';
import { useMonetizationVisibility } from '@/hooks/use-monetization-visibility';
import { useConsent } from '@/contexts/consent-context';

export function AppFooter() {
  const { t, locale } = useI18n();
  const currentYear = new Date().getFullYear();
  const { showSupportMention } = useMonetizationVisibility();
  const { openSettings } = useConsent();
  
  return (
    <footer className="mt-16 border-t bg-gradient-to-br from-background to-muted/20">
      {/* Support Section */}
      {showSupportMention && (
        <div className="border-b bg-primary/5">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">
                  {t('footer.supportMessage')}
                </p>
              </div>
              <BuyMeCoffeeButton 
                placement="footer"
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold text-lg text-foreground">{t('common.appName')}</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-base">{t('footer.legal')}</h4>
            <div className="flex flex-col space-y-3">
              <Link 
                href={`/${locale}/privacy-policy`}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 text-sm group"
              >
                <Shield className="h-4 w-4 group-hover:scale-110 transition-transform" />
                {t('footer.privacyPolicy')}
              </Link>
              <Link 
                href={`/${locale}/terms-of-service`}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
              >
                {t('footer.termsOfService')}
              </Link>
              <button
                onClick={openSettings}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 text-sm text-left group"
              >
                <Cookie className="h-4 w-4 group-hover:scale-110 transition-transform" />
                {t('cookie.settings.title')}
              </button>
            </div>
          </div>

          {/* Contact and Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-base">{t('footer.support')}</h4>
            <div className="flex flex-col space-y-3">
              <Link 
                href={`/${locale}/terms-of-service#emergency-protocol`}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 text-sm group"
              >
                <AlertTriangle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                {t('footer.emergencyProtocol')}
              </Link>
              <a 
                href="mailto:privacy@spendsentinel.com"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 text-sm group"
              >
                <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                {t('footer.privacyQuestions')}
              </a>
              <a 
                href="mailto:support@spendsentinel.com"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
              >
                {t('footer.generalSupport')}
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gradient-to-r from-muted/20 to-muted/10 rounded-xl border border-muted/50">
          <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-4xl mx-auto">
            <strong className="text-foreground">{t('footer.disclaimerLabel')}:</strong> {t('footer.disclaimer')}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-muted/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-muted-foreground font-medium">
              © {currentYear} {t('common.appName')}. {t('footer.allRightsReserved')}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{t('footer.madeWithLove')}</span>
              <Heart className="h-3 w-3 text-red-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 
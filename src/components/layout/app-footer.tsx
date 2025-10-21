"use client";

import Link from 'next/link';
import { Shield, Heart, Mail, AlertTriangle, Cookie } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { BuyMeCoffeeButton } from '@/components/common/buy-me-coffee-button';
import { useMonetizationVisibility } from '@/hooks/use-monetization-visibility';
import { useConsent } from '@/contexts/consent-context';

// Social Media Icons
const TwitterIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const BlueskyIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 568 501" fill="currentColor">
    <path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.209C491.866-1.611 568-28.906 568 57.947c0 27.443-28.25 290.224-42.375 316.464-9.438 17.509-45.781 27.443-71.688 27.443-37.438 0-77.25-11.313-77.25-59.688 0-32.25 18.844-79.875 25.719-114.75-31.875 37.438-77.25 114.75-115.406 114.75s-83.531-77.313-115.406-114.75c6.875 34.875 25.719 82.5 25.719 114.75 0 48.375-39.813 59.688-77.25 59.688-25.906 0-62.25-9.934-71.688-27.443C28.25 348.171 0 85.39 0 57.947 0-28.906 76.134-1.611 123.121 33.664z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

interface SocialShareLink {
  name: string;
  shareUrl: string;
  icon: React.ComponentType;
  label: string;
  className: string;
}

function SocialMediaSection() {
  const { t, locale } = useI18n();
  
  // Create a shareable message and URL for the app
  // Use a consistent URL to avoid hydration mismatch
  const appUrl = `https://spendsentinel.com/${locale}`;
  const shareMessage = encodeURIComponent(t('footer.social.shareMessage'));
  const encodedUrl = encodeURIComponent(appUrl);
  
  const socialShareLinks: SocialShareLink[] = [
    {
      name: 'Twitter',
      shareUrl: `https://x.com/intent/tweet?text=${shareMessage}&url=${encodedUrl}&via=SpendSentinel`,
      icon: TwitterIcon,
      label: t('footer.social.twitter'),
      className: 'bg-black/10 hover:bg-black/20 text-foreground'
    },
    {
      name: 'Bluesky',
      shareUrl: `https://bsky.app/intent/compose?text=${shareMessage}%20${encodedUrl}%20via%20@spendsentinel.bsky.social`,
      icon: BlueskyIcon,
      label: t('footer.social.bluesky'),
      className: 'bg-sky-500/10 hover:bg-sky-500/20 text-foreground'
    },
    {
      name: 'Facebook',
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${shareMessage}`,
      icon: FacebookIcon,
      label: t('footer.social.facebook'),
      className: 'bg-blue-600/10 hover:bg-blue-600/20 text-foreground'
    },
    {
      name: 'LinkedIn',
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodeURIComponent('SpendSentinel - Financial Wellness')}&summary=${shareMessage}`,
      icon: LinkedInIcon,
      label: t('footer.social.linkedin'),
      className: 'bg-blue-700/10 hover:bg-blue-700/20 text-foreground'
    },
    {
      name: 'Instagram',
      shareUrl: `https://www.instagram.com/create/story/?text=${shareMessage}%20${encodedUrl}`,
      icon: InstagramIcon,
      label: t('footer.social.instagram'),
      className: 'bg-pink-500/10 hover:bg-pink-500/20 text-foreground'
    }
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-foreground text-base">{t('footer.social.title')}</h4>
      <div className="flex flex-wrap gap-3">
        {socialShareLinks.map((social) => {
          const IconComponent = social.icon;
          return (
            <a
              key={social.name}
              href={social.shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg ${social.className} transition-all duration-200 group`}
              aria-label={social.label}
              title={social.label}
            >
              <IconComponent />
            </a>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {t('footer.social.shareDescription')}
      </p>
    </div>
  );
}

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
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

          {/* Social Media */}
          <SocialMediaSection />

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
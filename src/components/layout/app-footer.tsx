"use client";

import Link from 'next/link';
import { Shield, Heart, Mail } from 'lucide-react';
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
              <span className="font-semibold text-primary">InnerBalance</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              AI-powered financial therapy and coaching for emotional well-being and financial health.
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Legal</h4>
            <div className="flex flex-col space-y-1">
              <Link 
                href="/privacy-policy.html" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <Shield className="h-3 w-3" />
                Privacy Policy
              </Link>
              <Link 
                href="/terms-of-service.html" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Contact and Support */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Support</h4>
            <div className="flex flex-col space-y-1">
              <a 
                href="mailto:privacy@innerbalance.app"
                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <Mail className="h-3 w-3" />
                Privacy Questions
              </a>
              <a 
                href="mailto:support@innerbalance.app"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                General Support
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <strong>Disclaimer:</strong> InnerBalance is a digital wellness tool and does not replace professional financial advice or mental health treatment. 
            If you're experiencing a mental health crisis, please contact your local emergency services or a mental health professional.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
            <p>
              © {currentYear} InnerBalance. All rights reserved.
            </p>
            <p className="text-center sm:text-right">
              Made with <Heart className="h-3 w-3 inline text-red-500" /> awareness in Czech Republic
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 
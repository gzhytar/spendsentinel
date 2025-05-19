import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { PanicModeProvider } from '@/contexts/panic-mode-context';
import { I18nProvider } from '@/contexts/i18n-context';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'InnerBalance',
  description: 'Find your financial peace with InnerBalance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <I18nProvider>
          <div className="fixed top-4 right-4 z-50">
            <LanguageSwitcher />
          </div>
          <PanicModeProvider>
            {children}
            <Toaster />
          </PanicModeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

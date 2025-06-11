import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { PanicModeProvider } from '@/contexts/panic-mode-context';
import { MetaViewport } from '@/components/seo/meta-viewport';
import { StructuredData } from '@/components/seo/structured-data';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Generate metadata for the root layout
export const metadata: Metadata = generateSEOMetadata('/', 'en');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <MetaViewport />
        <StructuredData pathname="/" locale="en" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <PanicModeProvider>
          {children}
          <Toaster />
        </PanicModeProvider>
      </body>
    </html>
  );
}

'use client';

import { useI18n } from '@/contexts/i18n-context';
import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface SocialShareButtonsProps {
  articleTitle: string;
  articleUrl: string;
  className?: string;
}

// Social media icons as SVG components
const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

/* const LinkedInIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
); */

const BlueskyIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 2.104.139 3.25.139 5.5.139 5.5s.278 1.775 1.319 2.8c2.04 2.01 5.418 1.41 5.418 1.41-.927 2.493-2.946 8.576-6.897 9.536-.897.218-1.559.888-1.559 1.684 0 .776.662 1.405 1.479 1.405h.08c4.722 0 8.74-2.187 11.02-5.436 2.28 3.249 6.298 5.436 11.02 5.436h.08c.817 0 1.479-.629 1.479-1.405 0-.796-.662-1.466-1.559-1.684-3.951-.96-5.97-7.043-6.897-9.536 0 0 3.378.6 5.418-1.41C22.583 7.275 22.861 5.5 22.861 5.5s0-2.25-.763-3.396C21.439 1.266 20.434.944 17.798 2.805 15.046 4.747 13.087 8.686 12 10.8z"/>
  </svg>
);

const ThreadsIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.01 1.5 8.434 2.35 5.58 3.995 3.529 5.845 1.225 8.598.044 12.179.02h.014c3.581.024 6.334 1.205 8.184 3.509C21.65 5.58 22.5 8.434 22.5 12.01c0 3.576-.85 6.43-2.495 8.481C18.155 22.795 15.402 23.976 11.821 24h.365zm4.896-7.078c-.346-.997-1.036-1.821-1.892-2.262 2.263-.688 3.724-2.615 3.724-5.435 0-3.724-2.615-6.339-6.339-6.339s-6.339 2.615-6.339 6.339c0 2.82 1.461 4.747 3.724 5.435-.856.441-1.546 1.265-1.892 2.262-.346.997-.346 2.093 0 3.09.346.997 1.036 1.821 1.892 2.262.856.441 1.892.662 2.928.662s2.072-.221 2.928-.662c.856-.441 1.546-1.265 1.892-2.262.346-.997.346-2.093 0-3.09z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

/* const RedditIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
); */

export function SocialShareButtons({ articleTitle, articleUrl, className = '' }: SocialShareButtonsProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  
  const encodedTitle = encodeURIComponent(articleTitle);
  const encodedUrl = encodeURIComponent(articleUrl);
  const shareText = encodeURIComponent(`${articleTitle} - Check out this insightful article on financial wellness!`);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareButtons = [
    {
      name: 'Twitter/X',
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}&via=SpendSentinel`,
      icon: <TwitterIcon />,
      className: 'bg-black hover:bg-gray-800 text-white',
      ariaLabel: t('social.share.twitter.ariaLabel')
    },
    /* {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${shareText}`,
      icon: <LinkedInIcon />,
      className: 'bg-blue-700 hover:bg-blue-800 text-white',
      ariaLabel: t('social.share.linkedin.ariaLabel')
    }, */
         {
       name: 'Facebook',
       url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${shareText}`,
       icon: <FacebookIcon />,
       className: 'bg-blue-600 hover:bg-blue-700 text-white',
       ariaLabel: t('social.share.facebook.ariaLabel')
     },
    {
      name: 'Bluesky',
      url: `https://bsky.app/intent/compose?text=${shareText}%20${encodedUrl}%20via%20@spendsentinel.bsky.social`,
      icon: <BlueskyIcon />,
      className: 'bg-sky-500 hover:bg-sky-600 text-white',
      ariaLabel: t('social.share.bluesky.ariaLabel')
    },
    {
      name: 'Threads',
      url: `https://www.threads.net/intent/post?text=${shareText}%20${encodedUrl}%20@spendsentinel`,
      icon: <ThreadsIcon />,
      className: 'bg-gray-900 hover:bg-gray-800 text-white',
      ariaLabel: t('social.share.threads.ariaLabel')
    },
 /*         {
       name: 'Reddit',
       url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
       icon: <RedditIcon />,
       className: 'bg-orange-600 hover:bg-orange-700 text-white',
       ariaLabel: t('social.share.reddit.ariaLabel')
     } */
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Share heading */}
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Share2 className="w-4 h-4" />
        <span>Share this article</span>
      </div>
      
      {/* Social share buttons */}
      <div className="flex flex-wrap gap-3">
        {shareButtons.map((button) => (
          <a
            key={button.name}
            href={button.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${button.className}`}
            aria-label={button.ariaLabel}
          >
            {button.icon}
            <span className="hidden sm:inline">{button.name}</span>
          </a>
        ))}
        
        {/* Copy link button */}
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Copy article link to clipboard"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
      
      {/* Follow section */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
          <span>Follow SpendSentinel</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.instagram.com/spendsentinel/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            aria-label={t('social.follow.instagram.ariaLabel')}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.52.204 5.036.388a5.918 5.918 0 0 0-2.14 1.393A5.918 5.918 0 0 0 1.503 4.92c-.184.484-.306 1.058-.34 2.005C1.128 7.873 1.115 8.28 1.115 11.901c0 3.621.013 4.028.048 4.976.034.947.156 1.521.34 2.005a5.918 5.918 0 0 0 1.393 2.14 5.918 5.918 0 0 0 2.14 1.393c.484.184 1.058.306 2.005.34.948.035 1.355.048 4.976.048 3.621 0 4.028-.013 4.976-.048.947-.034 1.521-.156 2.005-.34a5.918 5.918 0 0 0 2.14-1.393 5.918 5.918 0 0 0 1.393-2.14c.184-.484.306-1.058.34-2.005.035-.948.048-1.355.048-4.976 0-3.621-.013-4.028-.048-4.976-.034-.947-.156-1.521-.34-2.005a5.918 5.918 0 0 0-1.393-2.14A5.918 5.918 0 0 0 19.078.388c-.484-.184-1.058-.306-2.005-.34C16.125.013 15.718 0 12.097 0h-.08zm-.05 2.168c3.536 0 3.954.013 5.35.048.29.013.447.06.552.1.139.054.238.118.342.222.104.104.168.203.222.342.04.105.087.262.1.552.035 1.396.048 1.814.048 5.35 0 3.536-.013 3.954-.048 5.35-.013.29-.06.447-.1.552-.054.139-.118.238-.222.342-.104.104-.203.168-.342.222-.105.04-.262.087-.552.1-1.396.035-1.814.048-5.35.048-3.536 0-3.954-.013-5.35-.048-.29-.013-.447-.06-.552-.1-.139-.054-.238-.118-.342-.222-.104-.104-.168-.203-.222-.342-.04-.105-.087-.262-.1-.552-.035-1.396-.048-1.814-.048-5.35 0-3.536.013-3.954.048-5.35.013-.29.06-.447.1-.552.054-.139.118-.238.222-.342.104-.104.203-.168.342-.222.105-.04.262-.087.552-.1 1.396-.035 1.814-.048 5.35-.048z"/>
              <path d="M12.017 15.33a3.413 3.413 0 1 1 0-6.826 3.413 3.413 0 0 1 0 6.826zm0-8.67a5.257 5.257 0 1 0 0 10.514 5.257 5.257 0 0 0 0-10.514zm6.718-1.17a1.229 1.229 0 1 1-2.458 0 1.229 1.229 0 0 1 2.458 0z"/>
            </svg>
            <span className="hidden sm:inline">Instagram</span>
          </a>
          <a
            href="https://www.tiktok.com/@spendsentinel?lang=en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-black hover:bg-gray-800 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            aria-label={t('social.follow.tiktok.ariaLabel')}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            <span className="hidden sm:inline">TikTok</span>
          </a>
        </div>
      </div>
    </div>
  );
} 
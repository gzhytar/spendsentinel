'use client';

import { useI18n } from '@/contexts/i18n-context';

interface SocialShareButtonsProps {
  articleTitle: string;
  articleUrl: string;
  className?: string;
}

export function SocialShareButtons({ articleTitle, articleUrl, className = '' }: SocialShareButtonsProps) {
  const { t } = useI18n();
  
  const encodedTitle = encodeURIComponent(articleTitle);
  const encodedUrl = encodeURIComponent(articleUrl);
  
  return (
    <div className={`flex justify-center space-x-3 my-8 flex-wrap gap-y-2 ${className}`}>
      <a 
        href={`https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}%20via%20@spendsentinel.bsky.social`} 
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('social.share.bluesky.ariaLabel')}
      >
        {t('social.share.bluesky.label')}
      </a>
      <a 
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=SpendSentinel`} 
        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('social.share.twitter.ariaLabel')}
      >
        {t('social.share.twitter.label')}
      </a>
      <a 
        href={`https://www.threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}%20@spendsentinel`} 
        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('social.share.threads.ariaLabel')}
      >
        {t('social.share.threads.label')}
      </a>
      <a 
        href="https://www.instagram.com/spendsentinel/" 
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors text-sm"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('social.follow.instagram.ariaLabel')}
      >
        {t('social.follow.instagram.label')}
      </a>
      <a 
        href="https://www.tiktok.com/@spendsentinel?lang=en" 
        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('social.follow.tiktok.ariaLabel')}
      >
        {t('social.follow.tiktok.label')}
      </a>
      <a 
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} 
        className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors text-sm"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('social.share.linkedin.ariaLabel')}
      >
        {t('social.share.linkedin.label')}
      </a>
    </div>
  );
} 
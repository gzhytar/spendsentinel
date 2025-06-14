export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  openGraph?: {
    title: string;
    description: string;
    image?: string;
    type?: 'website' | 'article';
    siteName?: string;
  };
  twitter?: {
    card: 'summary' | 'summary_large_image' | 'app' | 'player';
    title?: string;
    description?: string;
    image?: string;
    site?: string;
    creator?: string;
  };
  robots?: string;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
}

export interface PageSEOData {
  title: string;
  description: string;
  keywords?: string[];
  type?: 'website' | 'article';
  image?: string;
}

// Base domain configuration
export const SITE_CONFIG = {
  name: 'SpendSentinel',
  tagline: 'Financial Wellness Through Self-Discovery',
  domain: process.env.NEXT_PUBLIC_SITE_URL || 'https://spendsentinel.com',
  twitter: '@spendsentinel',
  defaultImage: '/og-image.jpg', // 1200x630 Open Graph image
  logo: '/logo.svg', // SVG logo for structured data
  defaultLocale: 'en',
  supportedLocales: ['en', 'cs', 'uk', 'ru'] as const,
} as const;

// Page-specific SEO configurations
export const PAGE_SEO_CONFIG: Record<string, Record<string, PageSEOData>> = {
  // Landing/Homepage
  '/': {
    en: {
      title: 'SpendSentinel - Transform Your Relationship with Money',
      description: 'Pause · Notice · Choose. Transform your relationship with money through compassionate self-discovery using IFS therapy principles.',
      keywords: ['financial therapy', 'money mindset', 'financial wellness', 'IFS therapy', 'behavioral finance', 'money anxiety'],
      type: 'website',
    },
    cs: {
      title: 'SpendSentinel - Transformujte svůj vztah k penězům',
      description: 'Zastavte se · Všimněte si · Vyberte si. Transformujte svůj vztah k penězům prostřednictvím soucitného sebepoznání.',
      keywords: ['finanční terapie', 'peněžní myšlení', 'finanční pohoda', 'IFS terapie', 'chování s penězi'],
      type: 'website',
    },
    uk: {
      title: 'SpendSentinel - Трансформуйте стосунки з грошима',
      description: 'Зупинись · Помітити · Обрати. Трансформуйте свої стосунки з грошима через співчутливе самопізнання.',
      keywords: ['фінансова терапія', 'грошова психологія', 'фінансове благополуччя', 'IFS терапія'],
      type: 'website',
    },
    ru: {
      title: 'SpendSentinel - Трансформируйте отношения с деньгами',
      description: 'Остановись · Заметить · Выбрать. Трансформируйте свои отношения с деньгами через сострадательное самопознание.',
      keywords: ['финансовая терапия', 'денежная психология', 'финансовое благополучие', 'IFS терапия'],
      type: 'website',
    },
  },
  
  // Self Assessment
  '/self-assessment': {
    en: {
      title: 'Financial Self-Assessment - Discover Your Money Parts | SpendSentinel',
      description: 'Take our evidence-based financial self-assessment to identify your internal money parts and understand your financial behaviors.',
      keywords: ['financial self assessment', 'money parts quiz', 'financial personality test', 'financial therapy assessment'],
      type: 'website',
    },
    cs: {
      title: 'Finanční sebehodnocení - Objevte své peněžní části | SpendSentinel',
      description: 'Absolvujte naše vědecky podložené finanční sebehodnocení pro identifikaci vašich vnitřních peněžních částí.',
      keywords: ['finanční sebehodnocení', 'peněžní kvíz', 'test finanční osobnosti'],
      type: 'website',
    },
    uk: {
      title: 'Фінансова самооцінка - Відкрийте свої грошові частини | SpendSentinel',
      description: 'Пройдіть нашу науково обґрунтовану фінансову самооцінку для ідентифікації ваших внутрішніх грошових частин.',
      keywords: ['фінансова самооцінка', 'грошовий квіз', 'тест фінансової особистості'],
      type: 'website',
    },
    ru: {
      title: 'Финансовая самооценка - Откройте свои денежные части | SpendSentinel',
      description: 'Пройдите нашу научно обоснованную финансовую самооценку для идентификации ваших внутренних денежных частей.',
      keywords: ['финансовая самооценка', 'денежный квиз', 'тест финансовой личности'],
      type: 'website',
    },
  },
  
  // Daily Check-in
  '/daily-checkin': {
    en: {
      title: 'Daily Financial Check-in - Mindful Money Management | SpendSentinel',
      description: 'Start your daily financial check-in practice. Track expenses mindfully and build awareness of your financial patterns.',
      keywords: ['daily financial check-in', 'mindful spending', 'expense tracking', 'financial mindfulness'],
      type: 'website',
    },
    cs: {
      title: 'Denní finanční check-in - Vědomé hospodaření | SpendSentinel',
      description: 'Začněte svou praxi denního finančního check-inu. Sledujte výdaje vědomě a budujte povědomí o svých finančních vzorcích.',
      keywords: ['denní finanční kontrola', 'vědomé utrácení', 'sledování výdajů'],
      type: 'website',
    },
    uk: {
      title: 'Щоденна фінансова перевірка - Усвідомлене управління грошима | SpendSentinel',
      description: 'Почніть свою практику щоденної фінансової перевірки. Відслідковуйте витрати усвідомлено.',
      keywords: ['щоденна фінансова перевірка', 'усвідомлені витрати', 'відстеження витрат'],
      type: 'website',
    },
    ru: {
      title: 'Ежедневная финансовая проверка - Осознанное управление деньгами | SpendSentinel',
      description: 'Начните свою практику ежедневной финансовой проверки. Отслеживайте расходы осознанно.',
      keywords: ['ежедневная финансовая проверка', 'осознанные траты', 'отслеживание расходов'],
      type: 'website',
    },
  },
  
  // Parts Journal
  '/parts-journal': {
    en: {
      title: 'Financial Parts Journal - IFS Therapy for Money | SpendSentinel',
      description: 'Explore your financial parts through guided journaling using Internal Family Systems (IFS) therapy principles.',
      keywords: ['financial parts journal', 'IFS therapy money', 'financial self-therapy', 'money parts exploration'],
      type: 'website',
    },
    cs: {
      title: 'Deník finančních částí - IFS terapie pro peníze | SpendSentinel',
      description: 'Prozkoumejte své finanční části prostřednictvím vedeného psaní deníku pomocí principů IFS terapie.',
      keywords: ['deník finančních částí', 'IFS terapie peníze', 'finanční sebeterapie'],
      type: 'website',
    },
    uk: {
      title: 'Щоденник фінансових частин - IFS терапія для грошей | SpendSentinel',
      description: 'Досліджуйте свої фінансові частини через керований щоденник використовуючи принципи IFS терапії.',
      keywords: ['щоденник фінансових частин', 'IFS терапія гроші', 'фінансова самотерапія'],
      type: 'website',
    },
    ru: {
      title: 'Дневник финансовых частей - IFS терапия для денег | SpendSentinel',
      description: 'Исследуйте свои финансовые части через управляемое ведение дневника используя принципы IFS терапии.',
      keywords: ['дневник финансовых частей', 'IFS терапия деньги', 'финансовая самотерапия'],
      type: 'website',
    },
  },
  
  // Expense Highlighter
  '/expense-highlighter': {
    en: {
      title: 'Expense Highlighter - Visual Spending Analysis | SpendSentinel',
      description: 'Visualize and analyze your spending patterns with our intuitive expense highlighter and vision board tools.',
      keywords: ['expense analysis', 'spending visualization', 'financial vision board', 'expense categorization'],
      type: 'website',
    },
    cs: {
      title: 'Zvýrazňovač výdajů - Vizuální analýza utrácení | SpendSentinel',
      description: 'Vizualizujte a analyzujte své vzorce utrácení pomocí našeho intuitivního zvýrazňovače výdajů.',
      keywords: ['analýza výdajů', 'vizualizace utrácení', 'finanční vision board'],
      type: 'website',
    },
    uk: {
      title: 'Виділення витрат - Візуальний аналіз витрат | SpendSentinel',
      description: 'Візуалізуйте та аналізуйте свої моделі витрат за допомогою наших інтуїтивних інструментів.',
      keywords: ['аналіз витрат', 'візуалізація витрат', 'фінансова дошка візій'],
      type: 'website',
    },
    ru: {
      title: 'Выделение расходов - Визуальный анализ трат | SpendSentinel',
      description: 'Визуализируйте и анализируйте свои модели трат с помощью наших интуитивных инструментов.',
      keywords: ['анализ расходов', 'визуализация трат', 'финансовая доска визуализации'],
      type: 'website',
    },
  },

  // Privacy Policy
  '/privacy-policy': {
    en: {
      title: 'Privacy Policy - Your Data Protection | SpendSentinel',
      description: 'Learn how SpendSentinel protects your privacy and handles your financial wellness data with complete transparency.',
      keywords: ['privacy policy', 'data protection', 'financial app privacy', 'GDPR compliance'],
      type: 'article',
    },
    cs: {
      title: 'Zásady ochrany osobních údajů - Ochrana vašich dat | SpendSentinel',
      description: 'Zjistěte, jak SpendSentinel chrání vaše soukromí a zachází s vašimi daty o finanční pohodě.',
      keywords: ['zásady ochrany osobních údajů', 'ochrana dat', 'soukromí aplikace'],
      type: 'article',
    },
    uk: {
      title: 'Політика конфіденційності - Захист ваших даних | SpendSentinel',
      description: 'Дізнайтеся, як SpendSentinel захищає вашу конфіденційність та обробляє ваші дані про фінансове благополуччя.',
      keywords: ['політика конфіденційності', 'захист даних', 'конфіденційність додатку'],
      type: 'article',
    },
    ru: {
      title: 'Политика конфиденциальности - Защита ваших данных | SpendSentinel',
      description: 'Узнайте, как SpendSentinel защищает вашу конфиденциальность и обрабатывает ваши данные о финансовом благополучии.',
      keywords: ['политика конфиденциальности', 'защита данных', 'конфиденциальность приложения'],
      type: 'article',
    },
  },

  // Terms of Service
  '/terms-of-service': {
    en: {
      title: 'Terms of Service - Usage Guidelines | SpendSentinel',
      description: 'Read our terms of service to understand your rights and responsibilities when using SpendSentinel.',
      keywords: ['terms of service', 'usage guidelines', 'user agreement', 'financial app terms'],
      type: 'article',
    },
    cs: {
      title: 'Podmínky služby - Pravidla používání | SpendSentinel',
      description: 'Přečtěte si naše podmínky služby pro pochopení vašich práv a povinností při používání SpendSentinel.',
      keywords: ['podmínky služby', 'pravidla používání', 'uživatelská smlouva'],
      type: 'article',
    },
    uk: {
      title: 'Умови обслуговування - Правила використання | SpendSentinel',
      description: 'Прочитайте наші умови обслуговування для розуміння ваших прав та обов\'язків при використанні SpendSentinel.',
      keywords: ['умови обслуговування', 'правила використання', 'угода користувача'],
      type: 'article',
    },
    ru: {
      title: 'Условия обслуживания - Правила использования | SpendSentinel',
      description: 'Прочитайте наши условия обслуживания для понимания ваших прав и обязанностей при использовании SpendSentinel.',
      keywords: ['условия обслуживания', 'правила использования', 'пользовательское соглашение'],
      type: 'article',
    },
  },

  // Feedback
  '/feedback': {
    en: {
      title: 'Feedback & Support - Help Us Improve | SpendSentinel',
      description: 'Share your feedback and help us improve SpendSentinel. Your voice matters in our mission to improve financial wellness.',
      keywords: ['feedback', 'user feedback', 'customer support', 'improve app', 'financial wellness feedback'],
      type: 'website',
    },
    cs: {
      title: 'Zpětná vazba a podpora - Pomozte nám zlepšit se | SpendSentinel',
      description: 'Sdílejte svou zpětnou vazbu a pomozte nám zlepšit SpendSentinel. Váš hlas je důležitý.',
      keywords: ['zpětná vazba', 'uživatelská zpětná vazba', 'zákaznická podpora'],
      type: 'website',
    },
    uk: {
      title: 'Зворотний зв\'язок та підтримка - Допоможіть нам покращитися | SpendSentinel',
      description: 'Поділіться своїм відгуком та допоможіть нам покращити SpendSentinel. Ваш голос важливий.',
      keywords: ['зворотний зв\'язок', 'відгуки користувачів', 'підтримка клієнтів'],
      type: 'website',
    },
    ru: {
      title: 'Обратная связь и поддержка - Помогите нам улучшиться | SpendSentinel',
      description: 'Поделитесь своими отзывами и помогите нам улучшить SpendSentinel. Ваш голос важен.',
      keywords: ['обратная связь', 'отзывы пользователей', 'поддержка клиентов'],
      type: 'website',
    },
  },

  // Blog
  '/blog': {
    en: {
      title: 'Financial Wellness Blog - Insights & Tips | SpendSentinel',
      description: 'Discover valuable insights, tips, and stories on your journey to financial health and money mindset transformation.',
      keywords: ['financial wellness blog', 'money mindset', 'financial tips', 'financial psychology', 'money management'],
      type: 'website',
    },
    cs: {
      title: 'Blog o Finanční Pohodě - Poznatky a Tipy | SpendSentinel',
      description: 'Objevte cenné poznatky, tipy a příběhy na vaší cestě k finančnímu zdraví a transformaci peněžního myšlení.',
      keywords: ['blog o finanční pohodě', 'peněžní myšlení', 'finanční tipy', 'finanční psychologie'],
      type: 'website',
    },
    uk: {
      title: 'Блог про Фінансове Благополуччя - Знання та Поради | SpendSentinel',
      description: 'Відкрийте цінні знання, поради та історії на вашому шляху до фінансового здоров\'я та трансформації грошового мислення.',
      keywords: ['блог про фінансове благополуччя', 'грошове мислення', 'фінансові поради', 'фінансова психологія'],
      type: 'website',
    },
    ru: {
      title: 'Блог о Финансовом Благополучии - Знания и Советы | SpendSentinel',
      description: 'Откройте ценные знания, советы и истории на вашем пути к финансовому здоровью и трансформации денежного мышления.',
      keywords: ['блог о финансовом благополучии', 'денежное мышление', 'финансовые советы', 'финансовая психология'],
      type: 'website',
    },
  },
};

// Utility function to generate SEO config for a page
export function generateSEOConfig(
  pathname: string,
  locale: string = 'en',
  customData?: Partial<PageSEOData>
): SEOConfig {
  // Get base page data
  const pageData = PAGE_SEO_CONFIG[pathname]?.[locale] || PAGE_SEO_CONFIG['/'][locale];
  
  // Merge with custom data
  const finalData = { ...pageData, ...customData };
  
  // Generate canonical URL - support /en/ path if specifically requested
  const canonicalUrl = `${SITE_CONFIG.domain}/${locale}${pathname}`;
  
  // Generate alternate language URLs
  const alternateLanguages: Record<string, string> = {};
  SITE_CONFIG.supportedLocales.forEach(lang => {
    alternateLanguages[lang] = `${SITE_CONFIG.domain}/${lang}${pathname}`;
  });
  
  // Build Open Graph image URL
  const ogImage = finalData.image 
    ? `${SITE_CONFIG.domain}${finalData.image}`
    : `${SITE_CONFIG.domain}${SITE_CONFIG.defaultImage}`;

  return {
    title: finalData.title,
    description: finalData.description,
    keywords: finalData.keywords,
    canonical: canonicalUrl,
    openGraph: {
      title: finalData.title,
      description: finalData.description,
      image: ogImage,
      type: finalData.type || 'website',
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: finalData.title,
      description: finalData.description,
      image: ogImage,
      site: SITE_CONFIG.twitter,
      creator: SITE_CONFIG.twitter,
    },
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
  };
} 
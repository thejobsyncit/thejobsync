import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/context/ToastContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#010a18',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.gojobsync.com'),
  title: {
    default: 'GoJobSync – Find Jobs in India | Top Job Portal for IT, Engineering & More',
    template: '%s | GoJobSync – India Job Portal',
  },
  description:
    'GoJobSync is a leading job portal in India. Search thousands of jobs in IT, Engineering, Sales, Finance & more. Apply online instantly. Employers: post jobs & find top talent today.',
  keywords: [
    'job portal India',
    'find jobs India',
    'apply for jobs online',
    'IT jobs India',
    'engineering jobs',
    'sales jobs',
    'finance jobs',
    'job vacancy India',
    'job search India',
    'recruitment platform India',
    'top job portal',
    'GoJobSync',
    'jobs in Chennai',
    'jobs in Bangalore',
    'jobs in Hyderabad',
    'jobs in Mumbai',
    'fresher jobs India',
    'work from home jobs India',
    'software developer jobs',
    'data science jobs India',
    'hire talent India',
    'post jobs India',
    'free job posting',
    'jobs',
    
  ],
  authors: [{ name: 'GoJobSync', url: 'https://www.gojobsync.com' }],
  creator: 'GoJobSync',
  publisher: 'GoJobSync',
  category: 'Jobs & Careers',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/loooo.jpeg',
    shortcut: '/loooo.jpeg',
    apple: '/loooo.jpeg',
  },
  openGraph: {
    title: 'GoJobSync – Find Jobs in India | Top Job Portal',
    description:
      'Search thousands of jobs in IT, Engineering, Sales, Finance & more across India. Apply online instantly on GoJobSync.',
    url: 'https://www.gojobsync.com',
    siteName: 'GoJobSync',
    images: [
      {
        url: '/loooo.jpeg',
        width: 1200,
        height: 630,
        alt: 'GoJobSync – India Top Job Portal',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoJobSync – Find Jobs in India | Top Job Portal',
    description:
      'Search thousands of jobs in IT, Engineering, Sales, Finance & more across India. Apply online instantly.',
    images: ['/loooo.jpeg'],
    site: '@gojobsync',
    creator: '@gojobsync',
  },
  verification: {
    google: 'JH1koYWVAU0cZR0o76BTtE_x3e7agrL0xn5XTXklBTs',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.gojobsync.com/#website',
        url: 'https://www.gojobsync.com',
        name: 'GoJobSync',
        description: 'Leading job portal in India. Find IT, Engineering, Sales & Finance jobs.',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.gojobsync.com/careers?search={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: 'en-IN',
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.gojobsync.com/#organization',
        name: 'GoJobSync',
        url: 'https://www.gojobsync.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.gojobsync.com/loooo.jpeg',
          width: 512,
          height: 512,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-9789569391',
          contactType: 'Customer Service',
          areaServed: 'IN',
          availableLanguage: ['English', 'Tamil'],
        },
        sameAs: [
          'https://www.linkedin.com/company/gojobsync',
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Crizone Business Center, Ambattur OT',
          addressLocality: 'Chennai',
          addressRegion: 'Tamil Nadu',
          postalCode: '600053',
          addressCountry: 'IN',
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({pageLanguage: 'en', autoDisplay: false}, 'google_translate_element');
            }
          `}
        </Script>
        <style dangerouslySetInnerHTML={{ __html: `
          body { top: 0 !important; }
          .skiptranslate iframe, .goog-te-banner-frame { display: none !important; }
          #google_translate_element { display: none !important; }
          .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
        `}} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <div id="google_translate_element"></div>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}

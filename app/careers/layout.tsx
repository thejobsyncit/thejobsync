import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { CandidateAuthProvider } from '@/context/CandidateAuthContext';
import { PortalThemeProvider } from '@/context/PortalThemeContext';

export const metadata: Metadata = {
  title: 'Browse Jobs in India – IT, Engineering, Sales & More | GoJobSync',
  description:
    'Find and apply for thousands of jobs in India on GoJobSync. Browse IT, Engineering, Sales, Finance, Data Science, HR and many more job categories. Apply online instantly.',
  keywords: [
    'jobs in India',
    'job search India',
    'IT jobs',
    'engineering jobs India',
    'apply for jobs online',
    'latest job openings',
    'job vacancies India',
    'fresher jobs',
    'job portal India 2025',
    'GoJobSync jobs',
  ],
  alternates: {
    canonical: 'https://www.gojobsync.com/careers',
  },
  openGraph: {
    title: 'Browse Jobs in India – IT, Engineering, Sales & More | GoJobSync',
    description:
      'Find and apply for thousands of jobs across India. Browse all categories and apply online instantly.',
    url: 'https://www.gojobsync.com/careers',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Jobs in India | GoJobSync',
    description: 'Find IT, Engineering, Sales & more jobs in India. Apply online on GoJobSync.',
  },
};

export default function CareersLayout({ children }: { children: ReactNode }) {
  return (
    <PortalThemeProvider>
      <CandidateAuthProvider>
        {children}
      </CandidateAuthProvider>
    </PortalThemeProvider>
  );
}

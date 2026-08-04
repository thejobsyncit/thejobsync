import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import JobDetailsClient from '@/components/JobDetailsClient';

// Generate dynamic SEO metadata for each job page
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const job = await prisma.jobRequirement.findUnique({
    where: { id },
    include: { client: true },
  });

  if (!job) return { title: 'Job Not Found | GoJobSync' };

  let skills: string[] = [];
  try { skills = JSON.parse(job.skills); } catch { }

  const company = job.client?.companyName || 'GoJobSync';
  const title = `${job.title} at ${company} – ${job.location} | GoJobSync`;
  const description = `Apply for ${job.title} at ${company} in ${job.location}. ${job.experience} experience required. Salary: ${job.salaryRange}. Skills: ${skills.slice(0, 4).join(', ')}. Apply on GoJobSync now.`;

  return {
    title,
    description,
    keywords: [
      job.title,
      company,
      job.location,
      'jobs in India',
      'apply now',
      ...skills.slice(0, 5),
      'GoJobSync',
    ],
    alternates: {
      canonical: `https://www.gojobsync.com/careers/jobs/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.gojobsync.com/careers/jobs/${id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.jobRequirement.findUnique({
    where: { id },
    include: { client: true }
  });

  if (!job) return notFound();

  // Find similar jobs
  const similarJobs = await prisma.jobRequirement.findMany({
    where: {
      status: 'open',
      id: { not: job.id },
      clientId: job.clientId
    },
    include: { client: true },
    take: 3
  });

  let skills: string[] = [];
  try {
    skills = JSON.parse(job.skills);
  } catch { }

  const companyInitial = (job.client?.companyName || 'C')[0].toUpperCase();
  const hue = job.client?.companyName ? [...job.client.companyName].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360 : 200;

  // JobPosting structured data for Google Jobs
  const jobPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.createdAt.toISOString(),
    validThrough: job.deadline
      ? new Date(job.deadline).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.client?.companyName || 'GoJobSync',
      sameAs: 'https://www.gojobsync.com',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'IN',
      },
    },
    baseSalary: job.salaryRange
      ? {
          '@type': 'MonetaryAmount',
          currency: 'INR',
          value: {
            '@type': 'QuantitativeValue',
            unitText: 'YEAR',
            description: job.salaryRange,
          },
        }
      : undefined,
    employmentType: 'FULL_TIME',
    skills: skills.join(', '),
    experienceRequirements: job.experience,
    totalJobOpenings: job.positions,
    url: `https://www.gojobsync.com/careers/jobs/${id}`,
    identifier: {
      '@type': 'PropertyValue',
      name: 'GoJobSync',
      value: id,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />
      <JobDetailsClient
        job={job}
        similarJobs={similarJobs}
        skills={skills}
        companyInitial={companyInitial}
        hue={hue}
      />
    </>
  );
}

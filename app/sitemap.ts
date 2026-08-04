import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.gojobsync.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/post-job`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic job pages
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const jobs = await prisma.jobRequirement.findMany({
      where: { status: 'open' },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });
    jobPages = jobs.map((job) => ({
      url: `${baseUrl}/careers/jobs/${job.id}`,
      lastModified: job.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
  } catch {
    // prisma not available at build time — skip
  }

  return [...staticPages, ...jobPages];
}

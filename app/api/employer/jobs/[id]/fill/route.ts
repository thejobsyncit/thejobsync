import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getEmployerId } from '@/lib/auth';

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const employerId = await getEmployerId(req);
  if (!employerId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const { id } = await props.params;

    // Fetch the EmployerJob
    const job = await prisma.employerJob.findUnique({ where: { id } });
    if (!job || job.employerId !== employerId) {
      return NextResponse.json({ error: 'Job not found or unauthorized' }, { status: 404 });
    }

    if (job.openings <= 0) {
      return NextResponse.json({ error: 'No openings left to fill' }, { status: 400 });
    }

    const newOpenings = job.openings - 1;
    const newStatus = newOpenings === 0 ? 'closed' : job.status;

    // Update EmployerJob
    await prisma.employerJob.update({
      where: { id },
      data: {
        openings: newOpenings,
        status: newStatus,
      }
    });

    // Also update the corresponding JobRequirement in CRM to stay in sync
    try {
      const employer = await prisma.employer.findUnique({ where: { id: employerId } });
      if (employer) {
        const client = await prisma.client.findFirst({ where: { email: employer.email } });
        if (client) {
          const requirements = await prisma.jobRequirement.findMany({
            where: { clientId: client.id, title: job.title },
            orderBy: { createdAt: 'desc' },
            take: 1
          });
          if (requirements.length > 0) {
            await prisma.jobRequirement.update({
              where: { id: requirements[0].id },
              data: {
                positions: newOpenings,
                status: newStatus === 'closed' ? 'closed' : requirements[0].status
              }
            });
          }
        }
      }
    } catch (e) {
      console.error('Failed to sync bridged requirement openings', e);
    }

    return NextResponse.json({ success: true, newOpenings, status: newStatus });
  } catch (err) {
    console.error('fill job error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

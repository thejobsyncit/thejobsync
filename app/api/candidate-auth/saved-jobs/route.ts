import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get('candidateAccountId');
  if (!candidateId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const savedJobs = await prisma.candidateSavedJob.findMany({
      where: { candidateAccountId: candidateId },
      include: { 
        requirement: { 
          include: { 
            client: true,
            candidateApplications: {
              where: { candidateAccountId: candidateId }
            }
          } 
        } 
      },
      orderBy: { savedAt: 'desc' }
    });
    return NextResponse.json(savedJobs);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch saved jobs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { jobId, candidateAccountId } = await req.json();
    if (!candidateAccountId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });

    const existing = await prisma.candidateSavedJob.findUnique({
      where: { candidateAccountId_requirementId: { candidateAccountId, requirementId: jobId } }
    });

    if (existing) return NextResponse.json({ message: 'Already saved' }, { status: 409 });

    const saved = await prisma.candidateSavedJob.create({
      data: { candidateAccountId, requirementId: jobId }
    });

    return NextResponse.json(saved);
  } catch (e: any) {
    console.error('Save job error:', e);
    return NextResponse.json({ error: 'Failed to save job' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    const candidateId = searchParams.get('candidateAccountId');
    if (!candidateId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });

    await prisma.candidateSavedJob.delete({
      where: { candidateAccountId_requirementId: { candidateAccountId: candidateId, requirementId: jobId } }
    });

    return NextResponse.json({ message: 'Removed' });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to remove saved job' }, { status: 500 });
  }
}

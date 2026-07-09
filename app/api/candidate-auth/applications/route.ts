import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/candidate-auth/applications?candidateAccountId=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const candidateAccountId = searchParams.get('candidateAccountId');
  if (!candidateAccountId) return NextResponse.json({ error: 'candidateAccountId required' }, { status: 400 });

  const candAccount = await (prisma as any).candidateAccount.findUnique({
    where: { id: candidateAccountId },
    select: { email: true }
  });

  const applications = await (prisma as any).candidateApplication.findMany({
    where: { candidateAccountId },
    include: {
      requirement: {
        select: {
          title: true, location: true, salaryRange: true, experience: true,
          client: { select: { companyName: true } }
        }
      }
    },
    orderBy: { appliedAt: 'desc' }
  });

  // Overwrite status with real-time CRM Candidate status if available
  if (candAccount) {
    const crmCandidates = await prisma.candidate.findMany({
      where: { email: candAccount.email }
    });
    
    for (const app of applications) {
      const match = crmCandidates.find(c => c.appliedFor === app.requirementId);
      if (match) {
        app.status = match.status; // e.g. 'selected', 'rejected', 'interview_scheduled'
      }
    }
  }

  return NextResponse.json(applications);
}

// POST /api/candidate-auth/applications
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { candidateAccountId, requirementId, coverNote } = data;

    if (!candidateAccountId) return NextResponse.json({ error: 'candidateAccountId required' }, { status: 400 });

    // Check if already applied
    const existing = await (prisma as any).candidateApplication.findFirst({
      where: { candidateAccountId, requirementId }
    });
    if (existing) {
      return NextResponse.json({ error: 'You have already applied for this job' }, { status: 409 });
    }

    // Get candidate profile
    const candAccount = await (prisma as any).candidateAccount.findUnique({
      where: { id: candidateAccountId }
    });
    if (!candAccount) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

    // Create application record
    const application = await (prisma as any).candidateApplication.create({
      data: { candidateAccountId, requirementId: requirementId || null, coverNote: coverNote || null }
    });

    // Also create a Candidate record in the main DB and assign via Round Robin
    const activeHrs = await prisma.user.findMany({
      where: { role: 'hr', isActive: true },
      select: { id: true }
    });

    let selectedHrId: string | null = null;
    if (activeHrs.length > 0) {
      const hrLoads = await Promise.all(
        activeHrs.map(async (hr) => {
          const count = await prisma.candidate.count({
            where: { assignedHrId: hr.id, status: { in: ['new', 'shortlisted', 'RNR', 'Switch Off', 'Call Back'] } }
          });
          return { id: hr.id, count };
        })
      );
      hrLoads.sort((a, b) => a.count - b.count);
      selectedHrId = hrLoads[0].id;
    }

    await prisma.candidate.create({
      data: {
        name: candAccount.name,
        email: candAccount.email,
        phone: candAccount.phone,
        skills: candAccount.skills || '[]',
        experience: candAccount.experience || 'Fresher',
        education: candAccount.education || '',
        currentCompany: candAccount.currentCompany || null,
        currentRole: candAccount.currentRole || null,
        expectedSalary: candAccount.expectedSalary || null,
        location: candAccount.location || '',
        resumeUrl: candAccount.resumeUrl || null,
        appliedFor: requirementId || null,
        assignedHrId: selectedHrId,
        status: 'new'
      }
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}

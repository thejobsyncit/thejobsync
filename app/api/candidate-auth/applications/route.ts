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

    // Fetch Requirement Details to create a meaningful message
    let jobTitle = "a job";
    let companyName = "";
    if (requirementId) {
      const requirement = await prisma.jobRequirement.findUnique({
        where: { id: requirementId },
        include: { client: true }
      });
      if (requirement) {
        jobTitle = requirement.title;
        if (requirement.client) {
          companyName = ` at ${requirement.client.companyName}`;
        }
      }
    }

    // Create a notification (CandidateMessage) for the candidate
    await (prisma as any).candidateMessage.create({
      data: {
        candidateAccountId,
        sender: 'system',
        message: `Application successful! Your application for ${jobTitle}${companyName} has been received. Our HR team will review it and get back to you shortly. You can track this in your 'My Applications' tab.`,
      }
    });

    // Send an actual email to the candidate
    const { sendEmail } = await import('@/lib/mail');
    await sendEmail({
      to: candAccount.email,
      subject: `Application Received: ${jobTitle}${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 8px;">
          <h2 style="color: #4F46E5;">Application Successful</h2>
          <p>Hi ${candAccount.name},</p>
          <p>Thank you for applying for the <strong>${jobTitle}</strong> position${companyName}.</p>
          <p>Your application has been successfully submitted and will be reviewed by our HR team. We will get back to you shortly with the next steps.</p>
          <br/>
          <p>You can track the status of your application in your candidate portal under the "My Applications" tab.</p>
          <br/>
          <p>Best Regards,</p>
          <p><strong>HR Team</strong><br/>ManpowerCRM</p>
        </div>
      `
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}

import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/candidate-auth/profile?id=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const account = await (prisma as any).candidateAccount.findUnique({ 
    where: { id },
    include: {
      subscriptions: true,
      invoices: true
    }
  });
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { password: _, ...safeAccount } = account;
  return NextResponse.json(safeAccount);
}

// PUT /api/candidate-auth/profile
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    delete updateData.password; // Never update password via this route
    delete updateData.email;

    const updated = await (prisma as any).candidateAccount.update({
      where: { id },
      data: updateData
    });

    // Sync updates to the CRM Candidate table so admins see the latest resume/profile
    if (updated.email) {
      await prisma.candidate.updateMany({
        where: { email: updated.email },
        data: {
          name: updated.name,
          phone: updated.phone,
          skills: updated.skills,
          experience: updated.experience || 'No experience',
          education: updated.education || 'Not specified',
          languages: updated.languages || '[]',
          location: updated.location || 'Not specified',
          currentCompany: updated.currentCompany,
          currentRole: updated.currentRole,
          expectedSalary: updated.expectedSalary,
          resumeUrl: updated.resumeUrl,
        }
      });
    }

    const { password: _, ...safeAccount } = updated;
    return NextResponse.json(safeAccount);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

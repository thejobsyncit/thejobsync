import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getEmployerId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const employerId = await getEmployerId(req);
    if (!employerId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const employer = await prisma.employer.findUnique({
      where: { id: employerId },
      select: {
        id: true, companyName: true, email: true, industry: true,
        contactPerson: true, contactPhone: true, address: true,
        about: true, gstNumber: true, logoUrl: true, website: true,
        isVerified: true, createdAt: true,
        subscriptions: {
          where: {
            status: 'active',
            expiresAt: { gt: new Date() }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
    });

    if (!employer) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
    }

    return NextResponse.json({ employer });
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('employer_token');
  return response;
}

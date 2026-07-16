import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { jwtVerify } from 'jose';


const JWT_SECRET = new TextEncoder().encode(
  process.env.EMPLOYER_JWT_SECRET || 'employer_jwt_secret_gojobsync_2024'
);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('employer_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const employerId = payload.employerId as string;

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

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.EMPLOYER_JWT_SECRET || 'employer_jwt_secret_gojobsync_2024'
);

async function getEmployerEmail(req: NextRequest): Promise<string | null> {
  try {
    const token = req.cookies.get('employer_token')?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Fetch employer email by ID
    const employer = await prisma.employer.findUnique({
      where: { id: payload.employerId as string },
      select: { email: true }
    });
    
    return employer?.email || null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const email = await getEmployerEmail(req);
    
    if (!email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const invoices = await (prisma as any).invoice.findMany({
      where: { email },
      orderBy: { paidAt: 'desc' },
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('Error fetching employer invoices:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

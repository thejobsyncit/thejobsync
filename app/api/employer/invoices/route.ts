import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getEmployerId } from '@/lib/auth';

async function getEmployerEmail(req: NextRequest): Promise<string | null> {
  try {
    const employerId = await getEmployerId(req);
    if (!employerId) return null;
    
    // Fetch employer email by ID
    const employer = await prisma.employer.findUnique({
      where: { id: employerId },
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

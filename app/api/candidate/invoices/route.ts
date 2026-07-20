import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get('candidateId');
    if (!candidateId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const invoices = await (prisma as any).candidateInvoice.findMany({
      where: {
        candidateAccountId: candidateId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ invoices });
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

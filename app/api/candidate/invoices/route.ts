import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as jose from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_key_12345'
);

async function getCandidateId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('candidate_token')?.value;
    if (!token) return null;
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload.id as string;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const candidateId = await getCandidateId();
    if (!candidateId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const invoices = await prisma.candidateInvoice.findMany({
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

import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/candidate-auth/login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const account = await (prisma as any).candidateAccount.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!account || account.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const { password: _, ...safeAccount } = account;
    return NextResponse.json(safeAccount);
  } catch (error) {
    console.error('Candidate login route error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

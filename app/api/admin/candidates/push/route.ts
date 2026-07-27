import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { candidateIds, supportUserId } = await req.json();

    if (!Array.isArray(candidateIds) || candidateIds.length === 0 || !supportUserId) {
      return NextResponse.json({ error: 'Candidate IDs and support user ID are required' }, { status: 400 });
    }

    // Verify support user exists and has role application_support
    const supportUser = await prisma.user.findUnique({
      where: { id: supportUserId },
      select: { id: true, name: true, role: true }
    });

    if (!supportUser) {
      return NextResponse.json({ error: 'Application support user not found' }, { status: 404 });
    }

    const result = await prisma.candidate.updateMany({
      where: {
        id: { in: candidateIds }
      },
      data: {
        assignedSupportId: supportUserId
      } as any
    });

    return NextResponse.json({
      message: `Successfully pushed ${result.count} candidates to ${supportUser.name}`,
      count: result.count,
      supportUser
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error pushing candidates to support:', error);
    return NextResponse.json({ error: error.message || 'Failed to push candidates' }, { status: 500 });
  }
}

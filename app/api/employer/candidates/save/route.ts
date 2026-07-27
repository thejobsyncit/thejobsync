import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getEmployerId } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const employerId = await getEmployerId(req);
  if (!employerId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const { candidateId, action } = await req.json();
    
    if (!candidateId || !['save', 'unsave'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    if (action === 'save') {
      await prisma.employerSavedCandidate.upsert({
        where: {
          employerId_candidateAccountId: {
            employerId,
            candidateAccountId: candidateId
          }
        },
        update: {},
        create: {
          employerId,
          candidateAccountId: candidateId
        }
      });
    } else {
      await prisma.employerSavedCandidate.deleteMany({
        where: {
          employerId,
          candidateAccountId: candidateId
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving/unsaving candidate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

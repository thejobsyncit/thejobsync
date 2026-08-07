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

    // Fetch candidates to identify duplicates
    const candidates = await prisma.candidate.findMany({
      where: { id: { in: candidateIds } },
      orderBy: { createdAt: 'desc' } // Keep the newest one
    });

    const uniqueEmails = new Set();
    const uniquePhones = new Set();
    const idsToPush: string[] = [];
    const idsToDelete: string[] = [];

    for (const c of candidates) {
      const email = (c.email || '').toLowerCase().trim();
      const phone = (c.phone || '').trim();
      
      const isDuplicate = 
        (email && email !== 'na' && !email.startsWith('noemail-') && uniqueEmails.has(email)) || 
        (phone && phone !== 'na' && uniquePhones.has(phone));
                          
      if (!isDuplicate) {
        if (email && email !== 'na' && !email.startsWith('noemail-')) uniqueEmails.add(email);
        if (phone && phone !== 'na') uniquePhones.add(phone);
        idsToPush.push(c.id);
      } else {
        idsToDelete.push(c.id);
      }
    }

    // Remove duplicates from the database
    if (idsToDelete.length > 0) {
      await prisma.candidate.deleteMany({
        where: { id: { in: idsToDelete } }
      });
    }

    const result = await prisma.candidate.updateMany({
      where: {
        id: { in: idsToPush }
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

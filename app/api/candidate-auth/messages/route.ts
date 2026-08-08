import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get('candidateAccountId');
  const markRead = searchParams.get('markRead') === 'true';
  
  if (!candidateId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    if (markRead) {
      await prisma.candidateMessage.updateMany({
        where: { candidateAccountId: candidateId, sender: 'hr', isRead: false },
        data: { isRead: true }
      });
    }

    const messages = await prisma.candidateMessage.findMany({
      where: { candidateAccountId: candidateId },
      orderBy: { sentAt: 'asc' }
    });
    return NextResponse.json(messages);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { message, candidateAccountId } = await req.json();
    if (!candidateAccountId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!message) return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });

    const newMsg = await prisma.candidateMessage.create({
      data: {
        candidateAccountId: candidateAccountId,
        message,
        sender: 'candidate'
      },
      include: {
        candidateAccount: { select: { name: true } }
      }
    });
    
    // Notify all super admins about the new message
    const superAdmins = await prisma.user.findMany({
      where: { role: 'super_admin' },
      select: { id: true }
    });

    if (superAdmins.length > 0) {
      await prisma.notification.createMany({
        data: superAdmins.map(admin => ({
          userId: admin.id,
          title: 'New Candidate Message',
          message: `${newMsg.candidateAccount.name} sent a message: "${message.substring(0, 40)}${message.length > 40 ? '...' : ''}"`,
          type: 'info',
          link: '/crm/candidate-messages'
        }))
      });
    }

    return NextResponse.json(newMsg);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

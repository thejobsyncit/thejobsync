import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: candidateAccountId } = await params;
    if (!candidateAccountId) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const messages = await prisma.candidateMessage.findMany({
      where: { candidateAccountId },
      orderBy: { sentAt: 'asc' }
    });

    const candidateAccount = await prisma.candidateAccount.findUnique({
      where: { id: candidateAccountId },
      select: { name: true, email: true, photoUrl: true, headline: true }
    });

    // Mark unread messages from candidate as read
    const unreadMessages = messages.filter(m => !m.isRead && m.sender === 'candidate');
    if (unreadMessages.length > 0) {
      await prisma.candidateMessage.updateMany({
        where: {
          candidateAccountId,
          sender: 'candidate',
          isRead: false
        },
        data: { isRead: true }
      });
    }

    return NextResponse.json({ candidateAccount, messages });
  } catch (error: any) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: candidateAccountId } = await params;
    const { message } = await req.json();

    if (!candidateAccountId || !message) {
      return NextResponse.json({ error: 'Missing candidateAccountId or message' }, { status: 400 });
    }

    const newMessage = await prisma.candidateMessage.create({
      data: {
        candidateAccountId,
        message,
        sender: 'hr',
        isRead: false
      }
    });

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

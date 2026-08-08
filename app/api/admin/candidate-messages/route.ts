import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    // Get all candidate accounts that have messages
    const accounts = await prisma.candidateAccount.findMany({
      where: {
        messages: {
          some: {}
        }
      },
      include: {
        messages: {
          orderBy: {
            sentAt: 'desc'
          },
        }
      }
    });

    // Format the response
    const conversations = accounts.map(account => {
      const messages = account.messages;
      const latestMessage = messages[0];
      const unreadCount = messages.filter(m => !m.isRead && m.sender === 'candidate').length;
      
      return {
        candidateAccountId: account.id,
        candidateName: account.name,
        candidateEmail: account.email,
        candidatePhoto: account.photoUrl,
        latestMessage: latestMessage ? {
          message: latestMessage.message,
          sentAt: latestMessage.sentAt,
          sender: latestMessage.sender
        } : null,
        unreadCount
      };
    });

    // Sort by latest message date descending
    conversations.sort((a, b) => {
      const dateA = a.latestMessage ? new Date(a.latestMessage.sentAt).getTime() : 0;
      const dateB = b.latestMessage ? new Date(b.latestMessage.sentAt).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json(conversations);
  } catch (error: any) {
    console.error('Error fetching candidate messages list:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

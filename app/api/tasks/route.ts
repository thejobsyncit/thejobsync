import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const tasks = await prisma.dailyTask.findMany({
      where: {
        assigneeId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        creator: {
          select: {
            name: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, priority, creatorId, assigneeId } = body;

    if (!text || !creatorId || !assigneeId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newTask = await prisma.dailyTask.create({
      data: {
        text,
        priority: priority || 'medium',
        creatorId,
        assigneeId
      },
      include: {
        creator: {
          select: {
            name: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
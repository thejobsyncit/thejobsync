import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    if (!role) {
      return NextResponse.json({ error: 'Missing role' }, { status: 400 });
    }

    const where: any = {};
    
    // If not super_admin, they can only see their own leaves
    if (role !== 'super_admin') {
      if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      where.userId = userId;
    }

    const leaves = await prisma.leaveRequest.findMany({
      where,
      include: {
        user: { select: { name: true, role: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(leaves);
  } catch (error) {
    console.error('Failed to fetch leave requests:', error);
    return NextResponse.json({ error: 'Failed to fetch leave requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.userId || !data.startDate || !data.endDate || !data.reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const leave = await prisma.leaveRequest.create({
      data: {
        userId: data.userId,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason
      },
      include: {
        user: { select: { name: true, role: true } }
      }
    });

    // Notify all admins and super_admins
    const admins = await prisma.user.findMany({
      where: { role: { in: ['super_admin', 'admin'] } },
      select: { id: true }
    });

    if (admins.length > 0) {
      const notifications = admins.map(admin => ({
        userId: admin.id,
        title: 'New Leave Request',
        message: `${leave.user.name} has applied for leave from ${new Date(data.startDate).toLocaleDateString()} to ${new Date(data.endDate).toLocaleDateString()}.`,
        type: 'info',
        link: '/crm/leave'
      }));

      await prisma.notification.createMany({
        data: notifications
      });
    }

    return NextResponse.json(leave, { status: 201 });
  } catch (error) {
    console.error('Failed to create leave request:', error);
    return NextResponse.json({ error: 'Failed to create leave request' }, { status: 500 });
  }
}

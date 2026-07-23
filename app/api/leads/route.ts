import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'gojobsync_jwt_secret_2024_secure'
);

async function getUserFromToken(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; role: string; email: string };
  } catch (error) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let whereClause = {};

    if (user.role === 'dms') {
      whereClause = { dmsId: user.userId };
    } else if (user.role === 'coordinator') {
      whereClause = { coordinatorId: user.userId };
    } else if (['super_admin', 'admin'].includes(user.role)) {
      whereClause = {};
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const leads = await prisma.companyLead.findMany({
      where: whereClause,
      include: {
        dms: { select: { name: true } },
        coordinator: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    if (!user || !['dms', 'super_admin', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Only DMS or Admins can create leads' }, { status: 403 });
    }

    const body = await req.json();
    const { companyName, email, phone, address } = body;

    if (!companyName) {
      return NextResponse.json({ error: 'Company Name is required' }, { status: 400 });
    }

    // Auto-assignment (Round-Robin to Coordinator)
    const coordinators = await prisma.user.findMany({
      where: { role: 'coordinator', isActive: true },
      select: { id: true }
    });

    let assignedCoordinatorId: string | undefined = undefined;

    if (coordinators.length > 0) {
      // Find coordinator with the least leads
      const leadCounts = await prisma.companyLead.groupBy({
        by: ['coordinatorId'],
        _count: { id: true }
      });

      // Map counts
      const countsMap = new Map<string, number>();
      leadCounts.forEach((lc: any) => {
        if (lc.coordinatorId) countsMap.set(lc.coordinatorId, lc._count.id);
      });

      let minCount = Infinity;
      for (const coord of coordinators) {
        const count = countsMap.get(coord.id) || 0;
        if (count < minCount) {
          minCount = count;
          assignedCoordinatorId = coord.id;
        }
      }
    }

    const lead = await prisma.companyLead.create({
      data: {
        companyName,
        email: email || 'na',
        phone: phone || 'na',
        address: address || null,
        status: 'fresh',
        dmsId: user.userId,
        coordinatorId: assignedCoordinatorId,
      },
      include: {
        coordinator: { select: { name: true } },
        dms: { select: { name: true } }
      }
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    if (!user || !['super_admin', 'admin', 'dms', 'coordinator'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { leadIds } = body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: 'leadIds array is required' }, { status: 400 });
    }

    let whereClause: any = {
      id: { in: leadIds }
    };

    if (user.role === 'dms') {
      whereClause.dmsId = user.userId;
    } else if (user.role === 'coordinator') {
      whereClause.coordinatorId = user.userId;
    }

    const deleteResult = await prisma.companyLead.deleteMany({
      where: whereClause
    });

    return NextResponse.json({ success: true, count: deleteResult.count }, { status: 200 });
  } catch (error) {
    console.error('Error deleting leads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

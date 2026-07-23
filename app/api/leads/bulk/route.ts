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

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    if (!user || !['dms', 'super_admin', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Only DMS or Admins can bulk create leads' }, { status: 403 });
    }

    const body = await req.json();
    const leadsData = body.leads;

    if (!Array.isArray(leadsData) || leadsData.length === 0) {
      return NextResponse.json({ error: 'Valid leads array is required' }, { status: 400 });
    }

    // Fetch existing companies to avoid duplicates
    const existingLeads = await prisma.companyLead.findMany({
      select: { companyName: true }
    });
    const existingNames = new Set(existingLeads.map(l => l.companyName.toLowerCase().trim()));

    // Filter out duplicates (both from DB and within the Excel file itself)
    const uniqueLeadsData = leadsData.filter(lead => {
      const name = lead.companyName?.toLowerCase().trim();
      if (!name || existingNames.has(name)) return false;
      existingNames.add(name); // Add to set to prevent duplicates within the same file
      return true;
    });

    if (uniqueLeadsData.length === 0) {
      return NextResponse.json({ message: 'No new leads to add. All companies already exist.' }, { status: 200 });
    }

    // Auto-assignment (Round-Robin to Coordinator)
    const coordinators = await prisma.user.findMany({
      where: { role: 'coordinator', isActive: true },
      select: { id: true }
    });

    const newLeads = [];

    if (coordinators.length > 0) {
      // Fetch current counts
      const leadCounts = await prisma.companyLead.groupBy({
        by: ['coordinatorId'],
        _count: { id: true }
      });

      const countsMap = new Map<string, number>();
      // Initialize all to 0
      coordinators.forEach(c => countsMap.set(c.id, 0));
      // Update with actual counts
      leadCounts.forEach((lc: any) => {
        if (lc.coordinatorId) countsMap.set(lc.coordinatorId, lc._count.id);
      });

      for (const lead of uniqueLeadsData) {
        // Find coordinator with min count
        let minCount = Infinity;
        let assignedCoordinatorId: string | undefined = undefined;

        for (const coord of coordinators) {
          const count = countsMap.get(coord.id) || 0;
          if (count < minCount) {
            minCount = count;
            assignedCoordinatorId = coord.id;
          }
        }

        if (assignedCoordinatorId) {
          countsMap.set(assignedCoordinatorId, minCount + 1);
        }

        newLeads.push({
          companyName: lead.companyName,
          email: lead.email || 'na',
          phone: String(lead.phone || 'na'),
          address: lead.address || null,
          status: 'fresh',
          dmsId: user.userId,
          coordinatorId: assignedCoordinatorId,
        });
      }
    } else {
      // No coordinators available
      for (const lead of uniqueLeadsData) {
        newLeads.push({
          companyName: lead.companyName,
          email: lead.email || 'na',
          phone: String(lead.phone || 'na'),
          address: lead.address || null,
          status: 'fresh',
          dmsId: user.userId,
        });
      }
    }

    await prisma.companyLead.createMany({
      data: newLeads
    });

    return NextResponse.json({ 
      message: `Successfully added ${newLeads.length} new leads. Skipped ${leadsData.length - newLeads.length} duplicates.` 
    }, { status: 201 });
  } catch (error) {
    console.error('Error in bulk lead creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

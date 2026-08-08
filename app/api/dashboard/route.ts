import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/dashboard — Aggregate stats from database
export async function GET() {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalClients,
      activeRequirements,
      totalCandidates,
      scheduledInterviews,
      totalPlacements,
      openPositions,
      thisMonthPlacements,
      thisMonthInterviews,
      recentActivities,
    ] = await Promise.all([
      prisma.client.count({ where: { status: 'active' } }),
      prisma.jobRequirement.count({ where: { status: { in: ['open', 'in_progress'] } } }),
      prisma.candidate.count(),
      prisma.interview.count({ where: { status: 'scheduled' } }),
      prisma.placement.count(),
      prisma.jobRequirement.aggregate({
        where: { status: { in: ['open', 'in_progress'] } },
        _sum: { positions: true },
      }),
      prisma.placement.count({ where: { createdAt: { gte: firstDayOfMonth } } }),
      prisma.interview.count({ where: { createdAt: { gte: firstDayOfMonth } } }),
      // Get most recent items across modules
      Promise.all([
        prisma.placement.findMany({ orderBy: { createdAt: 'desc' }, take: 15, include: { candidate: { select: { name: true } }, client: { select: { companyName: true } } } }),
        prisma.interview.findMany({ orderBy: { createdAt: 'desc' }, take: 15, include: { candidate: { select: { name: true } }, requirement: { select: { title: true } } } }),
        prisma.candidate.findMany({ orderBy: { createdAt: 'desc' }, take: 15, select: { name: true, status: true, createdAt: true } }),
      ]),
    ]);

    // Build recent activities from real data
    const [recentPlacements, recentInterviews, recentCandidates] = recentActivities;
    const activities = [
      ...recentPlacements.map(p => ({
        id: p.id,
        type: 'placement' as const,
        action: `Placement: ${p.status.replace('_', ' ')}`,
        description: `${p.candidate.name} at ${p.client.companyName}`,
        user: 'System',
        timestamp: p.createdAt.toISOString(),
      })),
      ...recentInterviews.map(i => ({
        id: i.id,
        type: 'interview' as const,
        action: `Interview ${i.status}`,
        description: `${i.candidate.name} for ${i.requirement.title}`,
        user: 'System',
        timestamp: i.createdAt.toISOString(),
      })),
      ...recentCandidates.map(c => ({
        id: c.name,
        type: 'candidate' as const,
        action: `Candidate: ${c.status}`,
        description: `${c.name} added`,
        user: 'System',
        timestamp: c.createdAt.toISOString(),
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 30);

    return NextResponse.json({
      stats: {
        totalClients,
        activeRequirements,
        totalCandidates,
        scheduledInterviews,
        placements: totalPlacements,
        openPositions: openPositions._sum.positions || 0,
        thisMonthPlacements,
        thisMonthInterviews,
      },
      recentActivities: activities,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

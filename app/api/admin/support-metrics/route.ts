import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Get all application support users
    const supportUsers = await prisma.user.findMany({
      where: { role: 'application_support' },
      select: { id: true, name: true, email: true }
    });

    // We will find all candidates with status 'completed' and an assignedSupportId
    const now = new Date();
    
    // Start of Today
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // Start of Week (assuming Monday is start of week)
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay() || 7; 
    startOfWeek.setDate(startOfWeek.getDate() - day + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    // Start of Month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const metrics = await Promise.all(supportUsers.map(async (user) => {
      // Count today
      const todayCount = await prisma.candidate.count({
        where: {
          assignedSupportId: user.id,
          status: 'completed',
          updatedAt: { gte: startOfToday }
        }
      });

      // Count weekly
      const weeklyCount = await prisma.candidate.count({
        where: {
          assignedSupportId: user.id,
          status: 'completed',
          updatedAt: { gte: startOfWeek }
        }
      });

      // Count monthly
      const monthlyCount = await prisma.candidate.count({
        where: {
          assignedSupportId: user.id,
          status: 'completed',
          updatedAt: { gte: startOfMonth }
        }
      });

      // Total count (optional, but good to have)
      const totalCount = await prisma.candidate.count({
        where: {
          assignedSupportId: user.id,
          status: 'completed'
        }
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        today: todayCount,
        weekly: weeklyCount,
        monthly: monthlyCount,
        total: totalCount
      };
    }));

    return NextResponse.json(metrics);
  } catch (error: any) {
    console.error('Error fetching support metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}

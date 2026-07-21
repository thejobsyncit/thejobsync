import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const candidates = await prisma.candidateAccount.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        createdAt: 'desc' // For the table, we want newest first
      }
    });

    const dailyCounts: Record<string, number> = {};

    // Initialize all last 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      dailyCounts[dateString] = 0;
    }

    candidates.forEach(c => {
      const dateString = new Date(c.createdAt).toISOString().split('T')[0];
      if (dailyCounts[dateString] !== undefined) {
        dailyCounts[dateString]++;
      }
    });

    const chartData = Object.keys(dailyCounts).map(date => ({
      date,
      count: dailyCounts[date]
    })).sort((a, b) => a.date.localeCompare(b.date)); // Sort chronologically

    // Mask the password to show only a generic hash representation or keep the hashed one
    // The user requested "password mattum hash la irukanum" so we can just return it as is,
    // since it's already a bcrypt hash in the DB. Or we can just return a fixed string for safety.
    // I will return the raw DB value, since it's already a bcrypt hash.

    return NextResponse.json({ chartData, candidates });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Public API — No auth required
// Returns all active packages, optionally filtered by type
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // company | candidate | null (all)

    const where: any = { isActive: true };
    if (type) where.packageType = type;

    const packages = await (prisma as any).package.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    return NextResponse.json(packages);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: {
        role: role,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch users by role' }, { status: 500 });
  }
}
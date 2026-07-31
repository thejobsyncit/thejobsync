import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid or missing IDs' }, { status: 400 });
    }

    const result = await prisma.client.deleteMany({
      where: {
        id: { in: ids }
      }
    });

    return NextResponse.json({ message: 'Bulk delete successful', count: result.count }, { status: 200 });
  } catch (error: any) {
    console.error('Bulk delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

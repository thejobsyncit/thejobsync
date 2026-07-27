import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Array of candidate IDs is required' }, { status: 400 });
    }

    const result = await prisma.candidate.deleteMany({
      where: {
        id: { in: ids }
      }
    });

    return NextResponse.json({
      message: `Successfully deleted ${result.count} candidates`,
      count: result.count
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error in bulk candidate delete:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete candidates' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  return POST(req);
}

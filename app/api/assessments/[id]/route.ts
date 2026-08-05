import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const record = await (prisma as any).assessmentResult.findUnique({
      where: { id }
    });

    if (!record) {
      return NextResponse.json({ error: 'Assessment report not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, result: record });
  } catch (err: any) {
    console.error('Get assessment report error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch assessment report' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await (prisma as any).assessmentResult.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Assessment record deleted' });
  } catch (err: any) {
    console.error('Delete assessment error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete assessment' }, { status: 500 });
  }
}

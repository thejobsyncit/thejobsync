import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET employees (admin/super_admin users)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const where: any = role ? { role } : { role: { in: ['admin', 'super_admin', 'recruiter', 'hr', 'interviewer', 'application_support', 'dms', 'coordinator'] } };
    const employees = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(employees.map(e => ({ ...e, password: undefined })));
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const existing = await prisma.user.findFirst({ where: { email: data.email.toLowerCase().trim() } });
    if (existing) return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
    const user = await prisma.user.create({
      data: { ...data, email: data.email.toLowerCase().trim() },
    });
    return NextResponse.json({ ...user, password: undefined }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    const user = await prisma.user.update({ where: { id }, data });
    return NextResponse.json({ ...user, password: undefined });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: 'Employee deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

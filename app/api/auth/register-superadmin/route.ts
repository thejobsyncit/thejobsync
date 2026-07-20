import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if a super admin already exists
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: 'super_admin' },
    });

    if (existingSuperAdmin) {
      return NextResponse.json(
        { success: false, error: 'A Super Admin account already exists.' },
        { status: 403 }
      );
    }

    // Check if the email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email is already registered' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create the super admin
    const superAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'super_admin',
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: superAdmin.id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role,
      },
    });
  } catch (error: any) {
    console.error('Super Admin registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to register Super Admin' },
      { status: 500 }
    );
  }
}

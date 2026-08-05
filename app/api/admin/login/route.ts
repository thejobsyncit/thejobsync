import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase().trim(), isActive: true },
    });

    if (!user || user.password !== password.trim()) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    if (user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'admin_erp' && user.role !== 'super_admin_erp') {
      return NextResponse.json({ message: 'Unauthorized. Not an admin account.' }, { status: 403 });
    }

    // Create JWT Token
    const JWT_SECRET = new TextEncoder().encode(
      process.env.JWT_SECRET || 'gojobsync_jwt_secret_2024_secure'
    );
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    // Return success and role
    const response = NextResponse.json({ 
      message: 'Login successful', 
      role: user.role,
      user: { id: user.id, email: user.email, name: user.name } 
    }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;

  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

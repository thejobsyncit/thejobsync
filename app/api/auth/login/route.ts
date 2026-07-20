import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase().trim(), isActive: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    let isPasswordValid = false;
    // Check if it's a bcrypt hash
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
      const { compare } = require('bcryptjs');
      isPasswordValid = await compare(password.trim(), user.password);
    } else {
      isPasswordValid = user.password === password.trim();
    }

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // --- ATTENDANCE SYSTEM ---
    // Skip attendance for super_admin, it_admin, client, developer, tester
    const EXEMPT_ROLES = ['super_admin', 'it_admin', 'client', 'developer', 'tester'];

    if (!EXEMPT_ROLES.includes(user.role)) {
      try {
        const now = new Date();
        const istFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        } as any);
        const parts = istFormatter.formatToParts(now);
        let hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
        const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
        if (hour === 24) hour = 0;

        const timeInMinutes = hour * 60 + minute;
        // Grace period: 9:00 AM to 9:15 AM => 540 to 555 minutes
        const isLate = timeInMinutes > 555;
        const dateString = now.toISOString().split('T')[0];

        let existingAttendance = await (prisma as any).attendance.findUnique({
          where: { userId_date: { userId: user.id, date: dateString } },
        });

        const isCreatedToday = user.createdAt.toISOString().split('T')[0] === dateString;

        if (isLate && !isCreatedToday) {
          if (!existingAttendance) {
            // Create late attendance record (blocked)
            await (prisma as any).attendance.create({
              data: {
                userId: user.id,
                date: dateString,
                loginTime: now,
                status: 'late',
                isApproved: false,
              },
            });

            // Notify all super admins
            const superAdmins = await prisma.user.findMany({ where: { role: 'super_admin' } });
            await Promise.all(
              superAdmins.map(sa =>
                prisma.notification.create({
                  data: {
                    userId: sa.id,
                    title: 'Late Login Approval Required',
                    message: `${user.name} (${user.role}) tried to login at ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} IST and needs approval.`,
                    type: 'warning',
                  },
                })
              )
            );

            return NextResponse.json(
              { error: 'Login Blocked: You logged in after 09:15 AM. Waiting for Super Admin approval.' },
              { status: 403 }
            );
          } else if (!existingAttendance.isApproved) {
            return NextResponse.json(
              { error: 'Your late login is still pending Super Admin approval.' },
              { status: 403 }
            );
          }
          // else: attendance exists AND is approved → allow through
        } else {
          // On time — record attendance only once per day
          if (!existingAttendance) {
            existingAttendance = await (prisma as any).attendance.create({
              data: {
                userId: user.id,
                date: dateString,
                loginTime: now,
                status: 'present',
                isApproved: true,
              },
            });
          }
        }
        
        // Add the session log to the attendance record
        if (existingAttendance) {
          await (prisma as any).attendanceSession.create({
            data: {
              attendanceId: existingAttendance.id,
              loginTime: now,
            }
          });
        }
      } catch (attendanceError) {
        // If attendance table doesn't exist yet, log but don't block login
        console.warn('Attendance tracking skipped:', attendanceError);
      }
    }

    // Log successful login (non-blocking)
    try {
      await (prisma as any).loginLog.create({
        data: {
          userId: user.id,
          ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
          userAgent: request.headers.get('user-agent') || 'Unknown',
          status: 'success',
        },
      });
    } catch {
      // Non-critical, don't block login
    }

    const { password: _, ...userWithoutPassword } = user;
    
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

    const response = NextResponse.json(userWithoutPassword);
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

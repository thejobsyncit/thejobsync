import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { sendEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    // 1. Verify user exists based on role
    let userExists = false;
    if (role === 'employer') {
      const employer = await prisma.employer.findUnique({ where: { email } });
      userExists = !!employer;
    } else if (role === 'candidate') {
      const candidate = await prisma.candidateAccount.findUnique({ where: { email } });
      userExists = !!candidate;
    } else {
      // Default to internal CRM users (admin, super_admin, recruiter, etc.)
      const user = await prisma.user.findUnique({ where: { email } });
      userExists = !!user;
    }

    if (!userExists) {
      // Return 200 even if not found to prevent email enumeration attacks
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' }, { status: 200 });
    }

    // 2. Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // 3. Delete any existing tokens for this email to prevent clutter
    await prisma.passwordReset.deleteMany({
      where: { email }
    });

    // 4. Save new token
    await prisma.passwordReset.create({
      data: {
        email,
        token,
        role,
        expiresAt
      }
    });

    // 5. Send Email
    // Generate correct base URL from request host
    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (host ? `${protocol}://${host}` : 'http://localhost:3000');
    const resetLink = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 8px;">
        <h2 style="color: #03045E; text-align: center;">The jobsync</h2>
        <p style="color: #333; font-size: 16px;">Hello,</p>
        <p style="color: #333; font-size: 16px;">We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #0077B6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Reset Your Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px; text-align: center;">This link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} The jobsync. All rights reserved.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'Reset your password - The jobsync',
      html: emailHtml
    });

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' }, { status: 200 });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

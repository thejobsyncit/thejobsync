import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mail';

import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';

// Shared global OTP store — persists across hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, { otp: string; expiresAt: number }> | undefined;
}

const otpStore: Map<string, { otp: string; expiresAt: number }> =
  global.__otpStore ?? (global.__otpStore = new Map());

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const otpSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(ip, 3, 60000)) { // 3 OTP requests per minute max
      return NextResponse.json({ error: 'Too many OTP requests. Please wait a minute.' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = otpSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });
    }
    
    const { email } = parsed.data;

    const otp = generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(email.toLowerCase(), { otp, expiresAt });

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); padding: 40px 32px; text-align: center;">
          <h1 style="color: white; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">The jobsync</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Employer Portal Verification</p>
        </div>

        <div style="padding: 40px 32px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">Verify Your Email Address</h2>
          <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">
            Use the OTP below to complete your employer registration. This code is valid for <strong>10 minutes</strong>.
          </p>

          <div style="background: #f1f5f9; border-radius: 12px; padding: 28px; text-align: center; margin-bottom: 32px;">
            <p style="color: #64748b; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 12px;">Your OTP Code</p>
            <div style="font-size: 42px; font-weight: 900; letter-spacing: 10px; color: #1e3a8a; font-family: 'Courier New', monospace;">
              ${otp}
            </div>
          </div>

          <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0;">
            If you did not initiate this request, please ignore this email. Do not share this OTP with anyone.
          </p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding: 20px 32px; background: #f8fafc; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} The jobsync. All rights reserved.</p>
        </div>
      </div>
    `;

    const result = await sendEmail({
      to: email,
      subject: 'The jobsync – Your OTP for Employer Registration',
      html,
    });

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to send OTP email. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    console.error('send-otp error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

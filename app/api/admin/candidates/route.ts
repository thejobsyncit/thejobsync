import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { notifyCandidateStatusChange } from '@/lib/whatsapp';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'jwij4ht3pzhr.hkph.mail-manager-smtp.amazonaws.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
  },
});

const STATUS_EMAIL_TEMPLATES: Record<string, { subject: string; html: (name: string) => string }> = {
  shortlisted: {
    subject: '🎉 Congratulations! You have been Shortlisted - The GoJobSync',
    html: (name: string) => `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: #1a237e; padding: 32px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 2px;">The GoJobSync</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 12px; letter-spacing: 3px;">CAREER PORTAL</p>
        </div>
        <div style="padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;"><span style="font-size: 48px;">🎉</span></div>
          <h2 style="color: #1a237e; text-align: center; margin: 0 0 16px;">Hello ${name}!</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6; text-align: center;">
            Congratulations! You have been <strong style="color: #10b981;">shortlisted</strong> for the job role. Our recruitment team will review your details and contact you for the next steps.
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
            <p style="color: #15803d; font-size: 14px; margin: 0;"><strong>Status Updated:</strong> Shortlisted 🎉</p>
          </div>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">Please keep your resume and documents ready. All the best!</p>
        </div>
        <div style="background: #f9fafb; padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 The gojobsync.com — All Rights Reserved</p>
        </div>
      </div>
    `,
  },
  selected: {
    subject: '✅ Job Application Update: Selected! - The GoJobSync',
    html: (name: string) => `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: #1a237e; padding: 32px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 2px;">The GoJobSync</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 12px; letter-spacing: 3px;">CAREER PORTAL</p>
        </div>
        <div style="padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;"><span style="font-size: 48px;">✅</span></div>
          <h2 style="color: #1a237e; text-align: center; margin: 0 0 16px;">Hello ${name}!</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6; text-align: center;">
            We are excited to inform you that you have been <strong style="color: #10b981;">Selected</strong> for the job role. Our HR team will connect with you soon regarding the offer letter and onboarding process.
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
            <p style="color: #15803d; font-size: 14px; margin: 0;"><strong>Status Updated:</strong> Selected ✅</p>
          </div>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">Congratulations on your selection!</p>
        </div>
        <div style="background: #f9fafb; padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 The gojobsync.com — All Rights Reserved</p>
        </div>
      </div>
    `,
  },
  rejected: {
    subject: '📋 Job Application Status Update - The GoJobSync',
    html: (name: string) => `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: #1a237e; padding: 32px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 2px;">The GoJobSync</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 12px; letter-spacing: 3px;">CAREER PORTAL</p>
        </div>
        <div style="padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;"><span style="font-size: 48px;">📋</span></div>
          <h2 style="color: #1a237e; text-align: center; margin: 0 0 16px;">Hello ${name},</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            Thank you for your interest in the position. We have reviewed your application and, unfortunately, we will not be moving forward with your profile at this time.
          </p>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
            We will keep your details in our system and reach out if another matching opportunity arises. We wish you the best in your job search.
          </p>
        </div>
        <div style="background: #f9fafb; padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 The gojobsync.com — All Rights Reserved</p>
        </div>
      </div>
    `,
  },
  interview_scheduled: {
    subject: '📅 Interview Scheduled - The GoJobSync',
    html: (name: string) => `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: #1a237e; padding: 32px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 2px;">The GoJobSync</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 12px; letter-spacing: 3px;">CAREER PORTAL</p>
        </div>
        <div style="padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;"><span style="font-size: 48px;">📅</span></div>
          <h2 style="color: #1a237e; text-align: center; margin: 0 0 16px;">Hello ${name}!</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6; text-align: center;">
            Great news! Your interview has been <strong style="color: #2563eb;">scheduled</strong>. Our team will share the date, time, and meeting link shortly.
          </p>
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
            <p style="color: #1e40af; font-size: 14px; margin: 0;"><strong>Status Updated:</strong> Interview Scheduled 📅</p>
          </div>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">Please keep your resume and documents ready. Good luck!</p>
        </div>
        <div style="background: #f9fafb; padding: 20px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 The gojobsync.com — All Rights Reserved</p>
        </div>
      </div>
    `,
  },
};

async function sendStatusEmail(email: string, name: string, status: string) {
  const template = STATUS_EMAIL_TEMPLATES[status];
  if (!template) return; // No email for statuses like "new"

  try {
    await transporter.sendMail({
      from: `"The GoJobSync" <hr@gojobsync.com>`,
      replyTo: process.env.SMTP_EMAIL || 'thejobsyncit@gmail.com',
      to: email,
      subject: template.subject,
      html: template.html(name),
    });
    console.log(`✅ Email sent to ${email} for status: ${status}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${email}:`, error);
  }
}

export async function GET() {
  try {
    // Always fetch ALL applied candidates
    const appliedCandidates = await prisma.candidate.findMany({
      where: { source: 'applied' },
      orderBy: { createdAt: 'desc' },
      include: {
        assignedSupport: { select: { id: true, name: true } }
      } as any
    });

    // Fetch the most recent 1500 candidates that are NOT applied
    const otherCandidates = await prisma.candidate.findMany({
      where: { source: { not: 'applied' } },
      orderBy: { createdAt: 'desc' },
      include: {
        assignedSupport: { select: { id: true, name: true } }
      } as any
    });

    // Combine them, placing applied ones at the top
    const candidates = [...appliedCandidates, ...otherCandidates];
    return NextResponse.json(candidates);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();

    const oldCandidate = await prisma.candidate.findUnique({
      where: { id },
      select: { status: true }
    });

    const candidate = await prisma.candidate.update({
      where: { id },
      data,
      include: { requirement: { select: { title: true } } }
    });

    // Send auto email in background (fire-and-forget, don't block the response)
    if (data.status) {
      sendStatusEmail(candidate.email, candidate.name, data.status).catch(() => {});

      if (oldCandidate && oldCandidate.status !== data.status && candidate.phone) {
        notifyCandidateStatusChange(
          candidate.phone,
          candidate.name,
          candidate.requirement?.title || 'Job Application',
          data.status
        ).catch(console.error);
      }
    }

    return NextResponse.json(candidate);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.candidate.delete({ where: { id } });
    return NextResponse.json({ message: 'Candidate deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

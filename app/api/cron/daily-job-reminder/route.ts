import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function GET(req: NextRequest) {
  try {
    // 1. Fetch active open jobs
    const activeJobs = await prisma.jobRequirement.findMany({
      where: { status: 'open' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        location: true,
        salaryRange: true,
        client: {
          select: { companyName: true }
        }
      }
    });

    if (activeJobs.length === 0) {
      return NextResponse.json({ success: true, message: 'No active open jobs to recommend.' });
    }

    // 2. Fetch candidates and their applications
    const candidates = await prisma.candidateAccount.findMany({
      where: { isVerified: true },
      select: {
        id: true,
        name: true,
        email: true,
        applications: {
          select: { requirementId: true }
        }
      }
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'jwij4ht3pzhr.hkph.mail-manager-smtp.amazonaws.com',
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
      }
    });

    let sentCount = 0;

    for (const c of candidates) {
      // Get set of job IDs the candidate has already applied to
      const appliedIds = new Set(c.applications.map((a: any) => a.requirementId));

      // Filter to jobs they haven't applied to, and take top 5
      const unappliedJobs = activeJobs.filter(j => !appliedIds.has(j.id)).slice(0, 5);

      if (unappliedJobs.length > 0) {
        const jobsHtml = unappliedJobs.map(j => `
          <div style="background: #f8fafc; padding: 16px; margin-bottom: 12px; border-radius: 8px; border-left: 4px solid #0077B6;">
            <h3 style="margin: 0 0 4px 0; color: #0f172a; font-size: 16px;">${j.title}</h3>
            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">${j.client?.companyName} &bull; ${j.location}</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.gojobsync.com'}/careers/jobs/${j.id}" style="display: inline-block; background: #0077B6; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: bold;">View Job &rarr;</a>
          </div>
        `).join('');

        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4f8; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 32px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
              .header { background: linear-gradient(135deg, #03045E, #0077B6); padding: 32px 40px; text-align: center; }
              .header h1 { color: white; margin: 0; font-size: 22px; font-weight: 800; }
              .body { padding: 32px 40px; color: #1e293b; font-size: 15px; line-height: 1.6; }
              .cta { display: block; background: #0077B6; color: white; text-align: center; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 24px; }
              .footer { background: #f8fafc; padding: 20px 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Jobs Waiting For You!</h1>
              </div>
              <div class="body">
                <p>Hi ${c.name},</p>
                <p>We found some open positions that you haven't applied to yet. Take a look and don't miss out on these opportunities:</p>
                
                ${jobsHtml}

                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.gojobsync.com'}/careers" class="cta">View All Jobs on GoJobSync</a>
              </div>
              <div class="footer">
                © 2026 GoJobSync — All Rights Reserved<br/>
                www.gojobsync.com
              </div>
            </div>
          </body>
          </html>
        `;

        try {
          await transporter.sendMail({
            from: '"GoJobSync Team" <hr@gojobsync.com>',
            to: c.email,
            replyTo: process.env.SMTP_EMAIL || 'thejobsyncit@gmail.com',
            subject: 'New Job Opportunities on GoJobSync',
            html,
          });
          sentCount++;
          
          // Delay to prevent AWS SES rate limiting
          await new Promise(r => setTimeout(r, 1000));
        } catch (error) {
          console.error(`Failed to send job reminder to ${c.email}:`, error);
        }
      }
    }

    return NextResponse.json({ success: true, message: `Sent job reminders to ${sentCount} candidates.` });
  } catch (error: any) {
    console.error('Error running daily job reminder cron:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

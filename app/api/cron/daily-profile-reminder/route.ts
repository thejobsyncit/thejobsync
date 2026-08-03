import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import nodemailer from 'nodemailer';

// Helper to check profile completion percentage
function getProfileCompletion(c: any): number {
  let score = 9; // Basic info (name, email, phone)

  if (c.headline && c.headline.trim() !== '') score += 7;
  if (c.summary && c.summary.trim() !== '') score += 7;
  if (c.skills && c.skills !== '[]' && c.skills !== '') score += 7;
  if (c.experience && c.experience.trim() !== '') score += 7;
  if (c.education && c.education.trim() !== '') score += 7;
  if (c.location && c.location.trim() !== '') score += 7;
  if (c.resumeUrl && c.resumeUrl.trim() !== '') score += 7;
  if (c.photoUrl && c.photoUrl.trim() !== '') score += 7;
  if (c.languages && c.languages.trim() !== '') score += 7;
  if (c.currentCompany && c.currentCompany.trim() !== '') score += 7;
  if (c.currentRole && c.currentRole.trim() !== '') score += 7;
  if (c.expectedSalary && c.expectedSalary.trim() !== '') score += 7;
  if (c.preferredRoles && c.preferredRoles.trim() !== '') score += 7;

  return score; // Max 100
}

export async function GET(req: NextRequest) {
  // Optional security check (e.g. check a CRON_SECRET token if needed)
  // const authHeader = req.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new NextResponse('Unauthorized', { status: 401 });
  // }

  try {
    const candidates = await prisma.candidateAccount.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        headline: true,
        summary: true,
        skills: true,
        experience: true,
        education: true,
        location: true,
        resumeUrl: true,
        photoUrl: true,
        languages: true,
        currentCompany: true,
        currentRole: true,
        expectedSalary: true,
        preferredRoles: true
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
      const percentage = getProfileCompletion(c);
      
      if (percentage < 100) {
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
              .progress-bar { background: #e2e8f0; border-radius: 10px; height: 16px; width: 100%; margin: 20px 0; overflow: hidden; }
              .progress-fill { background: #22c55e; height: 100%; width: ${percentage}%; }
              .cta { display: block; background: #0077B6; color: white; text-align: center; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 24px; }
              .footer { background: #f8fafc; padding: 20px 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Complete Your GoJobSync Profile!</h1>
              </div>
              <div class="body">
                <p>Hi ${c.name},</p>
                <p>Your profile is currently <strong>${percentage}% complete</strong>. Recruiters are actively looking for candidates, and a 100% complete profile stands out!</p>
                <div class="progress-bar">
                  <div class="progress-fill"></div>
                </div>
                <p>Please log in and update your missing details (like your resume, skills, and experience).</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.gojobsync.com'}/careers" class="cta">Update Profile Now</a>
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
            from: `"GoJobSync Team" <hr@gojobsync.com>`,
            to: c.email,
            replyTo: process.env.SMTP_EMAIL || 'thejobsyncit@gmail.com',
            subject: 'Action Required: Complete your GoJobSync Profile',
            html,
          });
          sentCount++;
          
          // Delay to prevent AWS SES rate limiting
          await new Promise(r => setTimeout(r, 1000));
        } catch (error) {
          console.error(`Failed to send reminder to ${c.email}:`, error);
        }
      }
    }

    return NextResponse.json({ success: true, message: `Sent ${sentCount} reminders for incomplete profiles.` });
  } catch (error: any) {
    console.error('Error running daily reminder cron:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

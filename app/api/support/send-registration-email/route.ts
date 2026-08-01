import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { candidateId, fromEmail, toEmail, subject, message } = await req.json();

    if (!candidateId || !toEmail || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Basic email validation to prevent AWS from throwing format errors
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(toEmail)) {
      await prisma.candidate.update({
        where: { id: candidateId },
        data: { status: 'completed', updatedAt: new Date() }
      });
      return NextResponse.json({ success: true, message: 'Invalid email format, bypassed.' });
    }

    const sender = fromEmail || 'hr@gojobsync.com';

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'jwij4ht3pzhr.hkph.mail-manager-smtp.amazonaws.com',
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
      }
    });

    await transporter.sendMail({
      from: `"GoJobSync" <${sender}>`,
      to: toEmail,
      replyTo: process.env.SMTP_EMAIL || 'thejobsyncit@gmail.com',
      subject: subject,
      html: `
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
            .footer { background: #f8fafc; padding: 20px 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${subject}</h1>
            </div>
            <div class="body">
              ${message.replace(/\n/g, '<br/>')}
            </div>
            <div class="footer">
              © 2026 GoJobSync — All Rights Reserved<br/>
              www.gojobsync.com
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Automatically mark as 'completed'
    await prisma.candidate.update({
      where: { id: candidateId },
      data: { status: 'completed', updatedAt: new Date() }
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully via AWS SES!' });
  } catch (error: any) {
    console.error('Error sending registration email:', error);
    return NextResponse.json({ error: `Server Error: ${error.message || 'Unknown'}` }, { status: 500 });
  }
}

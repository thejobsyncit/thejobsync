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
        pass: process.env.SMTP_PASSWORD,
      }
    });

    await transporter.sendMail({
      from: `"GoJobSync" <${sender}>`,
      to: toEmail,
      subject: subject,
      html: message,
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

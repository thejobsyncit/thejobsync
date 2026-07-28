import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { candidateId, fromEmail, toEmail, subject, message } = await req.json();

    if (!candidateId || !toEmail || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let smtpUser = process.env.SMTP_EMAIL;
    let smtpPass = process.env.SMTP_PASSWORD;
    if (!smtpUser || !smtpPass) {
      smtpUser = process.env.SMTP_USER;
      smtpPass = process.env.SMTP_PASS;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass?.replace(/\s+/g, ''),
      },
    });

    const mailOptions = {
      from: fromEmail || smtpUser, // Use custom fromEmail or fallback to SMTP user
      to: toEmail,
      subject: subject,
      text: message,
      html: `<p style="white-space: pre-wrap;">${message}</p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Update candidate status to completed
    await prisma.candidate.update({
      where: { id: candidateId },
      data: { 
        status: 'completed',
        // Also update the updated at manually just in case, though Prisma does this automatically
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully and profile marked as completed!' });
  } catch (error: any) {
    console.error('Error sending registration email:', error);
    return NextResponse.json({ error: `SMTP Error: ${error.message || 'Unknown'}` }, { status: 500 });
  }
}

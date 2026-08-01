import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { companyId, name, toEmail, subject, message } = data;

    if (!toEmail) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'jwij4ht3pzhr.hkph.mail-manager-smtp.amazonaws.com',
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
      }
    });

    // Formatting the message to preserve newlines as HTML line breaks
    const htmlMessage = message.replace(/\n/g, '<br/>');

    const sender = data.fromEmail || 'hr@gojobsync.com';

    const mailOptions = {
      from: `"GoJobSync Team" <${sender}>`,
      to: toEmail,
      subject: subject || 'Partnership Opportunities with GoJobSync',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          ${htmlMessage}
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    if (companyId) {
      await prisma.client.update({
        where: { id: companyId },
        data: { status: 'completed', updatedAt: new Date() }
      });
    }

    return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending company email:', error);
    return NextResponse.json({ error: 'Failed to send email. Please try again later.' }, { status: 500 });
  }
}

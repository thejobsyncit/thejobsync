import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { toEmail, subject, message } = await req.json();

    if (!toEmail || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL || process.env.SMTP_USER,
        pass: (process.env.SMTP_PASSWORD || process.env.SMTP_PASS)?.replace(/\s+/g, ''),
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL || process.env.SMTP_USER,
      to: toEmail,
      subject: subject,
      text: message,
      html: `<p style="white-space: pre-wrap;">${message}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email. Check credentials.' }, { status: 500 });
  }
}

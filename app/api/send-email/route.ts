import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { toEmail, subject, message } = await req.json();

    if (!toEmail || !subject || !message) {
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
      from: smtpUser,
      to: toEmail,
      subject: subject,
      text: message,
      html: `<p style="white-space: pre-wrap;">${message}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: `SMTP Error: ${error.message || 'Unknown'}` }, { status: 500 });
  }
}

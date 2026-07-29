import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');
  
  try {
    const { candidateId, fromEmail, toEmail, subject, message } = await req.json();

    if (!candidateId || !toEmail || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sender = fromEmail || 'hr@gojobsync.com';

    const { data, error } = await resend.emails.send({
      from: `GoJobSync <${sender}>`,
      to: [toEmail],
      subject: subject,
      text: message,
      html: `<p style="white-space: pre-wrap;">${message}</p>`,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update candidate status to completed
    await prisma.candidate.update({
      where: { id: candidateId },
      data: { 
        status: 'completed',
        // Also update the updated at manually just in case, though Prisma does this automatically
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully via Resend!' });
  } catch (error: any) {
    console.error('Error sending registration email:', error);
    return NextResponse.json({ error: `Server Error: ${error.message || 'Unknown'}` }, { status: 500 });
  }
}

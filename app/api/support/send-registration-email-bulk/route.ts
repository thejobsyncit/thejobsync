import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { candidateIds, fromEmail, subject, messageTemplate } = await req.json();

    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0 || !subject || !messageTemplate) {
      return NextResponse.json({ error: 'Missing required fields or no candidates selected' }, { status: 400 });
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

    const candidates = await prisma.candidate.findMany({
      where: {
        id: { in: candidateIds }
      }
    });

    let successCount = 0;
    let failCount = 0;

    // Send emails sequentially to avoid spam triggers/rate limits on standard SMTP
    for (const candidate of candidates) {
      if (!candidate.email || candidate.email.startsWith('noemail-')) {
        failCount++;
        continue;
      }

      // Replace template variables
      const personalizedMessage = messageTemplate.replace(/\{name\}/g, candidate.name || 'there');

      const mailOptions = {
        from: fromEmail || smtpUser,
        to: candidate.email,
        subject: subject,
        text: personalizedMessage,
        html: `<p style="white-space: pre-wrap;">${personalizedMessage}</p>`,
      };

      try {
        await transporter.sendMail(mailOptions);
        
        await prisma.candidate.update({
          where: { id: candidate.id },
          data: { 
            status: 'completed',
            updatedAt: new Date()
          }
        });
        
        successCount++;
      } catch (err) {
        console.error(`Failed to send to ${candidate.email}:`, err);
        failCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Bulk email complete. Sent successfully to ${successCount} candidates. Failed: ${failCount}` 
    });
  } catch (error: any) {
    console.error('Error in bulk email:', error);
    return NextResponse.json({ error: `Server Error: ${error.message || 'Unknown'}` }, { status: 500 });
  }
}

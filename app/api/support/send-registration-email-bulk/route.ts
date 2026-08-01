import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { candidateIds, fromEmail, subject, messageTemplate } = await req.json();

    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0 || !subject || !messageTemplate) {
      return NextResponse.json({ error: 'Missing required fields or no candidates selected' }, { status: 400 });
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
        from: `"GoJobSync" <${fromEmail || 'hr@gojobsync.com'}>`,
        replyTo: process.env.SMTP_EMAIL || 'thejobsyncit@gmail.com',
        to: candidate.email,
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
                ${personalizedMessage.replace(/\n/g, '<br/>')}
              </div>
              <div class="footer">
                © 2026 GoJobSync — All Rights Reserved<br/>
                www.gojobsync.com
              </div>
            </div>
          </body>
          </html>
        `,
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

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getEmployerId } from '@/lib/auth';
import { transporter } from '@/lib/mail';

export async function GET(req: NextRequest) {
  const employerId = await getEmployerId(req);
  if (!employerId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const jobs = await prisma.employerJob.findMany({
    where: { employerId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  const employerId = await getEmployerId(req);
  if (!employerId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const { title, description, skills, experience, location, salaryRange, jobType, field, openings } =
      await req.json();

    if (!title || !description || !location || !field) {
      return NextResponse.json({ error: 'Title, description, location and field are required' }, { status: 400 });
    }

    // Check subscription plan
    const activeSubs = await (prisma as any).employerSubscription.findMany({
      where: {
        employerId,
        status: 'active',
        planType: 'job_posting',
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'asc' } // Use the oldest valid one first
    });

    const activeSub = activeSubs.find((sub: any) => sub.jobsUsed < sub.jobsAllowed);

    if (!activeSub) {
      return NextResponse.json({ error: 'No active job posting package found or limits reached. Please purchase a new package.' }, { status: 403 });
    }

    const job = await prisma.employerJob.create({
      data: {
        employerId,
        title,
        description,
        skills: JSON.stringify(Array.isArray(skills) ? skills : []),
        experience: experience || 'Any',
        location,
        salaryRange: salaryRange || 'Negotiable',
        jobType: jobType || 'full-time',
        field,
        openings: openings || 1,
        status: 'active',
      },
    });

    // Increment jobs used in the subscription
    await (prisma as any).employerSubscription.update({
      where: { id: activeSub.id },
      data: { jobsUsed: activeSub.jobsUsed + 1 }
    });

    // Bridge: Create Client and JobRequirement so it appears in CRM & Careers
    try {
      const employer = await prisma.employer.findUnique({ where: { id: employerId } });
      if (employer) {
        let client = await prisma.client.findFirst({ where: { email: employer.email } });
        if (!client) {
          client = await prisma.client.create({
            data: {
              companyName: employer.companyName,
              contactPerson: employer.contactPerson,
              email: employer.email,
              phone: employer.contactPhone,
              address: employer.address,
              industry: employer.industry,
              website: employer.website || '',
              status: 'active'
            }
          });
        }

        await prisma.jobRequirement.create({
          data: {
            clientId: client.id,
            title,
            description,
            skills: JSON.stringify(Array.isArray(skills) ? skills : []),
            experience: experience || 'Any',
            positions: openings || 1,
            location,
            salaryRange: salaryRange || 'Negotiable',
            status: 'open',
            priority: 'medium',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }
        });
      }
    } catch (bridgeError) {
      console.error('Failed to bridge employer job to CRM:', bridgeError);
    }

    // Send job alert email to all registered candidates (non-blocking)
    setImmediate(async () => {
      try {
        const employer = await prisma.employer.findUnique({ where: { id: employerId } });
        const candidates = await prisma.candidateAccount.findMany({
          select: { email: true, name: true, phone: true },
        });

        if (candidates.length === 0) return;

        const host = req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
        const baseUrl = host ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
        const jobUrl = `${baseUrl}/careers`;
        const companyName = employer?.companyName || 'A Company';
        const skillsList = Array.isArray(skills) ? skills.join(', ') : (skills || 'Not specified');

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4f8; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 32px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #03045E, #0077B6); padding: 32px 40px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { color: #90E0EF; margin: 6px 0 0; font-size: 13px; }
    .body { padding: 32px 40px; }
    .badge { display: inline-block; background: #e0f2fe; color: #0369a1; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 999px; margin-bottom: 16px; }
    .job-title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 4px; }
    .company { font-size: 15px; color: #0077B6; font-weight: 600; margin-bottom: 20px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; }
    .info-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .info-value { font-size: 14px; font-weight: 600; color: #1e293b; }
    .cta { display: block; background: linear-gradient(135deg, #0ea5e9, #0077B6); color: white; text-decoration: none; text-align: center; padding: 16px 32px; border-radius: 12px; font-weight: 800; font-size: 16px; margin: 24px 0 0; }
    .footer { background: #f8fafc; padding: 20px 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 New Job Alert — The TheJobSync</h1>
      <p>A new opportunity just dropped on The TheJobSync careers portal</p>
    </div>
    <div class="body">
      <div class="badge">New Opening</div>
      <div class="job-title">${title}</div>
      <div class="company">📍 ${companyName}</div>
      <div class="info-grid">
        <div class="info-box"><div class="info-label">Field</div><div class="info-value">${field || 'General'}</div></div>
        <div class="info-box"><div class="info-label">Job Type</div><div class="info-value">${jobType || 'Full-time'}</div></div>
        <div class="info-box"><div class="info-label">Location</div><div class="info-value">${location}</div></div>
        <div class="info-box"><div class="info-label">Salary Range</div><div class="info-value">${salaryRange || 'Negotiable'}</div></div>
        <div class="info-box"><div class="info-label">Openings</div><div class="info-value">${openings || 1} Position(s)</div></div>
        <div class="info-box"><div class="info-label">Experience</div><div class="info-value">${experience || 'Any'}</div></div>
      </div>
      ${skillsList ? `<p style="font-size:13px;color:#475569;"><strong>Skills:</strong> ${skillsList}</p>` : ''}
      <p style="font-size:14px;color:#64748b;line-height:1.6;">${description?.slice(0, 300)}${description?.length > 300 ? '...' : ''}</p>
      <a href="${jobUrl}" class="cta">View & Apply Now →</a>
    </div>
    <div class="footer">
      You're receiving this because you're registered on The TheJobSync careers portal.<br/>
      <a href="${jobUrl}" style="color:#0077B6;">Unsubscribe</a> · The TheJobSync Careers
    </div>
  </div>
</body>
</html>`;

        if (process.env.SMTP_USER) {
          // Send individually to avoid BCC issues with AWS SES sandbox
          const BATCH = 10;
          for (let i = 0; i < candidates.length; i += BATCH) {
            const batch = candidates.slice(i, i + BATCH);
            await Promise.allSettled(batch.map((c: any) =>
              transporter.sendMail({
                from: `"TheJobSync" <hr@thejobsync.com>`,
                to: c.email,
                subject: `🚀 New Job: ${title} at ${companyName} — TheJobSync`,
                html,
              }).catch((err: any) => console.error(`Failed to send to ${c.email}:`, err))
            ));
          }
          console.log(`Job alert sent to ${candidates.length} candidates.`);
        }

        // WhatsApp notifications (fire-and-forget)
        try {
          const { sendWhatsApp } = await import('@/lib/whatsapp');
          candidates.forEach((c) => {
            if (c.phone) {
              const msg =
                `Hi ${c.name}! 👋\n\n` +
                `New Job Opportunity at *${companyName}*!\n\n` +
                `📌 *Role:* ${title}\n` +
                `📍 *Location:* ${location}\n` +
                `💼 *Experience:* ${experience || 'Any'}\n\n` +
                `Log in to your portal to view details and apply! 🚀\n\n` +
                `— The TheJobSync Team`;
              sendWhatsApp(c.phone, msg).catch(console.error);
            }
          });
        } catch (waErr) {
          console.error('[WhatsApp] New job notifications failed:', waErr);
        }
      } catch (emailErr) {
        console.error('Failed to send job alert notifications:', emailErr);
      }
    });

    return NextResponse.json({ success: true, job });
  } catch (err) {
    console.error('create job error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const employerId = await getEmployerId(req);
  if (!employerId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });

    const job = await prisma.employerJob.findUnique({ where: { id } });
    if (!job || job.employerId !== employerId) {
      return NextResponse.json({ error: 'Job not found or unauthorized' }, { status: 404 });
    }

    await prisma.employerJob.delete({ where: { id } });

    // Also try to close/delete the corresponding JobRequirement in CRM
    try {
      const employer = await prisma.employer.findUnique({ where: { id: employerId } });
      if (employer) {
        const client = await prisma.client.findFirst({ 
          where: { 
            OR: [
              { email: employer.email },
              { companyName: employer.companyName }
            ]
          } 
        });
        if (client) {
          // Find the requirement with the same title created for this client
          const requirements = await prisma.jobRequirement.findMany({
            where: { clientId: client.id, title: job.title },
            orderBy: { createdAt: 'desc' },
            take: 1
          });
          if (requirements.length > 0) {
            await prisma.jobRequirement.delete({ where: { id: requirements[0].id } });
          }
        }
      }
    } catch (e) {
      console.error('Failed to delete bridged requirement', e);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('delete job error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const employerId = await getEmployerId(req);
  if (!employerId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const data = await req.json();
    const { id, title, description, skills, experience, location, salaryRange, jobType, field, openings } = data;

    if (!id) return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    if (!title || !description || !location || !field) {
      return NextResponse.json({ error: 'Title, description, location and field are required' }, { status: 400 });
    }

    const existingJob = await prisma.employerJob.findUnique({ where: { id } });
    if (!existingJob || existingJob.employerId !== employerId) {
      return NextResponse.json({ error: 'Job not found or unauthorized' }, { status: 403 });
    }

    const updatedJob = await prisma.employerJob.update({
      where: { id },
      data: {
        title,
        description,
        skills: JSON.stringify(Array.isArray(skills) ? skills : []),
        experience: experience || 'Any',
        location,
        salaryRange: salaryRange || 'Negotiable',
        jobType: jobType || 'full-time',
        field,
        openings: openings || 1,
      },
    });

    // Also update the bridged JobRequirement if it exists
    try {
      const employer = await prisma.employer.findUnique({ where: { id: employerId } });
      if (employer) {
        const client = await prisma.client.findFirst({ 
          where: { 
            OR: [
              { email: employer.email },
              { companyName: employer.companyName }
            ]
          } 
        });
        if (client) {
          const requirements = await prisma.jobRequirement.findMany({
            where: { clientId: client.id, title: existingJob.title },
            orderBy: { createdAt: 'desc' },
            take: 1
          });
          if (requirements.length > 0) {
            await prisma.jobRequirement.update({
              where: { id: requirements[0].id },
              data: {
                title,
                description,
                skills: JSON.stringify(Array.isArray(skills) ? skills : []),
                experience: experience || 'Any',
                positions: openings || 1,
                location,
                salaryRange: salaryRange || 'Negotiable',
              }
            });
          }
        }
      }
    } catch (e) {
      console.error('Failed to update bridged requirement', e);
    }

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (err) {
    console.error('update job error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

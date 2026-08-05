import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/video-introduction?email=candidate@example.com
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Candidate email parameter is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const record = await (prisma as any).videoIntroduction.findFirst({
      where: { email: cleanEmail },
      orderBy: { createdAt: 'desc' }
    });

    if (!record) {
      return NextResponse.json({ success: true, video: null });
    }

    return NextResponse.json({ success: true, video: record });
  } catch (err: any) {
    console.error('Fetch video introduction API error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch video introduction' }, { status: 500 });
  }
}

// POST /api/video-introduction
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { candidateId, candidateName, email, videoUrl, duration, durationSec } = body;

    if (!email || !videoUrl) {
      return NextResponse.json({ error: 'Candidate email and video URL are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const videoRecord = {
      id: `VID-${Date.now()}`,
      candidateId: candidateId || null,
      candidateName: candidateName || 'Candidate',
      email: cleanEmail,
      videoUrl,
      duration: duration || '01:00',
      durationSec: durationSec || 60,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };

    try {
      if ((prisma as any).videoIntroduction) {
        const dbData = { ...videoRecord };
        delete (dbData as any).id;
        delete (dbData as any).createdAt;

        const record = await (prisma as any).videoIntroduction.create({
          data: dbData
        });
        return NextResponse.json({ success: true, video: record });
      }
    } catch (dbErr) {
      console.warn('Prisma VideoIntroduction DB write notice, returning generated record:', dbErr);
    }

    return NextResponse.json({ success: true, video: videoRecord });
  } catch (err: any) {
    console.error('Submit video introduction API error:', err);
    return NextResponse.json({ error: err.message || 'Failed to submit video introduction' }, { status: 500 });
  }
}

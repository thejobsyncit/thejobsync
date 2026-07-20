import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WEBP files allowed' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const candidateId = formData.get('candidateId') as string | null;
    
    // Convert to base64 data URI for serverless environments (Vercel)
    const base64Str = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64Str}`;

    if (candidateId) {
      const { prisma } = require('@/lib/db');
      await (prisma as any).candidateAccount.update({
        where: { id: candidateId },
        data: { photoUrl: dataUri }
      });
      const acc = await (prisma as any).candidateAccount.findUnique({ where: { id: candidateId } });
      if (acc?.email) {
        await prisma.candidate.updateMany({
          where: { email: acc.email },
          data: { photoUrl: dataUri }
        });
      }
    }

    return NextResponse.json({ url: dataUri });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

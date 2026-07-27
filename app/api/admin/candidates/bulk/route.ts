import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const candidatesData = body.candidates;

    if (!Array.isArray(candidatesData) || candidatesData.length === 0) {
      return NextResponse.json({ error: 'Valid candidates array is required' }, { status: 400 });
    }

    // Map to Prisma model format
    const formattedCandidates = candidatesData.map((cand: any) => ({
      name: (cand.name || cand.fullName || cand.candidateName || 'NA').toString().trim(),
      email: (cand.email || cand.mailId || cand.mail || `noemail-${Math.random().toString(36).substring(7)}@example.com`).toString().trim(),
      phone: (cand.phone || cand.contactNo || cand.contact || cand.mobile || 'NA').toString().trim(),
      skills: JSON.stringify(
        Array.isArray(cand.skills)
          ? cand.skills
          : typeof cand.skills === 'string' && cand.skills
          ? cand.skills.split(',').map((s: string) => s.trim())
          : []
      ),
      experience: (cand.experience || cand.exp || 'NA').toString().trim(),
      education: (cand.education || cand.degree || cand.qualification || 'NA').toString().trim(),
      currentCompany: (cand.currentCompany || cand.company || null)?.toString().trim() || null,
      currentRole: (cand.currentRole || cand.department || cand.role || cand.designation || 'NA').toString().trim(),
      expectedSalary: (cand.expectedSalary || cand.salary || null)?.toString().trim() || null,
      location: (cand.location || cand.city || cand.place || 'NA').toString().trim(),
      resumeUrl: (cand.resumeUrl || cand.resume || cand.cv || null)?.toString().trim() || null,
      status: 'new',
      source: 'excel_upload',
      notes: (cand.notes || cand.remarks || 'Uploaded via Excel').toString().trim(),
    }));

    // Process and insert candidates in bulk
    const result = await prisma.candidate.createMany({
      data: formattedCandidates,
      skipDuplicates: true // highly recommended for massive bulk uploads
    });

    return NextResponse.json({
      message: `Successfully uploaded ${result.count} candidates`,
      count: result.count,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error in bulk candidate upload:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload candidates in bulk' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const candidatesData = body.candidates;
    const assignedSupportId = body.assignedSupportId || null;
    const customSource = body.source || 'excel_upload';

    if (!Array.isArray(candidatesData) || candidatesData.length === 0) {
      return NextResponse.json({ error: 'Valid candidates array is required' }, { status: 400 });
    }

    // Map to Prisma model format first, so we know exactly what email/phone we will insert
    const formattedCandidatesList = candidatesData.map((cand: any) => {
      const name = (cand.name || cand.fullName || cand.candidateName || 'NA').toString().trim();
      const phone = (cand.phone || cand.contactNo || cand.contact || cand.mobile || 'NA').toString().trim();
      const role = (cand.currentRole || cand.department || cand.role || cand.designation || 'NA').toString().trim();
      
      let email = (cand.email || cand.mailId || cand.mail || '').toString().trim();
      // Force recalculate any missing or frontend-generated noemail- addresses deterministically
      if (!email || email.startsWith('noemail-')) {
        const safeName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 15) || 'unknown';
        const safeRole = role.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 10) || 'na';
        email = `noemail-${safeName}-${safeRole}@example.com`;
      }
      
      return {
        name,
        email,
        phone,
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
        currentRole: role,
        expectedSalary: (cand.expectedSalary || cand.salary || null)?.toString().trim() || null,
        location: (cand.location || cand.city || cand.place || 'NA').toString().trim(),
        resumeUrl: (cand.resumeUrl || cand.resume || cand.cv || null)?.toString().trim() || null,
        status: 'new',
        source: customSource,
        assignedSupportId: assignedSupportId,
        notes: (cand.notes || cand.remarks || 'Uploaded via Excel').toString().trim(),
      };
    });

    // Extract emails and phones from the formatted payload to check for duplicates
    const incomingEmails = formattedCandidatesList.map(c => c.email).filter(e => e !== '');
    const incomingPhones = formattedCandidatesList.map(c => c.phone).filter(p => p !== 'NA');

    // Fetch existing candidates matching these exact emails or phones
    const existingCandidates = await prisma.candidate.findMany({
      where: {
        OR: [
          ...(incomingEmails.length > 0 ? [{ email: { in: incomingEmails } }] : []),
          ...(incomingPhones.length > 0 ? [{ phone: { in: incomingPhones } }] : [])
        ]
      },
      select: { email: true, phone: true }
    });

    const existingEmails = new Set(existingCandidates.map(c => c.email));
    const existingPhones = new Set(existingCandidates.map(c => c.phone));

    // Filter out duplicates using the fetched DB data
    const finalCandidatesToInsert = formattedCandidatesList.filter((cand: any) => {
      // Skip if email or phone already exists in the database
      if (existingEmails.has(cand.email)) return false;
      if (cand.phone !== 'NA' && existingPhones.has(cand.phone)) return false;
      
      // Also add them to the sets so duplicates *within the same excel file chunk* are skipped too
      existingEmails.add(cand.email);
      if (cand.phone !== 'NA') existingPhones.add(cand.phone);
      
      return true;
    });

    if (finalCandidatesToInsert.length === 0) {
      return NextResponse.json({ 
        message: 'All candidates in this chunk were duplicates and skipped.',
        count: 0 
      }, { status: 201 });
    }

    // Process and insert candidates in bulk
    const result = await prisma.candidate.createMany({
      data: finalCandidatesToInsert,
      skipDuplicates: true // highly recommended for massive bulk uploads
    });

    return NextResponse.json({
      message: `Successfully uploaded ${result.count} candidates (skipped ${candidatesData.length - result.count} duplicates)`,
      count: result.count,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error in bulk candidate upload:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload candidates in bulk' }, { status: 500 });
  }
}

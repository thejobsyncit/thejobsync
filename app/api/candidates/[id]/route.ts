import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { notifyCandidateStatusChange } from '@/lib/whatsapp';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: { requirement: { select: { title: true, client: { select: { companyName: true } } } }, interviews: true },
    });
    if (!candidate) return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    return NextResponse.json({ ...candidate, skills: JSON.parse(candidate.skills) });
  } catch (error) {
    console.error('Error fetching candidate:', error);
    return NextResponse.json({ error: 'Failed to fetch candidate' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await request.json();

    const oldCandidate = await prisma.candidate.findUnique({
      where: { id },
      select: { status: true }
    });

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.email !== undefined) updateData.email = data.email.trim();
    if (data.phone !== undefined) updateData.phone = data.phone.trim();
    if (data.skills !== undefined) updateData.skills = JSON.stringify(data.skills);
    if (data.experience !== undefined) updateData.experience = data.experience.trim();
    if (data.education !== undefined) updateData.education = data.education.trim();
    if (data.currentCompany !== undefined) updateData.currentCompany = data.currentCompany?.trim() || null;
    if (data.currentRole !== undefined) updateData.currentRole = data.currentRole?.trim() || null;
    if (data.expectedSalary !== undefined) updateData.expectedSalary = data.expectedSalary?.trim() || null;
    if (data.location !== undefined) updateData.location = data.location.trim();
    if (data.resumeUrl !== undefined) updateData.resumeUrl = data.resumeUrl?.trim() || null;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.assignedSupportId !== undefined) updateData.assignedSupportId = data.assignedSupportId || null;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.appliedFor !== undefined) updateData.appliedFor = data.appliedFor || null;
    if (data.notes !== undefined) updateData.notes = data.notes?.trim() || null;

    const candidate = await prisma.candidate.update({
      where: { id },
      data: updateData as any,
      include: { requirement: { select: { title: true } } }
    });

    if (data.status !== undefined && oldCandidate && oldCandidate.status !== data.status) {
      if (candidate.phone) {
        notifyCandidateStatusChange(
          candidate.phone,
          candidate.name,
          candidate.requirement?.title || 'Job Application',
          data.status
        ).catch(console.error);
      }

      // Internal CRM Notification
      const targetUserIds: string[] = [];
      if (candidate.assignedSupportId) {
        targetUserIds.push(candidate.assignedSupportId);
      } else {
        const superAdmins = await prisma.user.findMany({ where: { role: 'super_admin' }, select: { id: true } });
        targetUserIds.push(...superAdmins.map(a => a.id));
      }

      if (targetUserIds.length > 0) {
        await prisma.notification.createMany({
          data: targetUserIds.map(uid => ({
            userId: uid,
            title: 'Candidate Status Updated',
            message: `${candidate.name} is now marked as ${data.status} for ${candidate.requirement?.title || 'Job Application'}.`,
            type: 'info',
            link: `/crm/candidates`
          }))
        });
      }
    }

    return NextResponse.json({ ...candidate, skills: JSON.parse(candidate.skills) });
  } catch (error) {
    console.error('Error updating candidate:', error);
    return NextResponse.json({ error: 'Failed to update candidate' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const intCount = await prisma.interview.count({ where: { candidateId: id } });
    if (intCount > 0) {
      return NextResponse.json({ error: `Cannot delete: ${intCount} interview(s) linked.` }, { status: 409 });
    }
    await prisma.candidate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json({ error: 'Failed to delete candidate' }, { status: 500 });
  }
}

import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/candidates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const requirementId = searchParams.get('requirementId') || '';
    const assignedHrId = searchParams.get('assignedHrId') || '';
    const assignedInterviewerId = searchParams.get('assignedInterviewerId') || '';

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { currentRole: { contains: search } },
        { location: { contains: search } },
      ];
    }
    if (status && status !== 'all') where.status = status;
    if (requirementId) where.appliedFor = requirementId;
    if (assignedHrId) where.assignedHrId = assignedHrId;
    if (assignedInterviewerId) where.assignedInterviewerId = assignedInterviewerId;

    const candidates = await prisma.candidate.findMany({
      where: where as any,
      include: { requirement: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });

    // Defensive JSON parse helper
    const safeParse = (str: string) => {
      try {
        const parsed = JSON.parse(str);
        if (typeof parsed === 'string') {
          return JSON.parse(parsed); // Handle double-stringified
        }
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    const parsed = candidates.map(c => ({
      ...c,
      skills: safeParse(c.skills),
      requirementTitle: c.requirement?.title || null,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}

// POST /api/candidates
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const errors: string[] = [];
    if (!data.name?.trim()) errors.push('Name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (!data.phone?.trim()) errors.push('Phone is required');
    if (!data.experience?.trim()) errors.push('Experience is required');
    if (!data.education?.trim()) errors.push('Education is required');
    if (!data.location?.trim()) errors.push('Location is required');
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Invalid email format');

    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const candidate = await prisma.candidate.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        skills: JSON.stringify(data.skills || []),
        experience: data.experience.trim(),
        education: data.education.trim(),
        currentCompany: data.currentCompany?.trim() || null,
        currentRole: data.currentRole?.trim() || null,
        expectedSalary: data.expectedSalary?.trim() || null,
        location: data.location.trim(),
        resumeUrl: data.resumeUrl?.trim() || null,
        status: data.status || 'new',
        appliedFor: data.appliedFor || null,
        notes: data.notes?.trim() || null,
      },
    });

    return NextResponse.json({ ...candidate, skills: JSON.parse(candidate.skills) }, { status: 201 });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
  }
}

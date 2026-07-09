import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/requirements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const clientId = searchParams.get('clientId') || '';

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { location: { contains: search } },
      ];
    }
    if (status && status !== 'all') where.status = status;
    if (priority && priority !== 'all') where.priority = priority;
    if (clientId) where.clientId = clientId;

    const requirements = await prisma.jobRequirement.findMany({
      where: where as any,
      include: { client: { select: { companyName: true } } },
      orderBy: { createdAt: 'desc' },
    });

    // Parse JSON fields
    const parsed = requirements.map(r => ({
      ...r,
      clientName: r.client.companyName,
      skills: JSON.parse(r.skills),
      assignedRecruiters: JSON.parse(r.assignedRecruiters),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error fetching requirements:', error);
    return NextResponse.json({ error: 'Failed to fetch requirements' }, { status: 500 });
  }
}

// POST /api/requirements
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const errors: string[] = [];
    if (!data.title?.trim()) errors.push('Title is required');
    if (!data.clientId?.trim()) errors.push('Client is required');
    if (!data.description?.trim()) errors.push('Description is required');
    if (!data.experience?.trim()) errors.push('Experience is required');
    if (!data.location?.trim()) errors.push('Location is required');
    if (!data.positions || data.positions < 1) errors.push('Positions must be at least 1');
    if (!data.deadline?.trim()) errors.push('Deadline is required');

    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    // Verify client exists
    const client = await prisma.client.findUnique({ where: { id: data.clientId } });
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const requirement = await prisma.jobRequirement.create({
      data: {
        clientId: data.clientId,
        title: data.title.trim(),
        description: data.description.trim(),
        skills: JSON.stringify(data.skills || []),
        experience: data.experience.trim(),
        positions: Number(data.positions),
        filledPositions: 0,
        location: data.location.trim(),
        salaryRange: data.salaryRange?.trim() || '',
        status: data.status || 'open',
        priority: data.priority || 'medium',
        assignedRecruiters: JSON.stringify(data.assignedRecruiters || []),
        deadline: data.deadline,
      },
      include: { client: { select: { companyName: true } } },
    });

    return NextResponse.json({
      ...requirement,
      clientName: requirement.client.companyName,
      skills: JSON.parse(requirement.skills),
      assignedRecruiters: JSON.parse(requirement.assignedRecruiters),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating requirement:', error);
    return NextResponse.json({ error: 'Failed to create requirement' }, { status: 500 });
  }
}

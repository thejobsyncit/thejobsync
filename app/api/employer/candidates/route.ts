import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { jwtVerify } from 'jose';


const JWT_SECRET = new TextEncoder().encode(
  process.env.EMPLOYER_JWT_SECRET || 'employer_jwt_secret_gojobsync_2024'
);

async function getEmployerId(req: NextRequest): Promise<string | null> {
  try {
    const token = req.cookies.get('employer_token')?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.employerId as string;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const employerId = await getEmployerId(req);
  if (!employerId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const field = searchParams.get('field') || '';
  const location = searchParams.get('location') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  const andConditions: Record<string, unknown>[] = [];

  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
        { headline: { contains: search } },
        { skills: { contains: search } },
        { currentRole: { contains: search } },
        { preferredRoles: { contains: search } },
      ],
    });
  }

  if (field) {
    // field may be a comma-separated list of keywords
    const keywords = field.split(',').map(k => k.trim()).filter(Boolean);
    const keywordConditions = keywords.flatMap(kw => [
      { preferredRoles: { contains: kw } },
      { skills: { contains: kw } },
      { headline: { contains: kw } },
      { currentRole: { contains: kw } },
    ]);
    if (keywordConditions.length > 0) {
      andConditions.push({ OR: keywordConditions });
    }
  }

  if (location) {
    andConditions.push({ location: { contains: location } });
  }

  const appliedParam = searchParams.get('applied') === 'true';
  let appliedIdsSet = new Set<string>();
  
  // Fetch employer to link to Client and find JobRequirements
  const employer = await prisma.employer.findUnique({ where: { id: employerId } });
  if (employer) {
    const clients = await prisma.client.findMany({
      where: {
        OR: [
          { email: employer.email },
          { companyName: employer.companyName },
          { companyName: { contains: employer.companyName.substring(0, Math.max(3, employer.companyName.length / 2)) } }
        ]
      }
    });
    const clientIds = clients.map(c => c.id);
    
    const requirements = await prisma.jobRequirement.findMany({
      where: { clientId: { in: clientIds } },
      select: { id: true }
    });
    const reqIds = requirements.map(r => r.id);
    
    const applications = await prisma.candidateApplication.findMany({
      where: { requirementId: { in: reqIds } },
      select: { candidateAccountId: true }
    });
    
    appliedIdsSet = new Set(applications.map(a => a.candidateAccountId));
  }

  if (appliedParam) {
    andConditions.push({ id: { in: Array.from(appliedIdsSet) } });
  }

  const salary = searchParams.get('salary') || '';
  if (salary) {
    // Always match the exact dropdown range string (new candidates)
    const salaryOrConditions: Record<string, unknown>[] = [
      { expectedSalary: { contains: salary } },
    ];

    // Parse range like "2 - 5 LPA" or "25+ LPA" to also match old free-text values
    const rangeMatch = salary.match(/^(\d+)\s*-\s*(\d+)/);
    const plusMatch = salary.match(/^(\d+)\+/);

    if (rangeMatch) {
      const min = parseInt(rangeMatch[1]);
      const max = parseInt(rangeMatch[2]);
      // For each integer in [min, max], add free-text fallback conditions
      for (let i = min; i <= max; i++) {
        salaryOrConditions.push({ expectedSalary: { equals: i.toString() } });
        salaryOrConditions.push({ expectedSalary: { contains: `${i} LPA` } });
        salaryOrConditions.push({ expectedSalary: { contains: `₹${i}` } });
        salaryOrConditions.push({ expectedSalary: { contains: `${i}L` } });
      }
    } else if (plusMatch) {
      const min = parseInt(plusMatch[1]);
      salaryOrConditions.push({ expectedSalary: { contains: `${min}+` } });
      salaryOrConditions.push({ expectedSalary: { contains: `${min} LPA` } });
      salaryOrConditions.push({ expectedSalary: { equals: min.toString() } });
    }

    andConditions.push({ OR: salaryOrConditions });
  }

  const where: Record<string, unknown> = {};
  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  const [candidates, total, savedCandidates] = await Promise.all([
    prisma.candidateAccount.findMany({
      where,
      select: {
        id: true, name: true, email: true, phone: true,
        headline: true, skills: true, experience: true,
        education: true, location: true, currentCompany: true,
        currentRole: true, expectedSalary: true, preferredRoles: true,
        photoUrl: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.candidateAccount.count({ where }),
    prisma.employerSavedCandidate.findMany({
      where: { employerId },
      select: { candidateAccountId: true }
    })
  ]);

  const savedIds = new Set(savedCandidates.map(sc => sc.candidateAccountId));

  const formattedCandidates = candidates.map(c => ({
    ...c,
    isSaved: savedIds.has(c.id),
    hasApplied: appliedIdsSet.has(c.id)
  }));

  return NextResponse.json({
    candidates: formattedCandidates,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}


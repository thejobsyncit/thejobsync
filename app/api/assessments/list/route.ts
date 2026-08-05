import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';
    const candidateEmail = searchParams.get('candidateEmail') || '';

    let whereClause: any = {};

    if (candidateEmail) {
      whereClause.OR = [
        { email: candidateEmail },
        { email: candidateEmail.toLowerCase() },
        { email: candidateEmail.toUpperCase() }
      ];
    }
    
    if (search) {
      whereClause.OR = [
        { candidateName: { contains: search } },
        { email: { contains: search } },
        { jobRole: { contains: search } }
      ];
    }

    if (role && role !== 'All Roles') {
      whereClause.jobRole = role;
    }

    if (status && status !== 'All Status') {
      if (status === 'Pass' || status === 'Fail') {
        whereClause.overallResult = status;
      } else {
        whereClause.hiringRecommendation = status;
      }
    }

    // Sort candidates by highest score first (descending) as explicitly requested!
    const results = await (prisma as any).assessmentResult.findMany({
      where: whereClause,
      orderBy: {
        finalScore: 'desc'
      }
    });

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error('Fetch assessments API error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch assessments' }, { status: 500 });
  }
}

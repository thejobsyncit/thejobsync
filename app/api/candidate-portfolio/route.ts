import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Helper function to validate HTTP/HTTPS URLs
function isValidUrl(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim();
  if (!trimmed) return true; // empty optional fields are valid
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

// Helper function to clean and auto-prefix URLs if needed
function cleanUrl(urlStr: string | undefined | null): string | null {
  if (!urlStr) return null;
  let trimmed = urlStr.trim();
  if (!trimmed) return null;
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  return trimmed;
}

// GET /api/candidate-portfolio?email=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query CandidateAccount first
    let account = await (prisma as any).candidateAccount.findUnique({
      where: { email: cleanEmail }
    });

    if (!account) {
      // Fallback query Candidate model
      const candidate = await (prisma as any).candidate.findFirst({
        where: { email: cleanEmail }
      });

      if (!candidate) {
        return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
      }

      account = candidate;
    }

    const portfolioData = {
      portfolioUrl: account.portfolioUrl || null,
      githubUrl: account.githubUrl || null,
      linkedinUrl: account.linkedinUrl || null,
      leetcodeUrl: account.leetcodeUrl || null,
      hackerrankUrl: account.hackerrankUrl || null,
      codechefUrl: account.codechefUrl || null,
      codeforcesUrl: account.codeforcesUrl || null,
      designUrl: account.designUrl || null,
      otherUrl: account.otherUrl || null
    };

    return NextResponse.json({ success: true, portfolio: portfolioData });
  } catch (error: any) {
    console.error('Fetch portfolio route error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}

// POST /api/candidate-portfolio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      portfolioUrl,
      githubUrl,
      linkedinUrl,
      leetcodeUrl,
      hackerrankUrl,
      codechefUrl,
      codeforcesUrl,
      designUrl,
      otherUrl
    } = body;

    if (!email) {
      return NextResponse.json({ error: 'Candidate email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Clean and validate all incoming URLs
    const fieldsToValidate = [
      { name: 'Portfolio Website URL', val: portfolioUrl, required: true },
      { name: 'GitHub URL', val: githubUrl, required: false },
      { name: 'LinkedIn URL', val: linkedinUrl, required: false },
      { name: 'LeetCode Profile URL', val: leetcodeUrl, required: false },
      { name: 'HackerRank Profile URL', val: hackerrankUrl, required: false },
      { name: 'CodeChef Profile URL', val: codechefUrl, required: false },
      { name: 'Codeforces Profile URL', val: codeforcesUrl, required: false },
      { name: 'Behance/Dribbble URL', val: designUrl, required: false },
      { name: 'Other Portfolio URL', val: otherUrl, required: false }
    ];

    const validationErrors: Record<string, string> = {};

    fieldsToValidate.forEach((field) => {
      const cleaned = cleanUrl(field.val);
      if (field.required && !cleaned) {
        validationErrors[field.name] = `${field.name} is required.`;
      } else if (cleaned && !isValidUrl(cleaned)) {
        validationErrors[field.name] = `Invalid URL format. Please provide a valid HTTP/HTTPS link.`;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed. Please fix invalid URLs.', validationErrors },
        { status: 400 }
      );
    }

    // Process cleaned values
    const updateData = {
      portfolioUrl: cleanUrl(portfolioUrl),
      githubUrl: cleanUrl(githubUrl),
      linkedinUrl: cleanUrl(linkedinUrl),
      leetcodeUrl: cleanUrl(leetcodeUrl),
      hackerrankUrl: cleanUrl(hackerrankUrl),
      codechefUrl: cleanUrl(codechefUrl),
      codeforcesUrl: cleanUrl(codeforcesUrl),
      designUrl: cleanUrl(designUrl),
      otherUrl: cleanUrl(otherUrl)
    };

    // Update CandidateAccount table
    let updatedAccount = null;
    try {
      updatedAccount = await (prisma as any).candidateAccount.update({
        where: { email: cleanEmail },
        data: updateData
      });
    } catch (e) {
      console.warn('CandidateAccount update error (might not exist yet):', e);
    }

    // Also update Candidate table if matching email exists
    try {
      await (prisma as any).candidate.updateMany({
        where: { email: cleanEmail },
        data: updateData
      });
    } catch (e) {
      console.warn('Candidate table sync update notice:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Portfolio links saved successfully!',
      portfolio: updateData
    });
  } catch (error: any) {
    console.error('Update candidate portfolio error:', error);
    return NextResponse.json({ error: 'Failed to save portfolio links' }, { status: 500 });
  }
}

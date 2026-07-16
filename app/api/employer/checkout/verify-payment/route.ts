import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
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

function getPlanLimits(planName: string) {
  // Define plan limits based on pricing page
  const plan = planName.trim();
  
  if (plan === 'Single Post' || plan === 'Standard' || plan === 'Trial Pack') {
    return { planType: 'job_posting', jobsAllowed: 1, resumeViewsAllowed: 0, durationDays: 30 };
  } else if (plan === '3-Job Pack' || plan === 'Classified' || plan === 'Hot Vacancy') {
    return { planType: 'job_posting', jobsAllowed: 3, resumeViewsAllowed: 0, durationDays: 30 };
  } else if (plan === '5-Job Pack') {
    return { planType: 'job_posting', jobsAllowed: 5, resumeViewsAllowed: 0, durationDays: 30 };
  } else if (plan.includes('RESDEX')) {
    return { planType: 'resdex', jobsAllowed: 0, resumeViewsAllowed: 100, durationDays: 15 };
  }
  
  // Default fallback
  return { planType: 'job_posting', jobsAllowed: 1, resumeViewsAllowed: 0, durationDays: 30 };
}

export async function POST(req: NextRequest) {
  try {
    const employerId = await getEmployerId(req);
    if (!employerId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, planName, amount, gstAmount, totalAmount } = await req.json();

    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Payment is successful, create subscription
    const limits = getPlanLimits(planName);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + limits.durationDays);

    const subscription = await (prisma as any).employerSubscription.create({
      data: {
        employerId,
        planName,
        planType: limits.planType,
        jobsAllowed: limits.jobsAllowed,
        jobsUsed: 0,
        resumeViewsAllowed: limits.resumeViewsAllowed,
        resumeViewsUsed: 0,
        amount: parseFloat(amount),
        gstAmount: parseFloat(gstAmount),
        totalAmount: parseFloat(totalAmount),
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'active',
        expiresAt,
      }
    });

    const employer = await prisma.employer.findUnique({
      where: { id: employerId }
    });

    // We should also record an invoice here to keep track of payments in admin panel
    await (prisma as any).invoice.create({
      data: {
        invoiceNumber: `INV-${Date.now()}`,
        companyName: employer?.companyName || "Employer Company",
        email: employer?.email || "employer@email.com",
        packageName: planName,
        amount: parseFloat(amount),
        gstAmount: parseFloat(gstAmount),
        totalAmount: parseFloat(totalAmount),
        status: 'paid',
        paidAt: new Date()
      }
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Failed to verify payment: ' + error.message, stack: error.stack }, { status: 500 });
  }
}

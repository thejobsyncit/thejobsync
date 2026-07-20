import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import * as jose from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_key_12345'
);

async function getCandidateId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('candidate_token')?.value;
    if (!token) return null;
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload.id as string;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const candidateId = await getCandidateId();
    if (!candidateId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', (process.env.RAZORPAY_KEY_SECRET || '').trim())
      .update(text.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Find the pending subscription created during create-order
    const subscription = await (prisma as any).candidateSubscription.findFirst({
      where: {
        razorpayOrderId: razorpay_order_id,
        candidateAccountId: candidateId
      }
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription order not found' }, { status: 404 });
    }

    // Mark subscription as active
    const activeSubscription = await (prisma as any).candidateSubscription.update({
      where: { id: subscription.id },
      data: {
        status: 'active',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      }
    });

    // Generate Candidate Invoice
    const candidate = await (prisma as any).candidateAccount.findUnique({
      where: { id: candidateId }
    });

    const inv = await (prisma as any).candidateInvoice.create({
      data: {
        invoiceNumber: `CINV-${Date.now()}`,
        candidateAccountId: candidateId,
        candidateName: candidate?.name || "Candidate",
        email: candidate?.email || "",
        planName: subscription.planName,
        amount: subscription.amount,
        gstAmount: subscription.gstAmount,
        totalAmount: subscription.totalAmount,
        status: 'paid',
        paidAt: new Date()
      }
    });

    return NextResponse.json({ success: true, subscription: activeSubscription });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Failed to verify payment: ' + error.message }, { status: 500 });
  }
}

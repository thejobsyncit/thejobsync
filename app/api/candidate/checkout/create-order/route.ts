import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

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

    const { amount, planName } = await req.json();

    if (!amount || !planName) {
      return NextResponse.json({ error: 'Amount and planName are required' }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: (process.env.RAZORPAY_KEY_SECRET || '').trim(),
    });

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}_${candidateId.substring(0, 5)}`,
    };

    const order = await razorpay.orders.create(options);
    
    // Create pending subscription
    await prisma.candidateSubscription.create({
      data: {
        candidateAccountId: candidateId,
        planName,
        amount: Number(amount),
        gstAmount: Number(amount) * 0.18, // 18% GST (assuming amount passed is base)
        totalAmount: Number(amount) * 1.18,
        currency: 'INR',
        razorpayOrderId: order.id,
        status: 'pending',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

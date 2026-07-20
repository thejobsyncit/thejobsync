import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';


import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { amount, planName, candidateId } = await req.json();

    if (!candidateId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

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
    await (prisma as any).candidateSubscription.create({
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
    return NextResponse.json({ error: 'Failed to create order: ' + (error as any).message }, { status: 500 });
  }
}

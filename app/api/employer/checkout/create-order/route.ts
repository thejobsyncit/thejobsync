import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
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

export async function POST(req: NextRequest) {
  try {
    const employerId = await getEmployerId(req);
    if (!employerId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { amount, planName } = await req.json();

    if (!amount || !planName) {
      return NextResponse.json({ error: 'Amount and planName are required' }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}_${employerId.substring(0, 5)}`,
    };

    const order = await razorpay.orders.create(options);

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

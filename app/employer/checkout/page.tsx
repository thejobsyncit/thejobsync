'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Shield, Zap, Lock } from 'lucide-react';
import Script from 'next/script';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planName = searchParams.get('plan') || 'Standard';
  const baseAmount = parseInt(searchParams.get('amount') || '550');
  
  const [loading, setLoading] = useState(false);
  
  const gstAmount = baseAmount * 0.18;
  const totalAmount = baseAmount + gstAmount;

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create order
      const res = await fetch('/api/employer/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, planName })
      });
      
      const order = await res.json();
      
      if (order.error) {
        alert(order.error);
        setLoading(false);
        return;
      }

      // 2. Open Razorpay
      const options = {
        key: order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'The jobsync',
        description: `Payment for ${planName} Plan`,
        order_id: order.orderId,
        handler: async function (response: any) {
          // 3. Verify payment
          try {
            const verifyRes = await fetch('/api/employer/checkout/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                planName,
                amount: baseAmount,
                gstAmount,
                totalAmount
              })
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              // Show success toast and redirect
              alert('Payment Successful! Package activated.');
              router.push('/employer/dashboard');
            } else {
              alert('Payment verification failed: ' + (verifyData.error || 'Unknown error'));
            }
          } catch (e) {
            alert('Error verifying payment.');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#0077B6'
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
      
    } catch (error) {
      alert('Error initiating checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Left Side: Plan Details */}
        <div className="p-8 md:p-10 bg-[#0f172a] text-white">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete your purchase</h1>
            <p className="text-slate-400">You are subscribing to the <strong className="text-white">{planName}</strong> plan.</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{planName}</h3>
                  <p className="text-sm text-slate-300">Unlock premium features</p>
                </div>
              </div>
              
              <ul className="space-y-3 mt-6">
                {[
                  planName.includes('RESDEX') ? 'Advanced candidate search' : 'Job Posting capabilities',
                  'Instant activation',
                  'Dedicated support',
                  'Premium branding'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <Check size={16} className="text-green-400 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Shield size={16} />
              <span>Secure, encrypted checkout</span>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Details */}
        <div className="p-8 md:p-10">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-slate-600">
              <span>{planName}</span>
              <span className="font-medium text-slate-900">₹{baseAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>GST (18%)</span>
              <span className="font-medium text-slate-900">₹{gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-900 text-lg">Total Amount</span>
              <span className="font-bold text-[#0077B6] text-2xl">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-4 bg-[#0077B6] hover:bg-[#005f92] text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={18} />
                  Pay ₹{totalAmount.toLocaleString('en-IN')} securely
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-500">
              By proceeding, you agree to our Terms of Service and Privacy Policy. Payments are processed securely via Razorpay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

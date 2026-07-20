import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Lock } from 'lucide-react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';

export default function ATSPremiumPlansModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const { candidate } = useCandidateAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const plans = [
    {
      name: 'JS Basic Resume',
      price: '₹1',
      rawPrice: 1,
      features: [
        '1 ATS Resume Template',
        'Download as PDF',
        'Valid 30 days'
      ],
      isPopular: false
    },
    {
      name: 'JS Pro Resume',
      price: '₹49',
      rawPrice: 49,
      features: [
        '3 ATS Resume Templates',
        'Dynamic resume builder',
        'Profile subscription',
        'Valid 30 days'
      ],
      isPopular: false
    },
    {
      name: 'JS Company Reference',
      price: '₹495',
      rawPrice: 495,
      features: [
        'Up to 5 no-login company contact details',
        'Matched to your profile description',
        'Valid 30 days'
      ],
      isPopular: false
    },
    {
      name: 'JS Company Assistance',
      price: '₹990',
      rawPrice: 990,
      features: [
        'Up to 10 no-login company contact details',
        'With client details for each company',
        'Assistant for profile matching',
        'Valid 30 days'
      ],
      isPopular: true
    }
  ];

  const handlePayment = async (planName: string, baseAmount: number) => {
    setLoadingPlan(planName);
    try {
      const gstAmount = baseAmount * 0.18;
      const totalAmount = baseAmount + gstAmount;

      // 1. Create order
      const res = await fetch('/api/candidate/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, planName, candidateId: candidate?.id })
      });
      
      const order = await res.json();
      
      if (order.error) {
        alert(order.error);
        setLoadingPlan(null);
        return;
      }

      // 2. Open Razorpay
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: 'INR',
        name: 'The jobsync Candidates',
        description: `Payment for ${planName} Plan`,
        order_id: order.orderId,
        handler: async function (response: any) {
          // 3. Verify payment
          try {
            const verifyRes = await fetch('/api/candidate/checkout/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                candidateId: candidate?.id
              })
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              alert('Payment Successful! Your plan is now active.');
              onClose();
              window.location.reload(); // Reload to refresh profile access
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
      setLoadingPlan(null);
    }
  };

  const modalContent = (
    <AnimatePresence>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{ 
            position: 'relative', background: '#0f172a', borderRadius: 24, 
            width: '100%', maxWidth: 1300, border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <div>
              <div style={{ color: '#00B4D8', fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Job Seekers</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Premium Plans for Candidates</h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Unlock direct company contacts, profile boosts and recruiter assistance.</p>
            </div>
            <button 
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              className="hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Pricing Cards */}
          <div style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', background: '#0f172a' }}>
            {plans.map((plan, idx) => (
              <div 
                key={plan.name} 
                style={{ 
                  background: plan.isPopular ? 'rgba(56,189,248,0.03)' : 'rgba(255,255,255,0.02)', 
                  border: `2px solid ${plan.isPopular ? '#03045E' : 'rgba(255,255,255,0.08)'}`, 
                  borderRadius: 16, padding: '2rem', 
                  display: 'flex', flexDirection: 'column', position: 'relative',
                  transition: 'transform 0.2s, border-color 0.2s'
                }}
                className="hover:-translate-y-1 hover:border-[#0077B6]/50"
              >
                {plan.isPopular && (
                  <div style={{ position: 'absolute', top: -14, right: 20, background: '#0077B6', color: 'white', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    POPULAR
                  </div>
                )}
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>{plan.name}</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0077B6', marginBottom: '0.25rem' }}>{plan.price}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>+ 18% GST at checkout</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem' }}>Valid 30 days</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, marginBottom: '2rem' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#e2e8f0', fontSize: '0.9rem' }}>
                      <Check size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handlePayment(plan.name, plan.rawPrice)}
                  disabled={loadingPlan === plan.name}
                  style={{ 
                    width: '100%', background: '#03045E', color: 'white', border: 'none', 
                    padding: '1rem', borderRadius: 12, fontWeight: 700, fontSize: '1rem', 
                    cursor: loadingPlan === plan.name ? 'wait' : 'pointer', transition: 'background 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    opacity: loadingPlan === plan.name ? 0.7 : 1
                  }}
                  className="hover:bg-blue-800"
                >
                  {loadingPlan === plan.name ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock size={16} /> Get Started
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

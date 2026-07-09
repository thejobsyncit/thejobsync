import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

export default function ATSPremiumPlansModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  const plans = [
    {
      name: 'JS Pro Resume',
      price: '₹1',
      features: [
        'Dynamic resume builder',
        'Profile subscription',
        'Valid 30 days'
      ],
      isPopular: false
    },
    {
      name: 'JS Company Reference',
      price: '₹495',
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
      features: [
        'Up to 10 no-login company contact details',
        'With client details for each company',
        'Assistant for profile matching',
        'Valid 30 days'
      ],
      isPopular: true
    }
  ];

  return (
    <AnimatePresence>
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
            width: '100%', maxWidth: 1000, border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <div>
              <div style={{ color: '#38bdf8', fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Job Seekers</div>
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
          <div style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', background: '#0f172a' }}>
            {plans.map((plan, idx) => (
              <div 
                key={plan.name} 
                style={{ 
                  background: plan.isPopular ? 'rgba(56,189,248,0.03)' : 'rgba(255,255,255,0.02)', 
                  border: `2px solid ${plan.isPopular ? '#1e3a8a' : 'rgba(255,255,255,0.08)'}`, 
                  borderRadius: 16, padding: '2rem', 
                  display: 'flex', flexDirection: 'column', position: 'relative',
                  transition: 'transform 0.2s, border-color 0.2s'
                }}
                className="hover:-translate-y-1 hover:border-sky-500/50"
              >
                {plan.isPopular && (
                  <div style={{ position: 'absolute', top: -14, right: 20, background: '#1e40af', color: 'white', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    POPULAR
                  </div>
                )}
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>{plan.name}</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e40af', marginBottom: '0.25rem' }}>{plan.price}</div>
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
                  onClick={() => alert(`Redirecting to payment gateway for ${plan.name}...`)}
                  style={{ 
                    width: '100%', background: '#1e3a8a', color: 'white', border: 'none', 
                    padding: '1rem', borderRadius: 12, fontWeight: 700, fontSize: '1rem', 
                    cursor: 'pointer', transition: 'background 0.2s' 
                  }}
                  className="hover:bg-blue-800"
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

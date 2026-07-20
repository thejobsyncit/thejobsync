'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Users, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
import CreateSuperAdminModal from '@/components/CreateSuperAdminModal';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isSuperAdminModalOpen, setIsSuperAdminModalOpen] = useState(false);
  const { login, logout, user, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    if (result.success && result.user) {
      const roleMap: Record<string, string> = {
        'super_admin': '/super-admin',
        'admin': '/admin',
        'hr': '/hr',
        'recruiter': '/recruiter',
        'interviewer': '/interviewer',
        'client': '/client-portal',
      };
      const targetPath = roleMap[result.user.role] || '/dashboard';
      router.push(targetPath);
    } else if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Invalid email or password. Try any role email with password: admin123');
      setIsSubmitting(false);
    }
  };

  const demoAccounts = [
    { role: 'Super Admin', email: 'superadmin@crm.com' },
    { role: 'Admin', email: 'admin@crm.com' },
    { role: 'Recruiter', email: 'recruiter@crm.com' },
    { role: 'HR', email: 'hr@crm.com' },
    { role: 'Interviewer', email: 'interviewer@crm.com' },
    { role: 'Placement', email: 'crm@crm.com' },
    { role: 'Client', email: 'client@crm.com' },
  ];

  if (isLoading) {
    return (
      <div className="login-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '4px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }



  return (
    <div className="login-bg">
      {/* Animated floating orbs */}
      <div style={{
        position: 'absolute', width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        borderRadius: '50%', top: '20%', left: '15%',
        animation: 'float 6s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        borderRadius: '50%', bottom: '25%', right: '10%',
        animation: 'float 8s ease-in-out infinite 1s',
      }} />

      <div className="glass animate-scale-in" style={{
        padding: '2.5rem',
        width: '100%',
        maxWidth: 440,
        position: 'relative',
        zIndex: 10,
        margin: '1rem',
      }}>
        {/* Logo / Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <img src="/loooo.jpeg" alt="The jobsync Logo" style={{ height: 56, width: 56, objectFit: 'contain', borderRadius: '50%' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.375rem', letterSpacing: '-0.5px' }}>
            The jobsync
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
            Recruitment Management System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--muted)',
              }} />
              <input
                type="email"
                className="input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--muted)',
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
                  padding: 0, display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setIsSuperAdminModalOpen(true)}
                style={{ 
                  color: 'var(--primary)', fontSize: '0.8125rem', fontWeight: 500,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0
                }}
              >
                Create Super Admin
              </button>
              <button 
                type="button" 
                onClick={() => setIsForgotModalOpen(true)}
                style={{ 
                  color: 'var(--primary)', fontSize: '0.8125rem', fontWeight: 500,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0
                }}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {error && (
            <div className="animate-fade-in" style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 'var(--radius-md)',
              color: '#f87171',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{
              width: '100%',
              height: 44,
              fontSize: '0.9375rem',
              marginBottom: '1.5rem',
            }}
          >
            {isSubmitting ? (
              <div className="spinner" style={{ width: 18, height: 18, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        {/* Demo Accounts */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Demo Accounts (password: admin123)
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', justifyContent: 'center' }}>
            {demoAccounts.map(acc => (
              <button
                key={acc.email}
                type="button"
                onClick={() => { setEmail(acc.email); setPassword('admin123'); setError(''); }}
                style={{
                  padding: '0.25rem 0.625rem',
                  background: 'var(--surface-hover)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--muted-foreground)',
                  fontSize: '0.6875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: 500,
                }}
                onMouseEnter={e => {
                  (e.target as HTMLButtonElement).style.borderColor = 'var(--primary)';
                  (e.target as HTMLButtonElement).style.color = 'var(--primary-hover)';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLButtonElement).style.borderColor = 'var(--border)';
                  (e.target as HTMLButtonElement).style.color = 'var(--muted-foreground)';
                }}
              >
                {acc.role}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <ForgotPasswordModal 
        isOpen={isForgotModalOpen} 
        onClose={() => setIsForgotModalOpen(false)} 
        role="user" 
      />
      <CreateSuperAdminModal
        isOpen={isSuperAdminModalOpen}
        onClose={() => setIsSuperAdminModalOpen(false)}
      />
    </div>
  );
}

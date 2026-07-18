'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEmployerAuth } from '@/context/EmployerAuthContext';
import { Building2, Lock, Mail, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';

import { Suspense } from 'react';

function EmployerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, employer, isLoading } = useEmployerAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const registered = searchParams.get('registered') === '1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    if (result.success) {
      router.push('/employer/dashboard');
    } else {
      setError(result.error || 'Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f44] via-[#0f2d6b] to-[#0a1f44] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 rounded-full opacity-20 -top-20 -left-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.4) 0%, transparent 70%)' }} />
      <div className="absolute w-80 h-80 rounded-full opacity-20 -bottom-10 -right-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/post-job" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 size={24} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-white font-extrabold text-xl leading-none">The jobsync</div>
              <div className="text-sky-300 text-xs font-medium">Company Portal</div>
            </div>
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {registered && (
            <div className="flex items-center gap-3 bg-green-500/20 border border-green-400/30 rounded-xl px-4 py-3 mb-6">
              <CheckCircle size={18} className="text-green-400 shrink-0" />
              <p className="text-green-300 text-sm font-medium">Account created successfully! Please sign in.</p>
            </div>
          )}

          <h1 className="text-2xl font-extrabold text-white mb-1 tracking-tight">Company Login</h1>
          <p className="text-sky-200/70 text-sm mb-7">Sign in to your company dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                placeholder="Work email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-11 pr-11 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex justify-end w-full">
              <button 
                type="button" 
                onClick={() => setIsForgotModalOpen(true)}
                className="text-sky-400 text-sm font-medium hover:text-sky-300 transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                Forgot Password?
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Don't have a company account?{' '}
            <Link href="/post-job" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
        
        <ForgotPasswordModal 
          isOpen={isForgotModalOpen} 
          onClose={() => setIsForgotModalOpen(false)} 
          role="employer" 
        />
        </div>
      </motion.div>
    </div>
  );
}

export default function EmployerLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#0a1f44] via-[#0f2d6b] to-[#0a1f44] flex items-center justify-center text-white">Loading...</div>}>
      <EmployerLoginForm />
    </Suspense>
  );
}

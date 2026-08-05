'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { Zap, Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight, CheckCircle, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export default function CandidateRegisterPage() {
  const router = useRouter();
  const { login } = useCandidateAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);

    try {
      const res = await fetch('/api/candidate-auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return; }

      // Auto login after register
      const loginResult = await login(form.email, form.password);
      if (loginResult.success) {
        setStep(2);
        setTimeout(() => router.push('/careers/profile'), 2000);
      }
    } catch { setError('Something went wrong. Please try again.'); }
    setLoading(false);
  };

  if (step === 2) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-[440px] w-full shadow-xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-lg">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <CheckCircle size={40} className="text-white" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Welcome to The jobsync! 🎉</h2>
        <p className="text-slate-500 dark:text-slate-400">Redirecting to your profile dashboard...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden transition-colors duration-300">
      {/* Theme Toggle Button */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="absolute top-6 right-6 p-2 rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20 shadow-sm"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      )}

      {/* Background Orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full -top-[100px] -left-[100px] pointer-events-none bg-[radial-gradient(circle,rgba(14,165,233,0.1)_0%,rgba(0,0,0,0)_70%)] dark:bg-[radial-gradient(circle,rgba(14,165,233,0.15)_0%,rgba(0,0,0,0)_70%)]" />
      <div className="absolute w-[400px] h-[400px] rounded-full -bottom-[50px] -right-[50px] pointer-events-none bg-[radial-gradient(circle,rgba(99,102,241,0.1)_0%,rgba(0,0,0,0)_70%)] dark:bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,rgba(0,0,0,0)_70%)]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 w-full max-w-[440px] shadow-xl dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-10">
        <Link href="/careers" className="flex items-center gap-2.5 no-underline mb-10">
          <img src="/loooo.jpeg" alt="The jobsync Logo" className="h-9 w-9 object-contain rounded-full border border-slate-200 dark:border-slate-700 bg-white" />
          <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">The Job<span className="text-[#0077B6]">Sync</span></span>
        </Link>

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1.5 tracking-tight">Create an account</h1>
        <p className="text-slate-500 dark:text-slate-400 text-[15px] mb-8">Level up your career with AI job matching.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { icon: <User size={18} />, field: 'name', placeholder: 'Full Name', type: 'text' },
            { icon: <Mail size={18} />, field: 'email', placeholder: 'Email Address', type: 'email' },
            { icon: <Phone size={18} />, field: 'phone', placeholder: 'Mobile Number', type: 'tel' },
          ].map(({ icon, field, placeholder, type }) => (
            <div key={field} className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">{icon}</div>
              <input
                required type={type} placeholder={placeholder}
                value={(form as any)[field]}
                onChange={e => {
                  let val = e.target.value;
                  if (type === 'tel') val = val.replace(/[^0-9+]/g, '');
                  if (field === 'name') val = val.replace(/[^a-zA-Z\s.]/g, '');
                  setForm({ ...form, [field]: val });
                }}
                maxLength={type === 'tel' ? 15 : undefined}
                className="w-full border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white rounded-xl py-3.5 pl-11 pr-4 text-[15px] outline-none transition-colors focus:border-[#0077B6] dark:focus:border-[#0077B6] placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          ))}

          {[
            { field: 'password', placeholder: 'Password (min 6 chars)' },
            { field: 'confirmPassword', placeholder: 'Confirm Password' },
          ].map(({ field, placeholder }) => (
            <div key={field} className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"><Lock size={18} /></div>
              <input
                required type={showPw ? 'text' : 'password'} placeholder={placeholder}
                value={(form as any)[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                className="w-full border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white rounded-xl py-3.5 pl-11 pr-11 text-[15px] outline-none transition-colors focus:border-[#0077B6] dark:focus:border-[#0077B6] placeholder-slate-400 dark:placeholder-slate-500"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          ))}

          {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-3 text-red-600 dark:text-red-400 text-sm font-medium">{error}</div>}

          <button type="submit" disabled={loading} className="mt-2 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white rounded-xl p-3.5 font-bold text-base cursor-pointer flex items-center justify-center gap-2 transition-all hover:shadow-[0_8px_20px_rgba(14,165,233,0.3)] disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? 'Creating Account...' : <><span>Join The jobsync</span><ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 dark:text-slate-400 text-sm font-medium">
          Already have an account? <Link href="/careers/login" className="text-[#03045E] dark:text-[#00B4D8] font-bold hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}

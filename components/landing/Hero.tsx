'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Users, Building2, Briefcase, X } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15 },
  }),
};

const stats = [
  { icon: <Users size={22} />, value: '10,000+', label: 'Active Candidates' },
  { icon: <Building2 size={22} />, value: '500+', label: 'Trusted Companies' },
  { icon: <Briefcase size={22} />, value: '1,200+', label: 'Live Jobs' },
];

export default function Hero() {
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);

  useEffect(() => {
    // Automatically show the popup after a short 1.5s delay for better UX
    const timer = setTimeout(() => {
      setShowRegisterPopup(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#010a18]">
      {/* Animated background mesh */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(0,119,182,0.10)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(0,119,182,0.18)_0%,transparent_70%)]" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,180,216,0.07)_0%,transparent_65%)] dark:bg-[radial-gradient(circle,rgba(0,180,216,0.12)_0%,transparent_65%)] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(202,240,248,0.5)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(3,4,94,0.4)_0%,transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #0077B6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0077B6]/20 to-transparent dark:via-[#0077B6]/30" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">

          {/* Left column */}
          <div className="flex-1 text-center lg:text-left relative z-30">
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-[#0077B6]/40 bg-[#0077B6]/10 text-[#0077B6] dark:text-[#00B4D8] text-xs font-bold tracking-widest uppercase"
            >
              <Sparkles size={13} className="animate-pulse" />
              India's Premium Job Platform
            </motion.div>

            <motion.h1
              variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.08] tracking-tight mb-6"
            >
              Navigate{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#0077B6] via-[#00B4D8] to-[#0077B6] bg-clip-text text-transparent">
                  Your Career
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] rounded-full opacity-70" />
              </span>
              <br />Here.
            </motion.h1>

            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="text-slate-500 dark:text-[#90E0EF]/80 text-lg sm:text-xl font-medium max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              Lakhs of Employers. Millions of Job Seekers. Endless success — only on{' '}
              <button 
                onClick={() => {
                  console.log('gojobsync.com clicked!');
                  setShowRegisterPopup(true);
                }} 
                className="text-[#0077B6] dark:text-[#00B4D8] font-semibold hover:underline relative z-50 cursor-pointer pointer-events-auto"
              >
                gojobsync.com
              </button>
            </motion.div>

            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/careers"
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white overflow-hidden shadow-[0_0_30px_rgba(0,119,182,0.3)] hover:shadow-[0_0_50px_rgba(0,119,182,0.5)] transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#0077B6] to-[#00B4D8]" />
                <span className="absolute inset-0 bg-gradient-to-r from-[#00B4D8] to-[#0077B6] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative">Find Jobs</span>
                <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-[#0077B6] border border-[#0077B6]/50 bg-[#0077B6]/5 hover:bg-[#0077B6]/15 hover:border-[#0077B6]/70 transition-all duration-300"
              >
                <Users size={18} />
                Post a Job
              </Link>
            </motion.div>
          </div>

          {/* Right column – floating image */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="flex-1 w-full max-w-lg"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#0077B6]/20 to-[#00B4D8]/10 blur-2xl" />
              <div className="relative rounded-[2rem] overflow-hidden border border-[#0077B6]/20 shadow-[0_32px_80px_rgba(0,0,0,0.15)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80"
                  alt="Professionals at work"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#010a18]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/80 dark:bg-[#010a18]/80 backdrop-blur-xl border border-[#0077B6]/20 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center flex-shrink-0">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-bold text-sm">New Jobs Added Daily</p>
                    <p className="text-slate-500 dark:text-[#90E0EF] text-xs font-medium">50+ fresh openings every 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={5}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#0077B6]/15 dark:divide-[#0077B6]/20 bg-white/70 dark:bg-[#03045E]/30 backdrop-blur-xl border border-[#0077B6]/15 dark:border-[#0077B6]/20 rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,119,182,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
        >
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-center justify-center gap-4 px-8 py-8 group hover:bg-[#0077B6]/5 dark:hover:bg-[#0077B6]/10 transition-colors duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#0077B6]/10 border border-[#0077B6]/20 flex items-center justify-center text-[#0077B6] dark:text-[#00B4D8] group-hover:scale-110 transition-transform duration-300">
                {s.icon}
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-black text-slate-900 dark:text-white leading-none">{s.value}</div>
                <div className="text-slate-500 dark:text-[#90E0EF]/70 text-sm font-semibold mt-1 tracking-wide">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

    </section>

      {/* Registration Popup Modal */}
      <AnimatePresence>
        {showRegisterPopup && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" style={{ position: 'fixed' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowRegisterPopup(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#010a18] rounded-3xl p-8 shadow-2xl border border-[#0077B6]/20 overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#0077B6]/20 to-[#00B4D8]/20 blur-2xl rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-[#00B4D8]/20 to-[#0077B6]/20 blur-2xl rounded-full" />
              
              <button 
                onClick={() => setShowRegisterPopup(false)}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center shadow-lg shadow-[#0077B6]/30">
                    <Sparkles className="text-white w-8 h-8" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 text-center tracking-tight">Join GoJobSync!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-center mb-8 font-medium">Take the next step in your career journey. Register now.</p>
                
                <div className="flex flex-col gap-4">
                  <Link 
                    href="/careers/register" 
                    onClick={() => setShowRegisterPopup(false)}
                    className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-[#0077B6]/30 transition-all hover:-translate-y-0.5"
                  >
                    <Briefcase size={22} />
                    Register as Job Seeker
                  </Link>
                  
                  <Link 
                    href="/employer/register" 
                    onClick={() => setShowRegisterPopup(false)}
                    className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-white dark:bg-white/5 border-2 border-[#0077B6]/30 text-[#0077B6] dark:text-[#00B4D8] rounded-2xl font-bold text-lg hover:bg-[#0077B6]/5 dark:hover:bg-white/10 transition-all hover:-translate-y-0.5"
                  >
                    <Building2 size={22} />
                    Register as Company
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

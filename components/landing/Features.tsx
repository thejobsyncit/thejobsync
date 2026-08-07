'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Search, TrendingUp, Shield, Layers } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: "easeOut" },
  }),
};

const jobSeekerFeatures = [
  { icon: <Search size={18} />, text: 'Explore thousands of curated opportunities' },
  { icon: <TrendingUp size={18} />, text: 'Track your application status in real-time' },
  { icon: <Shield size={18} />, text: 'Privacy controls to manage who sees your profile' },
  { icon: <Layers size={18} />, text: 'One-click apply with a smart digital resume' },
];

export default function Features() {
  return (
    <section className="relative py-28 bg-white dark:bg-[#010a18] overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,119,182,0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(0,119,182,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0077B6]/15 dark:via-[#0077B6]/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* For Job Seekers */}
        <div className="mb-24">
          <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center text-xs font-bold tracking-[0.25em] uppercase text-[#0077B6] mb-4">For Job Seekers</motion.p>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" custom={1} viewport={{ once: true }}
            className="text-center text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight max-w-3xl mx-auto">
            Your Career,{' '}
            <span className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] bg-clip-text text-transparent">Supercharged</span>
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="show" custom={2} viewport={{ once: true }}
            className="text-center text-slate-500 dark:text-[#90E0EF]/70 text-lg font-medium max-w-2xl mx-auto mb-14">
            We provide a centralized space to explore opportunities, apply with ease, and navigate your career journey. With thousands of applications submitted daily, GoJobSync empowers you to connect with employers who value your talent.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {jobSeekerFeatures.map((f, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" custom={i + 3} viewport={{ once: true }}
                className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-[#0077B6]/15 bg-slate-50 dark:bg-[#03045E]/20 hover:border-[#0077B6]/30 dark:hover:border-[#0077B6]/30 hover:bg-blue-50 dark:hover:bg-[#03045E]/40 transition-all duration-300 group">
                <div className="w-9 h-9 rounded-xl bg-[#0077B6]/10 border border-[#0077B6]/15 flex items-center justify-center text-[#0077B6] dark:text-[#00B4D8] flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <span className="text-slate-600 dark:text-[#90E0EF]/80 text-sm font-semibold leading-tight">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* For Employers */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-full lg:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#0077B6]/15 to-transparent blur-2xl" />
              <div className="relative rounded-[2rem] overflow-hidden border border-[#0077B6]/20 shadow-[0_32px_80px_rgba(0,119,182,0.08)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
                <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=900&q=80"
                  alt="Employer Platform" className="w-full h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 dark:from-[#010a18]/60 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>

          <div className="w-full lg:w-1/2">
            <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="text-xs font-bold tracking-[0.25em] uppercase text-[#0077B6] mb-4">For Employers</motion.p>
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" custom={1} viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
              Hire Smarter,{' '}
              <span className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] bg-clip-text text-transparent">Faster</span>
            </motion.h2>
            <motion.p variants={fadeUp} initial="hidden" whileInView="show" custom={2} viewport={{ once: true }}
              className="text-slate-500 dark:text-[#90E0EF]/70 text-[16px] leading-relaxed font-medium mb-8">
              GoJobSync enables organizations to connect with top talent effortlessly, managing the entire recruitment lifecycle — from job posting to placement, and rebuttals — all within one seamless, intelligent platform.
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" custom={3} viewport={{ once: true }}>
              <Link href="/pricing"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white text-sm relative overflow-hidden shadow-[0_0_24px_rgba(0,119,182,0.3)] hover:shadow-[0_0_40px_rgba(0,119,182,0.5)] transition-all duration-300">
                <span className="absolute inset-0 bg-gradient-to-r from-[#0077B6] to-[#00B4D8]" />
                <span className="absolute inset-0 bg-gradient-to-r from-[#00B4D8] to-[#0077B6] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative">Explore Employer Plans</span>
                <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';
import { motion } from 'framer-motion';
import { Zap, Globe, Award } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: "easeOut" },
  }),
};

const pillars = [
  { icon: <Zap size={24} />, title: 'AI-Enhanced Matching', text: 'Advanced technology that connects the right talent with the right role — intelligently and instantly.' },
  { icon: <Globe size={24} />, title: 'Global Reach', text: 'From UAE to India and beyond — your career opportunities are not limited by geography.' },
  { icon: <Award size={24} />, title: 'Trusted Ecosystem', text: 'End-to-end recruitment lifecycle management with full transparency at every stage.' },
];

export default function AboutUs() {
  return (
    <section className="relative py-28 bg-white dark:bg-[#010a18] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-[radial-gradient(ellipse,rgba(0,119,182,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse,rgba(0,119,182,0.10)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center text-xs font-bold tracking-[0.25em] uppercase text-[#0077B6] mb-4">
          About GoJobSync
        </motion.p>
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" custom={1} viewport={{ once: true }}
          className="text-center text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight max-w-3xl mx-auto">
          Redefining the Future{' '}
          <span className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] bg-clip-text text-transparent">of Recruitment</span>
        </motion.h2>
        <motion.p variants={fadeUp} initial="hidden" whileInView="show" custom={2} viewport={{ once: true }}
          className="text-center text-slate-500 dark:text-[#90E0EF]/70 text-lg font-medium max-w-2xl mx-auto mb-20 leading-relaxed">
          We digitize and streamline the entire hiring lifecycle, delivering a seamless, data-driven experience that empowers both employers and job seekers.
        </motion.p>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* Left – image */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }} className="w-full lg:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#0077B6]/15 to-transparent blur-2xl" />
              <div className="relative rounded-[2rem] overflow-hidden border border-[#0077B6]/20 shadow-[0_32px_80px_rgba(0,119,182,0.08)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80"
                  alt="Recruitment Platform" className="w-full h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 dark:from-[#010a18]/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-[#010a18]/90 backdrop-blur-xl border border-[#0077B6]/20 rounded-2xl px-6 py-4 shadow-xl">
                <p className="text-3xl font-black text-slate-900 dark:text-white">2025</p>
                <p className="text-slate-500 dark:text-[#90E0EF] text-xs font-semibold mt-0.5">Founded in UAE</p>
              </div>
            </div>
          </motion.div>

          {/* Right – text */}
          <div className="w-full lg:w-1/2 space-y-8">
            <motion.p variants={fadeUp} initial="hidden" whileInView="show" custom={0} viewport={{ once: true }}
              className="text-slate-600 dark:text-[#90E0EF]/80 text-[16px] leading-relaxed font-medium">
              "The gojobsync.com" started its humble beginnings in 2025 in the United Arab Emirates — a modern venture built to be the trusted bridge between ambition and opportunity. We set out with a clear mission: to empower job seekers and employers to create success stories, every day, across the globe.
            </motion.p>
            <motion.p variants={fadeUp} initial="hidden" whileInView="show" custom={1} viewport={{ once: true }}
              className="text-slate-600 dark:text-[#90E0EF]/80 text-[16px] leading-relaxed font-medium">
              Our global job portal offers access to the best career opportunities free of charge — providing a comprehensive solution that matches skills with the right roles.
            </motion.p>
            <div className="space-y-4 pt-2">
              {pillars.map((p, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" custom={i + 2} viewport={{ once: true }}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 dark:border-[#0077B6]/15 bg-slate-50 dark:bg-[#03045E]/20 hover:border-[#0077B6]/40 dark:hover:border-[#0077B6]/30 hover:bg-blue-50 dark:hover:bg-[#03045E]/40 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-[#0077B6]/10 border border-[#0077B6]/20 flex items-center justify-center text-[#0077B6] dark:text-[#00B4D8] flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {p.icon}
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold mb-1">{p.title}</h4>
                    <p className="text-slate-500 dark:text-[#90E0EF]/60 text-sm leading-relaxed">{p.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

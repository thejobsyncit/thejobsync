'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ClipboardList, Database, UserPlus, Check, ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12 },
  }),
};

const services = [
  {
    title: 'Job Posting', icon: <ClipboardList size={28} />, accent: 'from-orange-500 to-amber-400',
    features: ['Post a job and receive relevant applications', 'Attract qualified candidates actively seeking new opportunities', 'Customize postings to match your hiring requirements'],
    link: '/pricing#job_posting',
  },
  {
    title: 'RESDEX – Resume Database', icon: <Database size={28} />, accent: 'from-[#0077B6] to-[#00B4D8]', badge: 'POPULAR',
    features: ['Search our extensive resume database', 'Discover talent across every city in India', 'Filter candidates by location, skills, experience, and more'],
    link: '/pricing#resume_access',
  },
  {
    title: 'Assisted Hiring', icon: <UserPlus size={28} />, accent: 'from-purple-500 to-violet-400', badge: 'NEW',
    features: ['Get a dedicated hiring expert to support you', 'Experts assess your needs and identify right candidates', 'We screen, shortlist, and share resumes directly with you'],
    link: '/pricing',
  },
];

export default function Services() {
  return (
    <section className="relative py-28 bg-slate-50 dark:bg-[#010a18] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(0,119,182,0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse,rgba(0,119,182,0.08)_0%,transparent_70%)]" />
      </div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0077B6]/20 dark:via-[#0077B6]/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-xs font-bold tracking-[0.25em] uppercase text-[#0077B6] mb-4">Our Services</motion.p>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" custom={1} viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-5 leading-tight tracking-tight">
            Three Ways to{' '}
            <span className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] bg-clip-text text-transparent">Hire Smarter</span>
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="show" custom={2} viewport={{ once: true }}
            className="text-slate-500 dark:text-[#90E0EF]/70 font-medium text-lg">
            From single job postings to full-service hiring assistance — pick the path that fits how your team grows.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <motion.div key={idx} variants={fadeUp} initial="hidden" whileInView="show" custom={idx} viewport={{ once: true }}
              className="relative flex flex-col group">
              <div className={`absolute -inset-px rounded-[1.5rem] bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-15 blur transition-opacity duration-500`} />
              <div className="relative flex flex-col flex-1 rounded-[1.5rem] bg-white dark:bg-[#03045E]/25 border border-slate-200 dark:border-[#0077B6]/15 group-hover:border-[#0077B6]/30 dark:group-hover:border-[#0077B6]/40 backdrop-blur-sm p-8 transition-all duration-400 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.accent} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{service.title}</h3>
                  {service.badge && (
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full bg-gradient-to-r ${service.accent} text-white tracking-widest`}>
                      {service.badge}
                    </span>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={11} className="text-green-600 dark:text-green-400" strokeWidth={3} />
                      </div>
                      <span className="text-slate-500 dark:text-[#90E0EF]/70 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={service.link}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${service.accent} hover:opacity-90 hover:scale-[1.02] transition-all duration-300 shadow-md`}>
                  View Plans <ArrowRight size={15} strokeWidth={2.5} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

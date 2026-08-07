'use client';
import { Home, Plus, Minus, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = ['General', 'Job Seekers', 'Employers', 'Account & Security', 'Technical'];

const faqsData: Record<string, {question: string, answer: string}[]> = {
  'General': [
    { question: "What is The jobsync?", answer: "The jobsync is a comprehensive global recruitment platform that connects job seekers with top employers across India and beyond." },
    { question: "What is the main goal of The jobsync?", answer: "Our main goal is to be the trusted bridge between ambition and opportunity — empowering job seekers and employers to create success stories every day." },
    { question: "Is The jobsync free to use?", answer: "Yes, basic job seeking features are free to use. Employers can explore premium plans for advanced hiring tools." },
  ],
  'Job Seekers': [
    { question: "How do I create a profile?", answer: "To create a profile, click on Register and follow the steps to complete your resume and professional details." },
    { question: "Can I hide my profile from current employers?", answer: "Yes, you can manage your privacy settings in your dashboard to hide your profile from specific companies." },
  ],
  'Employers': [
    { question: "How can my company post jobs on The jobsync?", answer: "You can post jobs by navigating to the Job Posting section under Employers and selecting a plan that fits your needs." },
    { question: "Can employers search for candidates directly?", answer: "Yes, our RESDEX database allows direct candidate search based on skills, location, and experience." },
  ],
  'Account & Security': [
    { question: "I forgot my password. How do I reset it?", answer: "Click on 'Forgot Password' on the login page and enter your email to receive a reset link." },
    { question: "What is my Registration Number (JS-XXXXXX)?", answer: "Your registration number is a unique identifier found in your profile settings, used for tracking applications." },
  ],
  'Technical': [
    { question: "Which browsers does The jobsync support?", answer: "We support all modern browsers including Chrome, Safari, Edge, and Firefox." },
    { question: "What file formats are accepted for resume upload?", answer: "You can upload resumes in PDF, DOCX, or DOC formats up to 5MB." },
  ]
};

export default function FAQ() {
  const [activeTab, setActiveTab] = useState('General');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const currentFaqs = faqsData[activeTab] || [];

  return (
    <section id="faq" className="relative py-28 bg-slate-50 dark:bg-[#010a18] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0077B6]/20 dark:via-[#0077B6]/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(202,240,248,0.5)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(3,4,94,0.4)_0%,transparent_70%)] -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 dark:text-[#90E0EF]/50 mb-12">
          <Link href="/" className="flex items-center gap-1 hover:text-[#0077B6] transition-colors">
            <Home size={14} /><span>Home</span>
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-600 dark:text-[#90E0EF]/80">FAQs</span>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-xs font-bold tracking-[0.25em] uppercase text-[#0077B6] mb-4">FAQ</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-5 leading-tight tracking-tight">
          How Can We{' '}
          <span className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] bg-clip-text text-transparent">Help You?</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} viewport={{ once: true }}
          className="text-slate-500 dark:text-[#90E0EF]/70 font-medium max-w-2xl mb-14 text-lg leading-relaxed">
          Find answers to the most common questions. Can't find what you're looking for? Contact our support team.
        </motion.p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-12">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setOpenFaq(null); }}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white shadow-[0_0_20px_rgba(0,119,182,0.3)]'
                  : 'border border-slate-300 dark:border-[#0077B6]/25 text-slate-500 dark:text-[#90E0EF]/60 hover:border-[#0077B6]/50 hover:text-[#0077B6] dark:hover:text-white bg-white dark:bg-[#03045E]/20'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-3 min-h-[300px]">
          {currentFaqs.map((faq, idx) => (
            <motion.div key={`${activeTab}-${idx}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="border border-slate-200 dark:border-[#0077B6]/15 rounded-2xl bg-white dark:bg-[#03045E]/20 hover:border-[#0077B6]/30 dark:hover:border-[#0077B6]/30 transition-all duration-300 overflow-hidden shadow-sm dark:shadow-none">
              <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-5 text-left">
                <span className="text-slate-900 dark:text-white font-bold pr-4">{faq.question}</span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  openFaq === idx ? 'border-[#0077B6] text-[#0077B6] dark:text-[#00B4D8] bg-[#0077B6]/10' : 'border-slate-300 dark:border-[#0077B6]/30 text-slate-400 dark:text-[#90E0EF]/50'
                }`}>
                  {openFaq === idx ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="px-6 pb-5 text-slate-500 dark:text-[#90E0EF]/70 font-medium leading-relaxed border-t border-slate-100 dark:border-[#0077B6]/10 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative mt-16 rounded-[2rem] overflow-hidden p-10 md:p-16 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] dark:from-[#03045E] dark:via-[#0077B6]/40 dark:to-[#010a18]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(0,180,216,0.15)_0%,transparent_70%)]" />
          <div className="relative">
            <h3 className="text-3xl font-black text-white mb-4">Still have questions?</h3>
            <p className="text-white/80 font-medium mb-8 max-w-lg mx-auto">
              Can't find the answer you're looking for? Our support team is happy to help you directly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-[#0077B6] bg-white hover:bg-slate-50 transition-all duration-300 shadow-lg">
                Contact Support
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white border border-white/40 hover:bg-white/10 transition-all duration-300">
                Create Free Account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Plus, Minus, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const tabs = ['General', 'Job Seekers', 'Employers', 'Account & Security', 'Technical'];

const faqsData: Record<string, {question: string, answer: string}[]> = {
  'General': [
    { question: "What is GOJOBSYNC?", answer: "GOJOBSYNC is a comprehensive global recruitment platform..." },
    { question: "What is the main goal of GOJOBSYNC?", answer: "Our main goal is to be the trusted bridge between ambition and opportunity..." },
    { question: "Is GOJOBSYNC free to use?", answer: "Yes, basic job seeking features are free to use..." },
  ],
  'Job Seekers': [
    { question: "How do I create a profile?", answer: "To create a profile, click on Register and follow the steps to complete your resume." },
    { question: "Can I hide my profile from current employers?", answer: "Yes, you can manage your privacy settings in your dashboard to hide your profile from specific companies." },
  ],
  'Employers': [
    { question: "How can my company post jobs on GOJOBSYNC?", answer: "You can post jobs by navigating to the Job Posting section under Employers and selecting a plan." },
    { question: "Can employers search for candidates directly?", answer: "Yes, our RESDEX database allows direct candidate search based on skills, location, and experience." },
  ],
  'Account & Security': [
    { question: "I forgot my password. How do I reset it?", answer: "Click on 'Forgot Password' on the login page and enter your email to receive a reset link." },
    { question: "What is my Registration Number (JS-XXXXXX)?", answer: "Your registration number is a unique identifier found in your profile settings, used for tracking applications." },
  ],
  'Technical': [
    { question: "Which browsers does GOJOBSYNC support?", answer: "We support all modern browsers including Chrome, Safari, Edge, and Firefox." },
    { question: "What file formats are accepted for resume upload?", answer: "You can upload resumes in PDF, DOCX, or DOC formats up to 5MB." },
  ]
};

export default function FAQ() {
  const [activeTab, setActiveTab] = useState('General');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentFaqs = faqsData[activeTab] || [];

  return (
    <section className="bg-white">
      {/* Header Banner */}
      <div className="bg-[#0a1f44] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Frequently Asked Questions</h1>
            <p className="text-gray-300 font-medium">Everything you need to know about GOJOBSYNC</p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium">
            <Link href="/" className="flex items-center gap-1 hover:text-white text-gray-300 transition-colors">
              <Home size={16} />
              <span>Home</span>
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-300">FAQs</span>
          </div>
        </div>
      </div>

      {/* Main FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-extrabold text-[#0a1f44] mb-4"
        >
          How Can We Help You?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 font-medium max-w-2xl mx-auto mb-12"
        >
          Find answers to the most common questions about GOJOBSYNC. Can't find what you're looking for? Contact our support team.
        </motion.p>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setOpenFaq(null);
              }}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                activeTab === tab 
                  ? 'bg-[#1e3a8a] text-white shadow-lg' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1e3a8a] hover:text-[#1e3a8a]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Title */}
        <h3 className="text-[#1e3a8a] font-bold text-sm tracking-widest uppercase mb-8">
          {activeTab}
        </h3>

        {/* Accordion */}
        <div className="space-y-4 text-left min-h-[300px]">
          {currentFaqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-[#0a1f44] font-bold"
              >
                <span>{faq.question}</span>
                <span className="text-gray-400 bg-gray-50 rounded-full p-1">
                  {openFaq === idx ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 text-gray-600 font-medium"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-[#0a1f44] rounded-[40px] p-12 md:p-20 text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">Still have questions?</h2>
          <p className="text-blue-200 font-medium mb-10 max-w-xl mx-auto">
            Can't find the answer you're looking for? Our support team is happy to help you directly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/contact" className="w-full sm:w-auto bg-white text-[#0a1f44] px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
              Contact Support
            </Link>
            <Link href="/register" className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-colors text-center">
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Footer from '@/components/landing/Footer';

export default function PricingPage() {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  const getPrice = (inr: string, usd: string) => currency === 'INR' ? inr : usd;

  const jobPostingPlansRow1 = [
    {
      title: 'Hot Vacancy',
      popular: true,
      price: { inr: '₹1,350', usd: '$16' },
      features: [
        'Detailed job description',
        '3 job locations',
        'Contact details included',
        'SEO boost & branding'
      ]
    },
    {
      title: 'Classified',
      popular: false,
      price: { inr: '₹850', usd: '$10' },
      features: [
        'Up to 250 character description',
        '3 job locations',
        'Contact details included'
      ]
    },
    {
      title: 'Standard',
      popular: false,
      price: { inr: '₹550', usd: '$7' },
      features: [
        'Up to 250 character description',
        '1 job location',
        'Contact details included'
      ]
    }
  ];

  const jobPostingPlansRow2 = [
    {
      title: 'Single Post',
      popular: false,
      price: { inr: '₹550', usd: '$7' },
      features: [
        '1 job posting',
        'Standard listing',
        'Valid 30 days'
      ]
    },
    {
      title: '3-Job Pack',
      popular: false,
      price: { inr: '₹850', usd: '$10' },
      features: [
        '3 job postings',
        'Standard listing',
        'Valid 30 days'
      ]
    },
    {
      title: '5-Job Pack',
      popular: false,
      price: { inr: '₹1,350', usd: '$16' },
      features: [
        '5 job postings',
        'Standard listing',
        'Valid 30 days'
      ]
    }
  ];

  const candidatePlans = [
    {
      title: 'JS Pro Resume',
      popular: false,
      price: { inr: '₹1', usd: '$1' },
      features: [
        'Dynamic resume builder',
        'Profile subscription',
        'Valid 30 days'
      ]
    },
    {
      title: 'JS Company Reference',
      popular: false,
      price: { inr: '₹495', usd: '$6' },
      features: [
        'Up to 5 no-login company contact details',
        'Matched to your profile description',
        'Valid 30 days'
      ]
    },
    {
      title: 'JS Company Assistance',
      popular: true,
      price: { inr: '₹990', usd: '$12' },
      features: [
        'Up to 10 no-login company contact details',
        'With client details for each company',
        'Assistant for profile matching',
        'Valid 30 days'
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] font-sans overflow-x-hidden">
      {/* Simple Navbar */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 bg-[#1e3a8a] rounded-lg rotate-45 flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm -rotate-45"></div>
          </div>
          <span className="font-extrabold text-xl text-[#0a1f44] tracking-tight ml-2">GO<br/>JOBSYNC</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      {/* Dark Blue Banner - Currency Toggle */}
      <div className="bg-[#1e3a8a] py-8 text-white flex justify-center items-center gap-4">
        <span className="font-medium text-blue-200">featured listings.</span>
        <div className="bg-white/10 rounded-lg p-1 flex">
          <button 
            onClick={() => setCurrency('USD')}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${currency === 'USD' ? 'bg-white text-[#1e3a8a] shadow-sm' : 'text-white hover:bg-white/20'}`}
          >
            USD
          </button>
          <button 
            onClick={() => setCurrency('INR')}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${currency === 'INR' ? 'bg-white text-[#1e3a8a] shadow-sm' : 'text-white hover:bg-white/20'}`}
          >
            INR (₹)
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8 relative z-10 space-y-16">
        
        {/* Job Posting Section */}
        <section id="job_posting" className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="mb-12">
            <h3 className="text-[#1e3a8a] font-bold text-sm tracking-widest uppercase mb-4">Employers</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a1f44] mb-4">Job Posting</h2>
            <p className="text-gray-500 font-medium">Post a job and receive relevant applications. Choose featured visibility or simple pay-per-post.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {jobPostingPlansRow1.map((plan, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative bg-[#f8fafc] rounded-2xl p-8 flex flex-col ${plan.popular ? 'border-2 border-[#1e3a8a] shadow-lg' : 'border border-gray-200'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1e3a8a] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Popular
                  </div>
                )}
                <h4 className="text-xl font-bold text-[#0a1f44] mb-4">{plan.title}</h4>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-[#1e3a8a]">{getPrice(plan.price.inr, plan.price.usd)}</span>
                  <p className="text-gray-400 text-xs mt-2">+ 18% GST at checkout<br/>Valid 30 days</p>
                </div>
                
                <ul className="space-y-4 flex-1 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} strokeWidth={3} />
                      <span className="text-gray-600 text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-lg font-bold transition-colors ${plan.popular ? 'bg-[#1e3a8a] text-white hover:bg-[#172554]' : 'bg-white border border-[#1e3a8a] text-[#1e3a8a] hover:bg-gray-50'}`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {jobPostingPlansRow2.map((plan, idx) => (
              <motion.div 
                key={`row2-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative bg-[#f8fafc] rounded-2xl p-8 flex flex-col ${plan.popular ? 'border-2 border-[#1e3a8a] shadow-lg' : 'border border-gray-200'}`}
              >
                <h4 className="text-xl font-bold text-[#0a1f44] mb-4">{plan.title}</h4>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-[#1e3a8a]">{getPrice(plan.price.inr, plan.price.usd)}</span>
                  <p className="text-gray-400 text-xs mt-2">+ 18% GST at checkout<br/>Valid 30 days</p>
                </div>
                
                <ul className="space-y-4 flex-1 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} strokeWidth={3} />
                      <span className="text-gray-600 text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-lg font-bold transition-colors ${plan.popular ? 'bg-[#1e3a8a] text-white hover:bg-[#172554]' : 'bg-white border border-[#1e3a8a] text-[#1e3a8a] hover:bg-gray-50'}`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Resume Database Section */}
        <section id="resume_access" className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="mb-12">
            <h3 className="text-[#1e3a8a] font-bold text-sm tracking-widest uppercase mb-4">Employers</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a1f44] mb-4">RESDEX \u2013 Resume Database</h2>
            <p className="text-gray-500 font-medium">Search GOJOBSYNC's extensive database. Filter by location, skills and experience.</p>
          </div>

          <div className="max-w-md">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-[#f8fafc] rounded-2xl p-8 flex flex-col border-2 border-[#1e3a8a] shadow-lg"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1e3a8a] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Popular
              </div>
              <h4 className="text-xl font-bold text-[#0a1f44] mb-4">RESDEX Basic</h4>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-[#1e3a8a]">{getPrice('₹2,999', '$36')}</span>
                <p className="text-gray-400 text-xs mt-2">+ 18% GST at checkout<br/>Valid 15 days</p>
              </div>
              
              <ul className="space-y-4 flex-1 mb-8">
                {[
                  '100 CV views per requirement',
                  'Up to 500 search results',
                  'Candidates active in last 6 months',
                  '10+ advanced filters',
                  'Single user access',
                  'Hiring expert assistance included'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} strokeWidth={3} />
                    <span className="text-gray-600 text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full py-3 rounded-lg font-bold transition-colors bg-[#1e3a8a] text-white hover:bg-[#172554]">
                Get Started
              </button>
            </motion.div>
          </div>
        </section>

        {/* Premium Plans for Candidates Section */}
        <section id="candidate_plans" className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="mb-12">
            <h3 className="text-[#1e3a8a] font-bold text-sm tracking-widest uppercase mb-4">Job Seekers</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a1f44] mb-4">Premium Plans for Candidates</h2>
            <p className="text-gray-500 font-medium">Unlock direct company contacts, profile boosts and recruiter assistance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {candidatePlans.map((plan, idx) => (
              <motion.div 
                key={`candidate-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative bg-[#f8fafc] rounded-2xl p-8 flex flex-col ${plan.popular ? 'border-2 border-[#1e3a8a] shadow-lg' : 'border border-gray-200'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-8 bg-[#1e3a8a] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Popular
                  </div>
                )}
                <h4 className="text-xl font-bold text-[#0a1f44] mb-4">{plan.title}</h4>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-[#1e3a8a]">{getPrice(plan.price.inr, plan.price.usd)}</span>
                  <p className="text-gray-400 text-xs mt-2">+ 18% GST at checkout<br/>Valid 30 days</p>
                </div>
                
                <ul className="space-y-4 flex-1 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} strokeWidth={3} />
                      <span className="text-gray-600 text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-lg font-bold transition-colors ${plan.popular ? 'bg-[#1e3a8a] text-white hover:bg-[#172554]' : 'bg-white border border-[#1e3a8a] text-[#1e3a8a] hover:bg-gray-50'}`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </section>
        
      </div>
      <Footer />
    </main>
  );
}

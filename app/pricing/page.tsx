'use client';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { useState } from 'react';
import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';

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
      price: { inr: '₹99', usd: '$99' },
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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans overflow-x-hidden transition-colors duration-300">
      <Navbar />

      <div className="pt-20">
        {/* Dark Blue Banner - Currency Toggle */}
        <div className="bg-[#03045E] dark:bg-slate-950 py-8 text-white flex justify-center items-center gap-4 transition-colors duration-300 border-b border-[#00B4D8]/20">
          <span className="font-medium text-blue-200">featured listings.</span>
          <div className="bg-white/10 rounded-lg p-1 flex">
            <button 
              onClick={() => setCurrency('USD')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${currency === 'USD' ? 'bg-white text-[#03045E] shadow-sm' : 'text-white hover:bg-white/20'}`}
            >
              USD
            </button>
            <button 
              onClick={() => setCurrency('INR')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${currency === 'INR' ? 'bg-white text-[#03045E] shadow-sm' : 'text-white hover:bg-white/20'}`}
            >
              INR (₹)
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8 relative z-10 space-y-16">
          
          {/* Job Posting Section */}
          <section id="job_posting" className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-white/10 transition-colors duration-300">
            <div className="mb-12">
              <h3 className="text-[#0077B6] dark:text-[#00B4D8] font-bold text-sm tracking-widest uppercase mb-4 transition-colors duration-300">Employers</h3>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 transition-colors duration-300">Job Posting</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">Post a job and receive relevant applications. Choose featured visibility or simple pay-per-post.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {jobPostingPlansRow1.map((plan, idx) => (
                <div 
                  key={idx}
                  className={`relative bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 flex flex-col transition-colors duration-300 ${plan.popular ? 'border-2 border-[#0077B6] dark:border-[#00B4D8] shadow-lg' : 'border border-gray-200 dark:border-slate-700'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0077B6] dark:bg-[#00B4D8] text-white dark:text-slate-900 text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider transition-colors duration-300">
                      Popular
                    </div>
                  )}
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">{plan.title}</h4>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-[#0077B6] dark:text-[#00B4D8] transition-colors duration-300">{getPrice(plan.price.inr, plan.price.usd)}</span>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 transition-colors duration-300">+ 18% GST at checkout<br/>Valid 30 days</p>
                  </div>
                  
                  <ul className="space-y-4 flex-1 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} strokeWidth={3} />
                        <span className="text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 rounded-lg font-bold transition-colors ${plan.popular ? 'bg-[#0077B6] dark:bg-[#00B4D8] text-white dark:text-slate-900 hover:bg-[#023E8A] dark:hover:bg-[#90E0EF]' : 'bg-transparent border border-[#0077B6] dark:border-[#00B4D8] text-[#0077B6] dark:text-[#00B4D8] hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {jobPostingPlansRow2.map((plan, idx) => (
                <div 
                  key={`row2-${idx}`}
                  className={`relative bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 flex flex-col transition-colors duration-300 ${plan.popular ? 'border-2 border-[#0077B6] dark:border-[#00B4D8] shadow-lg' : 'border border-gray-200 dark:border-slate-700'}`}
                >
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">{plan.title}</h4>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-[#0077B6] dark:text-[#00B4D8] transition-colors duration-300">{getPrice(plan.price.inr, plan.price.usd)}</span>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 transition-colors duration-300">+ 18% GST at checkout<br/>Valid 30 days</p>
                  </div>
                  
                  <ul className="space-y-4 flex-1 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} strokeWidth={3} />
                        <span className="text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 rounded-lg font-bold transition-colors ${plan.popular ? 'bg-[#0077B6] dark:bg-[#00B4D8] text-white dark:text-slate-900 hover:bg-[#023E8A] dark:hover:bg-[#90E0EF]' : 'bg-transparent border border-[#0077B6] dark:border-[#00B4D8] text-[#0077B6] dark:text-[#00B4D8] hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Resume Database Section */}
          <section id="resume_access" className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-white/10 transition-colors duration-300">
            <div className="mb-12">
              <h3 className="text-[#0077B6] dark:text-[#00B4D8] font-bold text-sm tracking-widest uppercase mb-4 transition-colors duration-300">Employers</h3>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 transition-colors duration-300">RESDEX \u2013 Resume Database</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">Search THEJOBSYNC's extensive database. Filter by location, skills and experience.</p>
            </div>

            <div className="max-w-md">
              <div 
                className="relative bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 flex flex-col border-2 border-[#0077B6] dark:border-[#00B4D8] shadow-lg transition-colors duration-300"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0077B6] dark:bg-[#00B4D8] text-white dark:text-slate-900 text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider transition-colors duration-300">
                  Popular
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">RESDEX Basic</h4>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-[#0077B6] dark:text-[#00B4D8] transition-colors duration-300">{getPrice('₹2,999', '$36')}</span>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 transition-colors duration-300">+ 18% GST at checkout<br/>Valid 15 days</p>
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
                      <span className="text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors duration-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full py-3 rounded-lg font-bold transition-colors bg-[#0077B6] dark:bg-[#00B4D8] text-white dark:text-slate-900 hover:bg-[#023E8A] dark:hover:bg-[#90E0EF]">
                  Get Started
                </button>
              </div>
            </div>
          </section>

          {/* Premium Plans for Candidates Section */}
          <section id="candidate_plans" className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-white/10 transition-colors duration-300">
            <div className="mb-12">
              <h3 className="text-[#0077B6] dark:text-[#00B4D8] font-bold text-sm tracking-widest uppercase mb-4 transition-colors duration-300">Job Seekers</h3>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 transition-colors duration-300">Premium Plans for Candidates</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">Unlock direct company contacts, profile boosts and recruiter assistance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {candidatePlans.map((plan, idx) => (
                <div 
                  key={`candidate-${idx}`}
                  className={`relative bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 flex flex-col transition-colors duration-300 ${plan.popular ? 'border-2 border-[#0077B6] dark:border-[#00B4D8] shadow-lg' : 'border border-gray-200 dark:border-slate-700'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 right-8 bg-[#0077B6] dark:bg-[#00B4D8] text-white dark:text-slate-900 text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider transition-colors duration-300">
                      Popular
                    </div>
                  )}
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">{plan.title}</h4>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-[#0077B6] dark:text-[#00B4D8] transition-colors duration-300">{getPrice(plan.price.inr, plan.price.usd)}</span>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 transition-colors duration-300">+ 18% GST at checkout<br/>Valid 30 days</p>
                  </div>
                  
                  <ul className="space-y-4 flex-1 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} strokeWidth={3} />
                        <span className="text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 rounded-lg font-bold transition-colors ${plan.popular ? 'bg-[#0077B6] dark:bg-[#00B4D8] text-white dark:text-slate-900 hover:bg-[#023E8A] dark:hover:bg-[#90E0EF]' : 'bg-transparent border border-[#0077B6] dark:border-[#00B4D8] text-[#0077B6] dark:text-[#00B4D8] hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </section>
          
        </div>
      </div>
      <Footer />
    </main>
  );
}

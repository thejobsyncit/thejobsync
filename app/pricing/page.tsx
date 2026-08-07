'use client';
import Link from 'next/link';
import { Check, Building2, User, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';

export default function PricingPage() {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [dbPackages, setDbPackages] = useState<any[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    fetch('/api/packages')
      .then(r => r.json())
      .then(d => {
        setDbPackages(Array.isArray(d) ? d : []);
        setLoadingPackages(false);
      })
      .catch(() => setLoadingPackages(false));
  }, []);

  const companyPackages = dbPackages.filter(p => p.packageType === 'company');
  const candidatePackages = dbPackages.filter(p => p.packageType === 'candidate');

  const getPrice = (inr: string, usd: string) => currency === 'INR' ? inr : usd;

  const formatPrice = (price: number) => {
    if (currency === 'INR') return `₹${price.toLocaleString('en-IN')}`;
    return `$${(price / 85).toFixed(0)}`;
  };

  // ----- OLD STATIC PLANS -----
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
      title: 'Trial Pack',
      popular: false,
      price: { inr: '₹1', usd: '$1' },
      features: [
        '1 job posting',
        'Standard listing',
        'Valid 30 days',
        'First time users only'
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
  // ----------------------------

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans overflow-x-hidden transition-colors duration-300">
      <Navbar />

      <div className="pt-20">
        <div className="bg-[#03045E] dark:bg-slate-950 py-8 text-white flex justify-center items-center gap-4 transition-colors duration-300 border-b border-[#00B4D8]/20">
          <h1 className="font-bold text-xl md:text-2xl text-white">Choose the plan that fits your needs.</h1>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

          {/* ===== COMPANY PACKAGES ===== */}
          <section id="job_posting" className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-white/10 transition-colors duration-300">
            <div className="mb-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 size={22} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-[#0077B6] dark:text-[#00B4D8] font-bold text-sm tracking-widest uppercase">Employers</h3>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Job Posting</h2>
              </div>
            </div>

            {/* STATIC COMPANY PLANS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {jobPostingPlansRow1.map((plan, idx) => (
                <div key={idx} className={`relative bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 flex flex-col transition-colors duration-300 ${plan.popular ? 'border-2 border-[#0077B6] shadow-lg' : 'border border-gray-200'}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0077B6] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase">
                      Popular
                    </div>
                  )}
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{plan.title}</h4>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-[#0077B6]">{getPrice(plan.price.inr, plan.price.usd)}</span>
                    <p className="text-slate-400 text-xs mt-2">+ 18% GST at checkout<br/>Valid 30 days</p>
                  </div>
                  <ul className="space-y-4 flex-1 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} strokeWidth={3} />
                        <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/employer/checkout?plan=${encodeURIComponent(plan.title)}&amount=${plan.price.inr.replace(/[^0-9]/g, '')}`} className={`w-full py-3 rounded-lg font-bold text-center block transition-colors ${plan.popular ? 'bg-[#0077B6] text-white hover:bg-[#023E8A]' : 'bg-transparent border border-[#0077B6] text-[#0077B6] hover:bg-slate-100'}`}>
                    Get Started
                  </Link>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {jobPostingPlansRow2.map((plan, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 flex flex-col border border-gray-200 transition-colors duration-300">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{plan.title}</h4>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-[#0077B6]">{getPrice(plan.price.inr, plan.price.usd)}</span>
                    <p className="text-slate-400 text-xs mt-2">+ 18% GST at checkout<br/>Valid 30 days</p>
                  </div>
                  <ul className="space-y-4 flex-1 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} strokeWidth={3} />
                        <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/employer/checkout?plan=${encodeURIComponent(plan.title)}&amount=${plan.price.inr.replace(/[^0-9]/g, '')}`} className="w-full py-3 rounded-lg font-bold text-center block bg-transparent border border-[#0077B6] text-[#0077B6] hover:bg-slate-100 transition-colors">
                    Get Started
                  </Link>
                </div>
              ))}
            </div>

            {/* DYNAMIC COMPANY PLANS */}
            {companyPackages.length > 0 && (
              <>
                <div className="border-t border-gray-200 dark:border-slate-700 pt-8 mb-8">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Custom & New Plans</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {companyPackages.map((pkg, idx) => {
                    let features: string[] = [];
                    try { features = JSON.parse(pkg.features || '[]'); } catch { features = []; }
                    return (
                      <div key={pkg.id} className="relative bg-white dark:bg-slate-900 rounded-2xl p-8 flex flex-col border-2 border-dashed border-blue-300 hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{pkg.name}</h4>
                        <div className="mb-6">
                          <span className="text-4xl font-extrabold text-[#0077B6]">{formatPrice(pkg.price)}</span>
                          <p className="text-slate-400 text-xs mt-1">+ 18% GST at checkout<br />Valid {pkg.duration} days</p>
                        </div>
                        <ul className="space-y-3 flex-1 mb-8">
                          <li className="flex items-start gap-2">
                            <Check className="text-green-500 mt-0.5 flex-shrink-0" size={15} strokeWidth={3} />
                            <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">{pkg.jobPosts} Job Posts</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="text-green-500 mt-0.5 flex-shrink-0" size={15} strokeWidth={3} />
                            <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">{pkg.resumeViews} Resume Views</span>
                          </li>
                          {features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="text-green-500 mt-0.5 flex-shrink-0" size={15} strokeWidth={3} />
                              <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">{f}</span>
                            </li>
                          ))}
                        </ul>
                        <Link href={`/employer/checkout?packageId=${pkg.id}&plan=${encodeURIComponent(pkg.name)}&amount=${Math.round(pkg.price)}`} className="w-full py-3 rounded-xl font-bold text-center block bg-[#0077B6] text-white hover:bg-[#023E8A] transition-colors shadow-md">
                          Get Started →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          {/* ===== CANDIDATE PACKAGES ===== */}
          <section id="resume_access" className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-white/10 transition-colors duration-300">
            <div className="mb-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <User size={22} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-purple-600 font-bold text-sm tracking-widest uppercase">Job Seekers</h3>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Premium Plans for Candidates</h2>
              </div>
            </div>

            {/* STATIC CANDIDATE PLANS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {candidatePlans.map((plan, idx) => (
                <div key={idx} className={`relative bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 flex flex-col transition-colors duration-300 ${plan.popular ? 'border-2 border-[#0077B6] shadow-lg' : 'border border-gray-200'}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0077B6] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                      Popular
                    </div>
                  )}
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{plan.title}</h4>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-[#0077B6]">{getPrice(plan.price.inr, plan.price.usd)}</span>
                    <p className="text-slate-400 text-xs mt-2">+ 18% GST at checkout<br/>Valid 30 days</p>
                  </div>
                  <ul className="space-y-4 flex-1 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} strokeWidth={3} />
                        <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/careers/login?redirect=package&plan=${encodeURIComponent(plan.title)}&amount=${plan.price.inr.replace(/[^0-9]/g, '')}`} className={`w-full py-3 rounded-lg font-bold text-center block transition-colors ${plan.popular ? 'bg-[#0077B6] text-white hover:bg-[#023E8A]' : 'bg-transparent border border-[#0077B6] text-[#0077B6] hover:bg-slate-100'}`}>
                    Get Started
                  </Link>
                </div>
              ))}
            </div>

            {/* DYNAMIC CANDIDATE PLANS */}
            {candidatePackages.length > 0 && (
              <>
                <div className="border-t border-gray-200 dark:border-slate-700 pt-8 mb-8">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Custom & New Candidate Plans</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {candidatePackages.map((pkg, idx) => {
                    let features: string[] = [];
                    try { features = JSON.parse(pkg.features || '[]'); } catch { features = []; }
                    return (
                      <div key={pkg.id} className="relative bg-white dark:bg-slate-900 rounded-2xl p-8 flex flex-col border-2 border-dashed border-purple-300 hover:border-purple-500 hover:shadow-lg transition-all duration-300">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{pkg.name}</h4>
                        <div className="mb-6">
                          <span className="text-4xl font-extrabold text-purple-600">{formatPrice(pkg.price)}</span>
                          <p className="text-slate-400 text-xs mt-1">+ 18% GST at checkout<br />Valid {pkg.duration} days</p>
                        </div>
                        <ul className="space-y-3 flex-1 mb-8">
                          {pkg.candidateViews > 0 && (
                            <li className="flex items-start gap-2">
                              <Check className="text-green-500 mt-0.5 flex-shrink-0" size={15} strokeWidth={3} />
                              <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">{pkg.candidateViews} Company Contacts</span>
                            </li>
                          )}
                          {features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="text-green-500 mt-0.5 flex-shrink-0" size={15} strokeWidth={3} />
                              <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">{f}</span>
                            </li>
                          ))}
                        </ul>
                        <Link href={`/careers/login?redirect=package&packageId=${pkg.id}&plan=${encodeURIComponent(pkg.name)}`} className="w-full py-3 rounded-xl font-bold text-center block bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-md">
                          Get Started →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          {/* CTA */}
          <div className="bg-[#0a1f44] rounded-3xl p-10 md:p-16 text-center text-white">
            <h2 className="text-3xl font-extrabold mb-3">Need a Custom Plan?</h2>
            <p className="text-blue-200 mb-8 max-w-xl mx-auto">Contact us for bulk hiring or custom enterprise packages tailored for your team.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-[#0a1f44] px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
              Contact Sales →
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}

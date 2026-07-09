'use client';
import Link from 'next/link';
import { ArrowLeft, User, Clock, ShieldCheck, Search, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import Footer from '@/components/landing/Footer';

export default function PostJobPage() {
  const [activeTab, setActiveTab] = useState('enquiry');

  const activelyHiring = [
    {
      initials: 'TN', color: 'bg-blue-100 text-blue-700',
      name: 'TechNova Solutions', industry: 'Information Technology • Software',
      employees: '2,400+ Employees', location: 'Chennai',
      skills: ['React', 'Node.js', 'Cloud'], jobs: 24, featured: true
    },
    {
      initials: 'FC', color: 'bg-orange-100 text-orange-700',
      name: 'Finbridge Capital', industry: 'Banking & Finance • FinTech',
      employees: '850 Employees', location: 'Mumbai',
      skills: ['Finance', 'Risk', 'Analytics'], jobs: 11, featured: false
    },
    {
      initials: 'MC', color: 'bg-green-100 text-green-700',
      name: 'MediCore Health', industry: 'Healthcare • Pharmaceuticals',
      employees: '5,200+ Employees', location: 'Bangalore',
      skills: ['Clinical', 'R&D', 'Biotech'], jobs: 18, featured: true
    },
    {
      initials: 'SC', color: 'bg-pink-100 text-pink-700',
      name: 'SwiftCommerce', industry: 'E-Commerce • Retail Tech',
      employees: '1,100 Employees', location: 'Hyderabad',
      skills: ['Operations', 'Logistics', 'Product'], jobs: 9, featured: false
    },
    {
      initials: 'AM', color: 'bg-gray-200 text-gray-700',
      name: 'Axiom Manufacturing', industry: 'Manufacturing • Engineering',
      employees: '3,800 Employees', location: 'Chennai',
      skills: ['Mechanical', 'QA', 'Supply Chain'], jobs: 7, featured: false
    },
    {
      initials: 'EP', color: 'bg-purple-100 text-purple-700',
      name: 'EduPath Learning', industry: 'Education • Ed-Tech',
      employees: '620 Employees', location: 'Delhi',
      skills: ['Teaching', 'Curriculum', 'Content'], jobs: 15, featured: false
    }
  ];

  return (
    <main className="font-sans flex flex-col relative overflow-x-hidden bg-white">
      
      {/* HERO SECTION - Dark Blue */}
      <section className="bg-[#09152e] relative overflow-hidden flex flex-col min-h-[90vh]">
        {/* Background Subtle Grid/Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        {/* Simplified Navbar */}
        <header className="bg-white h-20 px-4 sm:px-8 flex items-center justify-between shadow-sm shrink-0 relative z-20">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <img src="/logooo.jpeg" alt="JobSync Logo" className="h-10 w-auto object-contain rounded-full border border-gray-100" />
            <span className="font-extrabold text-2xl text-[#1e3a8a] tracking-tight">JobSync</span>
          </Link>
          <Link href="/">
            <button className="bg-[#1e3a8a] hover:bg-[#172554] text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Home
            </button>
          </Link>
        </header>

        {/* Main Split Content */}
        <div className="flex-1 flex flex-col lg:flex-row relative z-10 w-full max-w-[1600px] mx-auto pb-10">
          
          {/* Left Column - Value Prop */}
          <div className="flex-1 p-8 lg:p-16 xl:p-20 flex flex-col text-white justify-center">
            
            <div className="mb-10">
              <Link href="/companies" className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm font-semibold bg-white/5 py-2 px-4 rounded-full border border-white/10 backdrop-blur-sm">
                <ArrowLeft size={16} />
                Back
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#1e3a8a]/40 border border-[#1e3a8a] py-1.5 px-4 rounded-full text-xs font-bold tracking-widest text-blue-200 mb-6 w-max">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              TRUSTED BY 5,000+ COMPANIES
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
              Find Your Next <br />
              <span className="text-[#60a5fa]">Dream Employer</span>
            </h1>

            <p className="text-lg lg:text-xl text-blue-100/70 max-w-xl leading-relaxed mb-12">
              Browse through thousands of top companies actively hiring. Register or log in to unlock full company profiles, salary insights, and direct apply.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-12 border-y border-white/10 py-8">
              <div>
                <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1">12K+</div>
                <div className="text-xs text-blue-300 font-bold tracking-wider uppercase">Companies</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1">3.2L+</div>
                <div className="text-xs text-blue-300 font-bold tracking-wider uppercase">Open Roles</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1">98%</div>
                <div className="text-xs text-blue-300 font-bold tracking-wider uppercase">Response Rate</div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
                  <User size={20} />
                </div>
                <span className="text-blue-100 font-medium">10 crore+ registered jobseekers for all talent needs</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
                  <Clock size={20} />
                </div>
                <span className="text-blue-100 font-medium">Most advanced AI-powered recruitment engine</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-blue-100 font-medium">Verified employers & secure job applications</span>
              </div>
            </div>

          </div>

          {/* Right Column - Enquiry Form Card */}
          <div className="w-full lg:w-[500px] xl:w-[550px] lg:mt-10 lg:mr-8 bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl flex flex-col overflow-hidden self-stretch lg:self-auto h-auto lg:h-fit relative z-30">
            
            {/* Tabs */}
            <div className="flex w-full border-b border-gray-200 bg-gray-50/50">
              <button 
                className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${activeTab === 'enquiry' ? 'text-[#1e3a8a] bg-white border-b-2 border-[#1e3a8a]' : 'text-gray-500 hover:text-gray-800'}`}
                onClick={() => setActiveTab('enquiry')}
              >
                Profile Enquiry
              </button>
              <button 
                className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${activeTab === 'register' ? 'text-[#1e3a8a] bg-white border-b-2 border-[#1e3a8a]' : 'text-gray-500 hover:text-gray-800'}`}
                onClick={() => setActiveTab('register')}
              >
                Register / Log in
              </button>
            </div>

            {/* Form Area */}
            <div className="p-8 lg:p-10 flex-1 overflow-y-auto">
              {activeTab === 'enquiry' && (
                <div className="animate-fade-in">
                  <div className="text-xs font-bold text-[#1e3a8a] tracking-widest uppercase mb-2">For Employers</div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Post Jobs & Find Talent</h2>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    Connect with millions of candidates. Tell us about your hiring needs.
                  </p>

                  <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Company Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Infosys, TCS, Zoho"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Work Email</label>
                      <input 
                        type="email" 
                        placeholder="you@company.com"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all"
                      />
                    </div>

                    <div className="pt-4 space-y-3">
                      <button type="submit" className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all text-sm">
                        Request a Demo
                      </button>
                      <button type="button" className="w-full bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50 font-bold py-3.5 rounded-xl transition-all text-sm">
                        Log in
                      </button>
                    </div>
                  </form>

                  <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <span className="text-sm text-gray-500">New to GOJOBSYNC? </span>
                    <Link href="/register" className="text-sm font-bold text-[#1e3a8a] hover:underline">
                      Create account →
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'register' && (
                <div className="animate-fade-in flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome Back!</h3>
                  <p className="text-gray-500 text-sm mb-6">Log in to your employer dashboard.</p>
                  <Link href="/login" className="w-full bg-[#1e3a8a] text-white font-bold py-3.5 rounded-xl hover:bg-[#172554] transition-colors mb-4 block">
                    Go to Login Page
                  </Link>
                  <Link href="/register" className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors block">
                    Register New Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* COMPANIES ACTIVELY HIRING SECTION */}
      <section className="bg-gray-50 py-24 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-sm font-bold text-[#1e3a8a] tracking-widest uppercase mb-3 block">Top Employers</span>
            <h2 className="text-4xl font-extrabold text-[#111827] mb-4 tracking-tight">Companies Actively Hiring</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Explore verified companies and find where your next opportunity awaits
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-5xl mx-auto">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search companies..."
                className="w-full pl-11 pr-4 py-3.5 bg-white border-0 shadow-sm rounded-xl text-gray-900 focus:ring-2 focus:ring-[#1e3a8a] transition-shadow placeholder-gray-400"
              />
            </div>
            <div className="flex gap-4">
              <select className="bg-white border-0 shadow-sm rounded-xl px-4 py-3.5 text-gray-700 font-medium focus:ring-2 focus:ring-[#1e3a8a] cursor-pointer min-w-[160px] appearance-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}>
                <option>All Industries</option>
                <option>Technology</option>
                <option>Finance</option>
                <option>Healthcare</option>
              </select>
              <select className="bg-white border-0 shadow-sm rounded-xl px-4 py-3.5 text-gray-700 font-medium focus:ring-2 focus:ring-[#1e3a8a] cursor-pointer min-w-[160px] appearance-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}>
                <option>All Locations</option>
                <option>Chennai</option>
                <option>Bangalore</option>
                <option>Mumbai</option>
              </select>
            </div>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activelyHiring.map((company, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col relative group">
                
                {company.featured && (
                  <div className="absolute top-8 right-8 bg-[#3b82f6] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                    Featured
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg mb-6 ${company.color}`}>
                  {company.initials}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#1e3a8a] transition-colors">{company.name}</h3>
                <p className="text-sm text-gray-500 mb-6">{company.industry}</p>

                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-semibold text-green-600">Actively Hiring</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-6">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} />
                    {company.employees}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {company.location}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {company.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <button className="w-full bg-white border-2 border-gray-200 text-gray-700 hover:border-[#1e3a8a] hover:text-[#1e3a8a] font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 group/btn">
                    View {company.jobs} Jobs 
                    <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL FOOTER */}
      <Footer />

    </main>
  );
}

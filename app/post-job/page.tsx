'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { COUNTRIES } from '@/lib/countries';
import { ArrowLeft, CheckCircle2, Circle, Eye, EyeOff, Check, Search, MapPin, Users, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/landing/Footer';
import { INDUSTRIES } from '@/lib/constants';

export default function EmployerRegistration() {
  const router = useRouter();
  const [isWizardActive, setIsWizardActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'enquiry' | 'register'>('enquiry');

  // Company Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form State
  const [selectedCountryCode, setSelectedCountryCode] = useState('IN');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [industry, setIndustry] = useState('');
  const [about, setAbout] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // OTP State
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const prevStep = () => {
    if (step === 1) {
      setIsWizardActive(false);
    } else {
      setStep((s) => Math.max(s - 1, 1));
    }
  };

  // Step 2 Continue → Send OTP
  const handleStep2Continue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workEmail) {
      setOtpError('Please enter your work email in Step 1 first.');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');
    try {
      const res = await fetch('/api/employer/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: workEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || 'Failed to send OTP. Please try again.');
        setOtpLoading(false);
        return;
      }
      setOtp(['', '', '', '', '', '']);
      setResendCountdown(60);
      setStep(3);
    } catch {
      setOtpError('Network error. Please check your connection.');
    }
    setOtpLoading(false);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCountdown > 0 || !workEmail) return;
    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await fetch('/api/employer/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: workEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || 'Failed to resend OTP.');
      } else {
        setOtp(['', '', '', '', '', '']);
        setResendCountdown(60);
        setOtpSuccess('OTP resent! Please check your inbox.');
      }
    } catch {
      setOtpError('Network error. Please try again.');
    }
    setOtpLoading(false);
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setOtpError('Please enter the complete 6-digit OTP.');
      return;
    }
    setVerifyLoading(true);
    setOtpError('');
    try {
      // 1. Verify OTP
      const verifyRes = await fetch('/api/employer/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: workEmail, otp: otpCode }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setOtpError(verifyData.error || 'Invalid OTP. Please try again.');
        setVerifyLoading(false);
        return;
      }

      // 2. Register User
      const countryData = COUNTRIES.find(c => c.code === selectedCountryCode) || COUNTRIES[0];
      const fullContactPhone = `${countryData.dialCode} ${contactPhone}`.trim();

      const registerRes = await fetch('/api/employer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName, gstNumber, address, contactPerson, contactPhone: fullContactPhone,
          country: selectedCountryCode, email: workEmail, password, industry, about
        }),
      });
      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setOtpError(registerData.error || 'Registration failed. Email might already exist.');
        setVerifyLoading(false);
        return;
      }

      // 3. Login to get cookie
      await fetch('/api/employer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: workEmail, password }),
      });

      // 4. Success - redirect
      setIsWizardActive(false);
      router.push('/employer/dashboard');

    } catch {
      setOtpError('Network error. Please try again.');
    }
    setVerifyLoading(false);
  };

  // Password Validation
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasLength = password.length >= 8 && password.length <= 40;

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');
    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const timelineSteps = [
    { num: 1, label: 'Fill company details & GST info' },
    { num: 2, label: 'Set your login credentials' },
    { num: 3, label: 'Verify OTP & agree to terms' },
    { num: 4, label: 'Access your recruiter dashboard' },
  ];

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
    <main className="font-sans flex flex-col relative overflow-x-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      {!isWizardActive ? (
        <section className="min-h-screen bg-[#0a1f44] text-white relative flex flex-col">
          {/* Landing State Header */}
          <header className="w-full h-20 px-6 sm:px-10 flex items-center justify-between z-20 bg-white">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/loooo.jpeg" alt="The jobsync Logo" className="w-full h-full object-contain rounded-full border border-[#00B4D8]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-slate-900 leading-none tracking-tight">The jobsync</span>
              </div>
            </Link>
            <Link href="/">
              <button className="hidden sm:flex items-center gap-2 bg-[#03045E] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#172554] transition-colors shadow-sm">
                <ArrowLeft size={16} /> Back to Home
              </button>
            </Link>
          </header>

          <div className="relative flex-1 w-full px-6 py-12 lg:py-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            {/* Left Content */}
            <div className="lg:w-[55%] relative z-10">
              {/* Removed redundant left back button */}

              <div className="inline-flex items-center gap-2 bg-blue-900/50 border border-blue-700/50 py-1.5 px-4 rounded-full text-[11px] font-bold tracking-widest text-blue-200 mb-6 uppercase">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span> TRUSTED BY 5,000+ COMPANIES
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                Find Your Next <br />
                <span className="text-[#00B4D8]">Dream Employer</span>
              </h1>

              <p className="text-lg text-blue-100/70 max-w-xl leading-relaxed mb-12">
                Browse through thousands of top companies actively hiring. Register or log in to unlock full company profiles, salary insights, and direct apply.
              </p>

              <div className="flex gap-8 mb-12">
                <div>
                  <div className="text-3xl font-extrabold mb-1">12K+</div>
                  <div className="text-[10px] text-blue-300 font-bold tracking-widest uppercase">Companies</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold mb-1">3.2L+</div>
                  <div className="text-[10px] text-blue-300 font-bold tracking-widest uppercase">Open Roles</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold mb-1">98%</div>
                  <div className="text-[10px] text-blue-300 font-bold tracking-widest uppercase">Response Rate</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-blue-100">
                  <div className="w-10 h-10 rounded-xl border border-blue-700 flex items-center justify-center bg-blue-900/30"><Users size={18} className="text-blue-300" /></div>
                  10 crore+ registered jobseekers for all talent needs
                </div>
                <div className="flex items-center gap-4 text-sm text-blue-100">
                  <div className="w-10 h-10 rounded-xl border border-blue-700 flex items-center justify-center bg-blue-900/30"><Circle size={18} className="text-blue-300" /></div>
                  Most advanced AI-powered recruitment engine
                </div>
                <div className="flex items-center gap-4 text-sm text-blue-100">
                  <div className="w-10 h-10 rounded-xl border border-blue-700 flex items-center justify-center bg-blue-900/30"><CheckCircle2 size={18} className="text-blue-300" /></div>
                  Verified employers & secure job applications
                </div>
              </div>
            </div>

            {/* Right Card (Tabs) */}
            <div className="lg:w-[450px] w-full bg-white rounded-3xl shadow-2xl overflow-hidden text-slate-900 relative z-10">
              <div className="flex border-b border-slate-200">
                <button onClick={() => setActiveTab('enquiry')} className={`flex-1 py-5 text-sm font-bold transition-colors ${activeTab === 'enquiry' ? 'text-[#03045E] border-b-2 border-[#03045E]' : 'text-slate-400 hover:text-slate-600'}`}>
                  Profile Enquiry
                </button>
                <button onClick={() => setActiveTab('register')} className={`flex-1 py-5 text-sm font-bold transition-colors ${activeTab === 'register' ? 'text-[#03045E] border-b-2 border-[#03045E]' : 'text-slate-400 hover:text-slate-600'}`}>
                  Register / Log in
                </button>
              </div>

              <div className="p-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'enquiry' ? (
                    <motion.div
                      key="enquiry"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-[10px] font-bold tracking-widest text-[#03045E] uppercase block mb-2">For Employers</span>
                      <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Post Jobs & Find Talent</h3>
                      <p className="text-sm text-slate-500 mb-6">Connect with millions of candidates. Tell us about your hiring needs.</p>

                      <form className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Company Name</label>
                          <input type="text" placeholder="e.g. Infosys, TCS, Zoho" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Work Email</label>
                          <input type="email" placeholder="mrjobsync@gmail.com" className="w-full px-4 py-3 bg-[#CAF0F8]/30/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                          <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] transition-colors" />
                        </div>

                        <div className="pt-2 space-y-3">
                          <button type="button" className="w-full py-3.5 bg-[#03045E] hover:bg-[#172554] text-white font-bold rounded-xl shadow-lg transition-all">Request a Demo</button>
                          <button type="button" className="w-full py-3.5 bg-[#03045E] hover:bg-[#172554] text-white font-bold rounded-xl shadow-lg transition-all">Log in</button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-[10px] font-bold tracking-widest text-[#03045E] uppercase block mb-2">For Companies</span>
                      <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Company Login</h3>
                      <p className="text-sm text-slate-500 mb-6">Sign in to manage your job postings and candidate applications.</p>

                      <form className="space-y-4" onSubmit={async (e) => {
                        e.preventDefault();
                        setLoginError('');
                        setLoginLoading(true);
                        try {
                          const res = await fetch('/api/employer/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: loginEmail, password: loginPassword })
                          });
                          const data = await res.json();
                          if (res.ok) {
                            router.push('/employer/dashboard');
                          } else {
                            setLoginError(data.error || 'Invalid credentials');
                          }
                        } catch (err) {
                          setLoginError('Something went wrong. Please try again.');
                        }
                        setLoginLoading(false);
                      }}>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                          <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required placeholder="you@company.com" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                          <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required placeholder="••••••••••••" className="w-full px-4 py-3 bg-[#CAF0F8]/30/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] transition-colors" />
                        </div>

                        {loginError && (
                          <div className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg border border-red-200">
                            {loginError}
                          </div>
                        )}

                        <div className="pt-2">
                          <button type="submit" disabled={loginLoading} className="w-full py-3.5 flex items-center justify-center gap-2 bg-[#03045E] hover:bg-[#172554] text-white font-bold rounded-xl shadow-lg transition-all mb-4 disabled:opacity-70">
                            {loginLoading && <Loader2 size={16} className="animate-spin" />}
                            Sign In
                          </button>
                        </div>
                      </form>

                      <div className="text-center mt-4 pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-500">New to The jobsync? </span>
                        <button onClick={() => setIsWizardActive(true)} className="text-xs font-bold text-slate-900 hover:underline">Create account &rarr;</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative flex w-full min-h-screen">
          {/* OTP Modal Overlay */}
          <AnimatePresence>
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-200 dark:border-slate-800"
                >
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Verify your email</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                    A 6-digit OTP has been sent to{' '}
                    <span className="font-semibold text-[#03045E] dark:text-[#00B4D8]">{workEmail}</span>.
                    Enter it below to verify your account.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpInputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        maxLength={1}
                        style={{
                          width: '48px',
                          height: '56px',
                          textAlign: 'center',
                          fontSize: '22px',
                          fontWeight: '700',
                          background: '#ffffff',
                          color: '#0f172a',
                          border: digit ? '2px solid #0ea5e9' : '2px solid #cbd5e1',
                          borderRadius: '12px',
                          outline: 'none',
                          boxShadow: digit ? '0 0 0 3px rgba(14,165,233,0.15)' : 'none',
                          transition: 'border-color 0.15s, box-shadow 0.15s',
                          caretColor: '#00B4D8',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '2px solid #0ea5e9';
                          e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border = digit ? '2px solid #0ea5e9' : '2px solid #cbd5e1';
                          e.target.style.boxShadow = digit ? '0 0 0 3px rgba(14,165,233,0.1)' : 'none';
                        }}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-2.5 text-red-600 dark:text-red-400 text-sm font-medium mb-4">
                      {otpError}
                    </div>
                  )}
                  {otpSuccess && (
                    <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl px-4 py-2.5 text-green-700 dark:text-green-400 text-sm font-medium mb-4">
                      {otpSuccess}
                    </div>
                  )}

                  <div className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
                    {resendCountdown > 0 ? (
                      <>Resend in <span className="text-slate-700 dark:text-slate-300 font-bold">{String(Math.floor(resendCountdown / 60)).padStart(2, '0')}:{String(resendCountdown % 60).padStart(2, '0')}</span></>
                    ) : (
                      <button
                        onClick={handleResendOtp}
                        disabled={otpLoading}
                        className="text-[#03045E] dark:text-[#00B4D8] font-bold hover:underline disabled:opacity-50"
                      >
                        {otpLoading ? 'Sending...' : 'Resend OTP'}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={verifyLoading || otp.join('').length < 6}
                    className="w-full py-3.5 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-sky-500/25 transition-all mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {verifyLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    onClick={prevStep}
                    className="w-full py-3.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                  >
                    Back
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TOP NAVBAR */}
          <header className="absolute top-0 left-0 w-full h-20 px-6 sm:px-10 flex items-center justify-between z-10 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white leading-none tracking-tight">GO</span>
                <span className="font-extrabold text-lg text-slate-900 dark:text-white leading-none tracking-tight">The jobsync</span>
              </div>
            </Link>
            <div className="flex items-center gap-6">
              <button onClick={() => setIsWizardActive(false)} className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#0077B6] dark:hover:text-[#00B4D8] transition-colors border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm">
                <ArrowLeft size={16} />
                Back
              </button>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Already registered? <button onClick={() => { setIsWizardActive(false); setActiveTab('register'); }} className="text-[#03045E] dark:text-[#00B4D8] font-bold hover:underline">Sign In &rarr;</button>
              </div>
            </div>
          </header>

          {/* LEFT COLUMN - CONTENT */}
          <div className="hidden lg:flex w-[45%] flex-col pt-32 pb-12 px-12 xl:px-20 border-r border-slate-200 dark:border-slate-800 relative z-0">

            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>


            <div className="inline-flex items-center gap-2 bg-[#90E0EF]/30 dark:bg-[#0077B6]/10 border border-sky-200 dark:border-[#0077B6]/20 py-1.5 px-4 rounded-full text-[11px] font-bold tracking-widest text-sky-700 dark:text-[#00B4D8] mb-6 w-max">
              <span className="w-2 h-2 rounded-full bg-[#0077B6]"></span>
              EMPLOYER PORTAL
            </div>

            <h1 className="text-5xl xl:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
              Hire smarter,<br />
              <span className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] bg-clip-text text-transparent">grow faster</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-12 max-w-md">
              Post jobs, access millions of verified candidates, and manage your entire recruitment pipeline — all from one powerful dashboard.
            </p>

            <div className="flex gap-6 mb-16 py-8 border-y border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">12K+</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase">Companies</div>
              </div>
              <div className="w-px bg-slate-200 dark:bg-slate-800"></div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">3.2L+</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase">Open Roles</div>
              </div>
              <div className="w-px bg-slate-200 dark:bg-slate-800"></div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">98%</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase">Response Rate</div>
              </div>
            </div>

            <div className="space-y-8 relative">
              <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>

              {timelineSteps.map((s, idx) => {
                const isCompleted = step > s.num;
                const isCurrent = step === s.num;

                return (
                  <div key={idx} className="flex items-center gap-5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isCompleted ? 'bg-[#0077B6] text-white' :
                        isCurrent ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 ring-4 ring-sky-500/20' :
                          'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                      {isCompleted ? <Check size={16} strokeWidth={3} /> : s.num}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${isCurrent || isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-500'}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT COLUMN - FORM WIZARD */}
          <div className="flex-1 flex flex-col pt-24 lg:pt-32 pb-12 px-6 sm:px-12 items-center justify-start overflow-y-auto">
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 overflow-hidden relative">

              {/* Top Progress Line */}
              <div className="absolute top-0 left-0 h-1 bg-slate-100 dark:bg-slate-800 w-full">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#0077B6] to-[#00B4D8]"
                  initial={{ width: '33%' }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="p-8 sm:p-12">

                <div className="flex items-center justify-between mb-12 relative px-4">
                  <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>
                  <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-0.5 bg-green-500 -z-10 origin-left transition-transform duration-500" style={{ transform: `scaleX(${step === 1 ? 0 : step === 2 ? 0.5 : 1})` }}></div>

                  {/* Step 1 */}
                  <div className="flex flex-col items-center gap-2 bg-white dark:bg-slate-900 px-2">
                    {step > 1 ? (
                      <CheckCircle2 size={32} className="text-green-500 fill-green-50" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm">1</div>
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= 1 ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>Company</span>
                  </div>
                  {/* Step 2 */}
                  <div className="flex flex-col items-center gap-2 bg-white dark:bg-slate-900 px-2">
                    {step > 2 ? (
                      <CheckCircle2 size={32} className="text-green-500 fill-green-50" />
                    ) : step === 2 ? (
                      <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm ring-4 ring-slate-100 dark:ring-slate-800">2</div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-sm">2</div>
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= 2 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Credentials</span>
                  </div>
                  {/* Step 3 */}
                  <div className="flex flex-col items-center gap-2 bg-white dark:bg-slate-900 px-2">
                    {step === 3 ? (
                      <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm ring-4 ring-slate-100 dark:ring-slate-800">3</div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-sm">3</div>
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${step === 3 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>OTP & Terms</span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-8">
                        <span className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase block mb-2">Step 1 of 3</span>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Company Information</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Fill in your business details. This information will appear on your employer profile.</p>
                      </div>

                      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setStep((s) => Math.min(s + 1, 3)); }}>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Company Name *</label>
                          <input type="text" placeholder="e.g. Infosys, TCS, Zoho" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] dark:focus:border-[#0077B6] transition-colors dark:text-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Country *</label>
                            <select value={selectedCountryCode} onChange={e => setSelectedCountryCode(e.target.value)} className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] dark:focus:border-[#0077B6] transition-colors dark:text-white appearance-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}>
                              {COUNTRIES.map(c => (
                                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            {(() => {
                              const countryData = COUNTRIES.find(c => c.code === selectedCountryCode) || COUNTRIES[0];
                              return (
                                <>
                                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{countryData.taxLabel} *</label>
                                  <input type="text" placeholder={countryData.taxPlaceholder} required value={gstNumber} onChange={e => setGstNumber(e.target.value)} className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] dark:focus:border-[#0077B6] transition-colors dark:text-white" />
                                </>
                              );
                            })()}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Company Address *</label>
                          <input type="text" placeholder="Street address, city, state, PIN" required value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] dark:focus:border-[#0077B6] transition-colors dark:text-white" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Contact Person *</label>
                            <input type="text" placeholder="Full name" required value={contactPerson} onChange={e => setContactPerson(e.target.value)} className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] dark:focus:border-[#0077B6] transition-colors dark:text-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Contact Number *</label>
                            {(() => {
                              const countryData = COUNTRIES.find(c => c.code === selectedCountryCode) || COUNTRIES[0];
                              return (
                                <div className="flex w-full border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:border-[#0077B6] dark:focus-within:border-[#0077B6] transition-colors bg-white dark:bg-slate-800">
                                  <div className="flex items-center justify-center px-3 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium">
                                    <span className="mr-1.5 text-base leading-none">{countryData.flag}</span>
                                    <span>{countryData.dialCode}</span>
                                  </div>
                                  <input type="tel" placeholder="Mobile number" required value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="flex-1 px-3 py-3.5 bg-transparent text-sm focus:outline-none dark:text-white" />
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Work Email *</label>
                          <input
                            type="email"
                            placeholder="you@company.com"
                            required
                            value={workEmail}
                            onChange={(e) => setWorkEmail(e.target.value)}
                            className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] dark:focus:border-[#0077B6] transition-colors dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nature of Company *</label>
                          <select value={industry} onChange={e => setIndustry(e.target.value)} required className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] dark:focus:border-[#0077B6] transition-colors dark:text-white appearance-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}>
                            <option value="" disabled>Select nature of business</option>
                            {INDUSTRIES.map((ind) => (
                              <option key={ind} value={ind}>{ind}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">About the Company *</label>
                          <textarea rows={3} value={about} onChange={e => setAbout(e.target.value)} placeholder="Briefly describe your company — culture, mission, what you do..." required className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] dark:focus:border-[#0077B6] transition-colors resize-none dark:text-white"></textarea>
                        </div>

                        <button type="submit" className="w-full mt-6 py-4 bg-[#03045E] hover:bg-[#172554] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                          Save & Continue <ArrowLeft size={16} className="rotate-180" />
                        </button>

                        <div className="text-center mt-6">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Already registered? </span>
                          <button type="button" onClick={() => { setIsWizardActive(false); setActiveTab('register'); }} className="text-sm font-bold text-slate-900 dark:text-white hover:underline">Sign In &rarr;</button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {step >= 2 && (
                    <motion.div
                      key="step2"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-8">
                        <span className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase block mb-2">Step 2 of 3</span>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Set Login Credentials</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Choose a username and strong password for your account.</p>
                      </div>

                      <form className="space-y-6" onSubmit={handleStep2Continue}>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Username *</label>
                          <input type="text" placeholder="Choose a unique username" required className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] dark:focus:border-[#0077B6] transition-colors dark:text-white" />
                          <div className="flex items-center gap-2 mt-3">
                            <input type="checkbox" id="use-email" className="w-4 h-4 rounded border-slate-300 text-[#03045E] focus:ring-sky-600" />
                            <label htmlFor="use-email" className="text-sm text-slate-600 dark:text-slate-400">Use email as username (<span className="font-medium text-slate-900 dark:text-white">{workEmail || 'enter email in step 1'}</span>)</label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Password *</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              className="w-full pl-4 pr-12 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] dark:focus:border-[#0077B6] transition-colors dark:text-white"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>

                          {/* Password Requirements Grid */}
                          <div className="grid grid-cols-2 gap-y-2 mt-4">
                            <div className={`flex items-center gap-1.5 text-xs font-medium ${hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                              <Check size={14} /> Lowercase letter
                            </div>
                            <div className={`flex items-center gap-1.5 text-xs font-medium ${hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                              <Check size={14} /> Uppercase letter
                            </div>
                            <div className={`flex items-center gap-1.5 text-xs font-medium ${hasNumber ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                              <Check size={14} /> Number
                            </div>
                            <div className={`flex items-center gap-1.5 text-xs font-medium ${hasSpecial ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                              <Check size={14} /> Special character
                            </div>
                            <div className={`flex items-center gap-1.5 text-xs font-medium ${hasLength ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                              <Check size={14} /> 8-40 characters
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password *</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Re-enter password"
                              required
                              className="w-full pl-4 pr-12 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] dark:focus:border-[#0077B6] transition-colors dark:text-white"
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div className="pt-4 space-y-3">
                          {otpError && (
                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3 text-red-600 dark:text-red-400 text-sm font-medium">
                              {otpError}
                            </div>
                          )}
                          <button
                            type="submit"
                            disabled={otpLoading}
                            className="w-full py-4 bg-[#03045E] hover:bg-[#172554] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {otpLoading ? 'Sending OTP...' : <><span>Continue</span><ArrowLeft size={16} className="rotate-180" /></>}
                          </button>
                          <button type="button" onClick={prevStep} className="w-full py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                            <ArrowLeft size={16} /> Back
                          </button>
                        </div>

                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </div>
        </section>
      )}

      {/* COMPANIES ACTIVELY HIRING SECTION */}
      <section className="bg-white dark:bg-slate-900 py-24 px-6 md:px-12 relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">
            <span className="text-sm font-bold text-[#0077B6] tracking-widest uppercase mb-3 block">Top Employers</span>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Companies Actively Hiring</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Explore verified companies and find where your next opportunity awaits
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-5xl mx-auto">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search companies..."
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#0077B6] dark:focus:border-[#0077B6] transition-colors placeholder-slate-400"
              />
            </div>
            <div className="flex gap-4">
              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-[#0077B6] dark:focus:border-[#0077B6] transition-colors cursor-pointer min-w-[160px] appearance-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}>
                <option>All Industries</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-[#0077B6] dark:focus:border-[#0077B6] transition-colors cursor-pointer min-w-[160px] appearance-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}>
                <option>All Locations</option>
                <option>Chennai</option>
                <option>Bangalore</option>
                <option>Mumbai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activelyHiring.map((company, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl dark:shadow-none hover:border-[#0077B6]/50 transition-all flex flex-col relative group">

                {company.featured && (
                  <div className="absolute top-8 right-8 bg-[#0077B6] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                    Featured
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg mb-6 ${company.color}`}>
                  {company.initials}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-[#0077B6] transition-colors">{company.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{company.industry}</p>

                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">Actively Hiring</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
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
                    <span key={sIdx} className="bg-[#90E0EF]/30 dark:bg-[#0077B6]/10 text-sky-700 dark:text-[#00B4D8] border border-sky-200 dark:border-[#0077B6]/20 text-xs font-bold px-3 py-1.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <button className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#0077B6] hover:text-[#0077B6] dark:hover:border-[#0077B6] dark:hover:text-[#00B4D8] font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 group/btn">
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

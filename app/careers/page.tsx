'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { DEPARTMENTS } from '@/lib/constants';
import {
  Search, MapPin, Briefcase, DollarSign, Users, Clock,
  ChevronRight, Star, Building2, Code, TrendingUp, Heart,
  BookOpen, BarChart3, Cpu, Globe, LogOut, User, Bell, Menu, X,
  Zap, ArrowRight, Sparkles, Sun, Moon
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  'IT Services': <Cpu size={24} />,
  'Software Development': <Code size={24} />,
  'Banking & Finance': <BarChart3 size={24} />,
  'Healthcare IT': <Heart size={24} />,
  'EdTech': <BookOpen size={24} />,
  'Cloud Infrastructure': <Globe size={24} />,
};

const HERO_STATS = [
  { label: 'Active Jobs', value: '500+' },
  { label: 'Top Companies', value: '50+' },
  { label: 'Placements', value: '200+' },
  { label: 'Syncs Daily', value: '10K+' },
];

import { usePortalTheme } from '@/context/PortalThemeContext';

export default function CareersPage() {
  const { theme, toggleTheme, isDark } = usePortalTheme();

  const { candidate, logout } = useCandidateAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ industry: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/requirements?status=open').then(r => r.json()),
      fetch('/api/clients').then(r => r.json()),
    ]).then(([reqs, clients]) => {
      const clientMap: Record<string, any> = {};
      clients.forEach((c: any) => { clientMap[c.id] = c; });

      const enriched = reqs.map((r: any) => ({
        ...r,
        skills: typeof r.skills === 'string' ? JSON.parse(r.skills) : r.skills,
        client: clientMap[r.clientId],
      }));
      setJobs(enriched);

      const catCount: Record<string, number> = {};
      enriched.forEach((j: any) => {
        const ind = j.client?.industry || 'Other';
        catCount[ind] = (catCount[ind] || 0) + 1;
      });
      setCategories(Object.entries(catCount).map(([industry, count]) => ({ industry, count })));
      setLoading(false);
    }).catch(() => setLoading(false));

    // Fetch recommendations if logged in
    if (candidate) {
      fetch('/api/candidate-auth/recommendations')
        .then(r => r.json())
        .then(data => {
          if (data.recommendations) {
            setRecommendedJobs(data.recommendations);
          }
        })
        .catch(console.error);
    }
  }, [candidate]);

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    
    let jobLocStr = j.location || '';
    if (jobLocStr.startsWith('{')) {
      try {
        const l = JSON.parse(jobLocStr);
        jobLocStr = `${l.state || ''} ${l.district || ''} ${l.city || ''} ${l.address || ''}`;
      } catch (e) {}
    }

    const matchesQ = !q || j.title?.toLowerCase().includes(q) || j.client?.companyName?.toLowerCase().includes(q) || j.client?.industry?.toLowerCase().includes(q);
    const matchesLoc = !locationFilter || jobLocStr.toLowerCase().includes(locationFilter.toLowerCase());
    
    // Some jobs might have field stored in j.field (EmployerJob) or j.client.industry (JobRequirement)
    const matchesDept = !departmentFilter || 
                        j.field === departmentFilter || 
                        j.client?.industry === departmentFilter || 
                        j.client?.department === departmentFilter;

    return matchesQ && matchesLoc && matchesDept;
  });

  const PRIORITY_COLORS: Record<string, string> = { urgent: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e' };

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#0f172a' : '#f8fafc',
      color: isDark ? '#f8fafc' : '#1e293b',
      fontFamily: 'var(--font-inter, Inter, sans-serif)',
      overflowX: 'hidden',
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>

      {/* ===== NAVBAR (Glassmorphism) ===== */}
      <nav style={{
        position: 'fixed', top: 0, zIndex: 100, width: '100%',
        background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>
          {/* Logo */}
          <Link href="/careers" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/loooo.jpeg" alt="The jobsync Logo" style={{ height: 36, width: 36, objectFit: 'contain', borderRadius: '50%' }} />
            <span className="brand-text" style={{ fontWeight: 800, fontSize: '1.5rem', color: isDark ? 'white' : '#0f172a', letterSpacing: '-0.5px', transition: 'color 0.3s' }}>The Job<span style={{ color: '#00B4D8' }}>Sync</span></span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
            <Link href="/careers" style={{ color: '#00B4D8', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }}>Explore Jobs</Link>
            <Link href="/careers/my-applications" style={{ color: isDark ? '#94a3b8' : '#475569', fontWeight: 500, fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-[#0077B6]">My Applications</Link>
          </div>

          {/* Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: 'none',
                color: isDark ? '#f59e0b' : '#0077B6',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              title="Toggle Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {candidate ? (
              <>
                <Link href="/careers/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '0.5rem 1rem', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderRadius: 10, color: isDark ? 'white' : '#0f172a', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }} className="hover:bg-white/20">
                  <User size={18} />{candidate.name.split(' ')[0]}
                </Link>
                <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', background: 'none', border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`, borderRadius: 10, color: isDark ? '#94a3b8' : '#475569', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }} className="hover:text-red-500 hidden-mobile">
                  <LogOut size={18} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/careers/login" style={{ color: isDark ? '#e2e8f0' : '#1e293b', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-[#0077B6]">Sign In</Link>
                <Link href="/careers/register" style={{ padding: '0.6rem 1.5rem', background: 'linear-gradient(135deg, #0ea5e9, #0077B6)', color: 'white', borderRadius: 12, fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(14,165,233,0.4)', transition: 'transform 0.2s' }} className="hover:scale-105 hidden-mobile">
                  Join The jobsync
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                background: 'none',
                border: 'none',
                color: isDark ? 'white' : '#0f172a',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 76,
              left: 0,
              right: 0,
              background: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)',
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              zIndex: 99,
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <Link
              href="/careers"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#00B4D8', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', padding: '0.5rem 0' }}
            >
              Explore Jobs
            </Link>
            <Link
              href="/careers/my-applications"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: isDark ? '#e2e8f0' : '#1e293b', fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none', padding: '0.5rem 0' }}
            >
              My Applications
            </Link>

            <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {candidate ? (
                <>
                  <Link
                    href="/careers/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '0.75rem 1rem', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 10, color: isDark ? 'white' : '#0f172a', fontWeight: 600 }}
                  >
                    <User size={18} /> My Profile ({candidate.name.split(' ')[0]})
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: 10, color: '#ef4444', fontWeight: 700, cursor: 'pointer' }}
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/careers/login"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: isDark ? '#cbd5e1' : '#475569', fontWeight: 600, textDecoration: 'none', textAlign: 'center', padding: '0.5rem 0' }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/careers/register"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ padding: '0.75rem', background: 'linear-gradient(135deg, #0ea5e9, #0077B6)', color: 'white', borderRadius: 10, fontWeight: 700, textDecoration: 'none', textAlign: 'center', boxShadow: '0 4px 15px rgba(14,165,233,0.3)' }}
                  >
                    Join The jobsync
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== HERO SECTION ===== */}
      <section style={{ paddingTop: '140px', paddingBottom: '6rem', position: 'relative' }}>
        {/* Abstract Background Orbs */}
        {isDark && (
          <>
            <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)', top: -100, left: -200, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(0,0,0,0) 70%)', top: 200, right: -150, pointerEvents: 'none' }} />
          </>
        )}

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 1.5rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 50, padding: '0.5rem 1.25rem', marginBottom: '2rem' }}>
              <Sparkles size={16} color="#38bdf8" />
              <span style={{ color: isDark ? '#e2e8f0' : '#475569', fontSize: '0.875rem', fontWeight: 500 }}>The New Standard in Tech Recruitment</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: isDark ? 'white' : '#0f172a', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px', transition: 'color 0.3s' }}>
              Sync Your Skills With <br />
              <span style={{ background: 'linear-gradient(90deg, #38bdf8, #00B4D8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Your Dream Career
              </span>
            </h1>
            <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '1.25rem', marginBottom: '3rem', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 3rem', transition: 'color 0.3s' }}>
              The jobsync connects elite talent with top-tier companies seamlessly. Discover {jobs.length}+ opportunities tailored to your expertise.
            </p>
          </motion.div>

          {/* Search Box (Glass) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: 24, padding: '0.75rem', display: 'flex', gap: '0.5rem', boxShadow: isDark ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 15px 30px rgba(0,0,0,0.05)', flexWrap: 'wrap', backdropFilter: 'blur(16px)', transition: 'all 0.3s' }}>
            <div className="search-input-container" style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: 12, padding: '0.5rem 1rem' }}>
              <Search size={20} color="#64748b" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Job title, skill, or company"
                style={{ border: 'none', outline: 'none', fontSize: '1rem', color: isDark ? 'white' : '#0f172a', background: 'transparent', width: '100%', padding: '0.5rem 0' }}
                className={isDark ? "placeholder-slate-500" : "placeholder-slate-400"}
              />
            </div>
            <div style={{ flex: '1 1 160px', display: 'flex', alignItems: 'center', gap: 12, padding: '0.5rem 1rem' }}>
              <MapPin size={20} color="#64748b" />
              <input
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                placeholder="Locality / Area"
                style={{ border: 'none', outline: 'none', fontSize: '1rem', color: isDark ? 'white' : '#0f172a', background: 'transparent', width: '100%', padding: '0.5rem 0' }}
                className={isDark ? "placeholder-slate-500" : "placeholder-slate-400"}
              />
            </div>
            <div style={{ flex: '1 1 160px', display: 'flex', alignItems: 'center', gap: 12, padding: '0.5rem 1rem' }}>
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '1rem', color: isDark ? (departmentFilter ? 'white' : '#64748b') : (departmentFilter ? '#0f172a' : '#94a3b8'), background: 'transparent', width: '100%', padding: '0.5rem 0', cursor: 'pointer' }}
                className="appearance-none"
              >
                <option value="" style={{ color: '#000' }}>All Departments</option>
                {DEPARTMENTS.map(d => <option key={d} value={d} style={{ color: '#000' }}>{d}</option>)}
              </select>
            </div>
            <button
              onClick={() => document.getElementById('jobs-list')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0077B6)', color: 'white', border: 'none', borderRadius: 16, padding: '0 2.5rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', height: '54px' }}
              className="hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] hover:scale-[1.02]"
            >
              Sync Jobs
            </button>
          </motion.div>

          {/* Popular Tags */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Trending:</span>
            {['React', 'Node.js', 'Python', 'AWS', 'UI/UX'].map(tag => (
              <button key={tag} onClick={() => setSearch(tag)} style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, color: isDark ? '#cbd5e1' : '#475569', borderRadius: 50, padding: '0.35rem 1rem', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s' }} className="hover:bg-[#0077B6] hover:text-white">
                {tag}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div className="stats-grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ maxWidth: 800, margin: '4rem auto 0', padding: '0 1.5rem' }}>
          {HERO_STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '1.5rem', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderRadius: 20, border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`, transition: 'all 0.3s' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? 'white' : '#0f172a', marginBottom: 4, transition: 'color 0.3s' }}>{s.value}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ===== AI RECOMMENDED JOBS (CRM LINKED) ===== */}
      {candidate && recommendedJobs.length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="#00B4D8" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: isDark ? 'white' : '#0f172a', letterSpacing: '-0.5px', transition: 'color 0.3s' }}>Recommended For You</h2>
              <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '0.95rem' }}>Based on your skills & profile</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {recommendedJobs.slice(0, 3).map((job, idx) => (
              <JobCard key={job.id} job={job} candidate={candidate} delay={idx * 0.1} isRecommended={true} isDark={isDark} />
            ))}
          </div>
        </section>
      )}

      {/* ===== CATEGORIES ===== */}
      {categories.length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: isDark ? 'white' : '#0f172a', marginBottom: 12, letterSpacing: '-0.5px', transition: 'color 0.3s' }}>Explore by Industry</h2>
            <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '1.1rem' }}>Find your niche across {categories.length} specialized sectors</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1.25rem' }}>
            {categories.map((cat, idx) => (
              <motion.button
                key={cat.industry}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSearch(cat.industry)}
                style={{
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.85)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                  borderRadius: 20,
                  padding: '2rem 1.25rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.02)'
                }}
                className="hover:border-[#0077B6]/50 hover:shadow-[0_10px_30px_rgba(14,165,233,0.15)] group"
              >
                <div style={{ width: 56, height: 56, borderRadius: 16, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#00B4D8', transition: 'all 0.3s' }} className="group-hover:scale-110 group-hover:bg-[#0077B6]/10">
                  {CATEGORY_ICONS[cat.industry] || <Briefcase size={26} />}
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: isDark ? 'white' : '#1e293b', marginBottom: 6, transition: 'color 0.3s' }}>{cat.industry}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{cat.count} Opportunity{cat.count !== 1 ? 's' : ''}</div>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* ===== ALL JOBS LIST ===== */}
      <section id="jobs-list" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem 6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: isDark ? 'white' : '#0f172a', marginBottom: 8, letterSpacing: '-0.5px', transition: 'color 0.3s' }}>Latest Openings</h2>
            <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '1rem' }}>
              Showing {filtered.length} position{filtered.length !== 1 ? 's' : ''}{search ? ` for "${search}"` : ''}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b' }}>
            <div style={{ width: 50, height: 50, borderWidth: '3px', borderStyle: 'solid', borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderLeftColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRightColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderTopColor: '#00B4D8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Syncing Jobs...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
            <AnimatePresence>
              {filtered.map((job, idx) => (
                <JobCard key={job.id} job={job} candidate={candidate} delay={Math.min(idx * 0.05, 0.5)} isDark={isDark} />
              ))}
            </AnimatePresence>

            {filtered.length === 0 && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem 2rem', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderRadius: 24, border: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
                <Search size={48} color="#475569" style={{ margin: '0 auto 1.5rem' }} />
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: isDark ? 'white' : '#0f172a', marginBottom: 8 }}>No matches found</p>
                <p style={{ fontSize: '0.95rem', color: isDark ? '#94a3b8' : '#475569', marginBottom: 24 }}>Try adjusting your search or location filters to find what you're looking for.</p>
                <button onClick={() => { setSearch(''); setLocationFilter(''); setDepartmentFilter(''); }} style={{ padding: '0.75rem 2rem', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: isDark ? 'white' : '#1e293b', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }} className="hover:bg-white/20">Clear All Filters</button>
              </motion.div>
            )}
          </div>
        )}
      </section>

      {/* ===== JOIN BANNER ===== */}
      {!candidate && (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem 6rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #03045E)', borderRadius: 32, padding: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -50, top: -50, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(40px)' }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 900, marginBottom: 12, letterSpacing: '-1px' }}>Ready to level up?</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', maxWidth: 500 }}>Create your The jobsync profile today. Upload your resume and let our AI match you with perfect opportunities instantly.</p>
            </div>
            <Link href="/careers/register" style={{ position: 'relative', zIndex: 2, background: 'white', color: '#00B4D8', padding: '1rem 2.5rem', borderRadius: 16, fontWeight: 800, fontSize: '1.125rem', textDecoration: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 10, transition: 'transform 0.2s' }} className="hover:scale-105">
              Create Profile <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      )}

      {/* ===== FOOTER ===== */}
      <footer style={{ background: isDark ? '#020617' : '#f1f5f9', color: '#64748b', padding: '4rem 2rem 2rem', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`, transition: 'all 0.3s' }}>
        <div className="footer-content" style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/loooo.jpeg" alt="The jobsync Logo" style={{ height: 28, width: 28, objectFit: 'contain', borderRadius: '50%' }} />
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: isDark ? 'white' : '#0f172a', transition: 'color 0.3s' }}>The jobsync</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
            <Link href="/login" style={{ color: isDark ? '#94a3b8' : '#475569', textDecoration: 'none' }} className="hover:text-[#0077B6]">Recruiter Login</Link>
            <Link href="/careers/register" style={{ color: isDark ? '#94a3b8' : '#475569', textDecoration: 'none' }} className="hover:text-[#0077B6]">Candidate Sign Up</Link>
          </div>
        </div>
        <div style={{ maxWidth: 1280, margin: '2rem auto 0', textAlign: 'center', fontSize: '0.85rem', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '2rem' }}>
          © 2026 The jobsync (Powered by CRM). All rights reserved.
        </div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width:768px) { 
          .hidden-mobile { display: none !important; } 
        }
        input::placeholder { color: #64748b; }
        
        .brand-text {
          display: inline;
        }
        .search-input-container {
          border-right: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
        }
        .stats-grid {
          display: grid !important;
          grid-template-columns: repeat(4, 1fr) !important;
          gap: 1rem !important;
        }
        
        @media(max-width: 640px) {
          .brand-text {
            display: none !important;
          }
          .search-input-container {
            border-right: none !important;
            border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'} !important;
            padding-bottom: 1rem !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
            margin-top: 2rem !important;
          }
          .footer-content {
            flex-direction: column !important;
            text-align: center !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}

function JobCard({ job, candidate, delay = 0, isRecommended = false, isDark = true }: { job: any; candidate: any, delay?: number, isRecommended?: boolean, isDark?: boolean }) {
  const router = useRouter();
  const { appliedJobs, applyToJob, requireCompleteProfile } = useCandidateAuth();
  const [applying, setApplying] = useState(false);
  const applied = appliedJobs?.has(job.id) || false;

  const handleApply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!candidate) { router.push('/careers/login'); return; }
    
    requireCompleteProfile(async () => {
      setApplying(true);
      await applyToJob(job.id);
      setApplying(false);
    });
  };

  const companyInitial = (job.client?.companyName || 'C')[0].toUpperCase();
  const hue = job.client?.companyName ? [...job.client.companyName].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360 : 200;

  const jLocation = job.location?.startsWith('{') 
    ? (() => { try { const l = JSON.parse(job.location); return [l.city, l.district, l.state, l.country].filter(Boolean).join(', '); } catch { return job.location; } })()
    : job.location;

  return (
    <motion.div
      onClick={() => router.push(`/careers/jobs/${job.id}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay }}
      style={{
        background: isRecommended ? (isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.02)') : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.95)'),
        border: `1px solid ${isRecommended ? 'rgba(168, 85, 247, 0.3)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')}`,
        borderRadius: 24,
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.02)',
        transition: 'all 0.3s ease'
      }}
      className={`hover:bg-white/5 hover:border-[#0077B6]/40 hover:-translate-y-1 transition-all duration-300 ${isRecommended ? 'shadow-[0_0_30px_rgba(168,85,247,0.1)]' : ''}`}
    >
      {isRecommended && (
        <div style={{ position: 'absolute', top: 0, right: 0, background: 'linear-gradient(135deg, #00B4D8, #0077B6)', color: 'white', padding: '0.3rem 1rem', fontSize: '0.75rem', fontWeight: 700, borderBottomLeftRadius: 16 }}>
          {job.matchPercentage ? `${job.matchPercentage}% Match` : 'Recommended'}
        </div>
      )}

      {/* Company header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: `hsl(${hue}, 70%, 15%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `hsl(${hue}, 80%, 70%)`, fontWeight: 800, fontSize: '1.25rem', flexShrink: 0, border: `1px solid hsl(${hue}, 50%, 25%)` }}>
            {companyInitial}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: isDark ? 'white' : '#0f172a', marginBottom: 4, transition: 'color 0.3s' }}>{job.client?.companyName || 'Confidential'}</div>
            <div style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.3s' }}>
              <MapPin size={12} color="#64748b" />{jLocation}
            </div>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isDark ? 'white' : '#1e293b', marginBottom: '1rem', lineHeight: 1.4, letterSpacing: '-0.3px', transition: 'color 0.3s' }}>{job.title}</h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {job.skills?.slice(0, 4).map((skill: string) => (
          <span key={skill} style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', color: isDark ? '#cbd5e1' : '#475569', borderRadius: 8, padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>{skill}</span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '1.5rem', transition: 'color 0.3s' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Briefcase size={14} color="#64748b" />{job.experience}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><DollarSign size={14} color="#64748b" />{job.salaryRange}</span>
      </div>

      <div style={{ marginTop: 'auto', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, paddingTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
          <Clock size={14} /> Recently Updated
        </span>

        {applied ? (
          <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(52,211,153,0.1)', padding: '0.4rem 1rem', borderRadius: 10 }}>✓ Applied</span>
        ) : (
          <button
            onClick={handleApply}
            disabled={applying}
            style={{
              background: applying ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') : 'linear-gradient(135deg, #0ea5e9, #0077B6)',
              color: applying ? '#94a3b8' : 'white',
              border: 'none', borderRadius: 10, padding: '0.5rem 1.25rem',
              fontWeight: 700, fontSize: '0.85rem', cursor: applying ? 'wait' : 'pointer',
              transition: 'all 0.2s', boxShadow: applying ? 'none' : '0 4px 15px rgba(14,165,233,0.3)',
            }}
            className={!applying ? "hover:scale-105" : ""}
          >
            {applying ? 'Sending...' : 'Apply Now'}
          </button>
        )}
      </div>
    </motion.div>
  );
}

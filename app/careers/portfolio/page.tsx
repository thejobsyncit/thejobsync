'use client';

import React, { useState, useEffect } from 'react';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { usePortalTheme } from '@/context/PortalThemeContext';
import CandidateDashboardLayout from '../DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Code,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  Save,
  Eye,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  X,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react';

/* ── Inline SVG Icons ────────────────────────────────── */
const GithubIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/* ── Types ────────────────────────────────────────────── */
interface PortfolioData {
  portfolioUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  leetcodeUrl: string;
  hackerrankUrl: string;
  codechefUrl: string;
  codeforcesUrl: string;
  designUrl: string;
  otherUrl: string;
}

/* ── Animation variants ───────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};
const fadeIn = {
  hidden: { opacity: 0, scale: 0.97 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45 } },
};

/* ══════════════════════════════════════════════════════ */
export default function PortfolioPage() {
  const { candidate, isLoading: authLoading } = useCandidateAuth();
  const { isDark } = usePortalTheme();

  const [formData, setFormData] = useState<PortfolioData>({
    portfolioUrl: '', githubUrl: '', linkedinUrl: '',
    leetcodeUrl: '', hackerrankUrl: '', codechefUrl: '',
    codeforcesUrl: '', designUrl: '', otherUrl: ''
  });

  const [savedData, setSavedData] = useState<PortfolioData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (candidate?.email) fetchPortfolioLinks();
  }, [candidate?.email]);

  const fetchPortfolioLinks = async () => {
    if (!candidate?.email) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/candidate-portfolio?email=${encodeURIComponent(candidate.email)}`);
      const resData = await res.json();
      if (resData.success && resData.portfolio) {
        const cleanData: PortfolioData = {
          portfolioUrl: resData.portfolio.portfolioUrl || '',
          githubUrl: resData.portfolio.githubUrl || '',
          linkedinUrl: resData.portfolio.linkedinUrl || '',
          leetcodeUrl: resData.portfolio.leetcodeUrl || '',
          hackerrankUrl: resData.portfolio.hackerrankUrl || '',
          codechefUrl: resData.portfolio.codechefUrl || '',
          codeforcesUrl: resData.portfolio.codeforcesUrl || '',
          designUrl: resData.portfolio.designUrl || '',
          otherUrl: resData.portfolio.otherUrl || ''
        };
        const hasAnyLink = Object.values(cleanData).some(v => v && v.trim() !== '');
        if (hasAnyLink) { setSavedData(cleanData); setFormData(cleanData); setIsEditing(false); }
        else { setSavedData(null); setIsEditing(false); }
      } else { setIsEditing(false); }
    } catch (err) { console.error('Fetch portfolio error:', err); setIsEditing(false); }
    finally { setLoading(false); }
  };

  const isValidUrl = (url: string): boolean => {
    if (!url || !url.trim()) return true;
    try {
      const trimmed = url.trim();
      const formatted = !/^https?:\/\//i.test(trimmed) ? 'https://' + trimmed : trimmed;
      const parsed = new URL(formatted);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch { return false; }
  };

  const formatUrlWithHttps = (url: string): string => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    return !/^https?:\/\//i.test(trimmed) ? 'https://' + trimmed : trimmed;
  };

  const handleChange = (key: keyof PortfolioData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (key === 'portfolioUrl' && !value.trim()) {
      setFieldErrors(prev => ({ ...prev, portfolioUrl: 'Portfolio Website URL is required.' }));
    } else if (value.trim()) {
      if (!isValidUrl(value)) {
        setFieldErrors(prev => ({ ...prev, [key]: 'Please enter a valid HTTP or HTTPS URL.' }));
      } else {
        const normalized = formatUrlWithHttps(value).toLowerCase().replace(/\/$/, '');
        try {
          const parsedUrl = new URL(normalized);
          const hostname = parsedUrl.hostname;
          if (key === 'githubUrl' && !hostname.includes('github.com')) {
            setFieldErrors(prev => ({ ...prev, [key]: 'Please enter a valid GitHub URL.' }));
          } else if (key === 'linkedinUrl' && !hostname.includes('linkedin.com')) {
            setFieldErrors(prev => ({ ...prev, [key]: 'Please enter a valid LinkedIn URL.' }));
          } else if (key === 'leetcodeUrl' && !hostname.includes('leetcode.com')) {
            setFieldErrors(prev => ({ ...prev, [key]: 'Please enter a valid LeetCode URL.' }));
          } else if (key === 'hackerrankUrl' && !hostname.includes('hackerrank.com')) {
            setFieldErrors(prev => ({ ...prev, [key]: 'Please enter a valid HackerRank URL.' }));
          } else {
            setFieldErrors(prev => { const u = { ...prev }; delete u[key]; return u; });
          }
        } catch (e) {
          setFieldErrors(prev => ({ ...prev, [key]: 'Please enter a valid HTTP or HTTPS URL.' }));
        }
      }
    } else {
      setFieldErrors(prev => { const u = { ...prev }; delete u[key]; return u; });
    }
  };

  const handleSaveLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null); setErrorMessage(null);
    const errors: Record<string, string> = {};
    const urlOccurrences: Record<string, string[]> = {};

    if (!formData.portfolioUrl || !formData.portfolioUrl.trim()) {
      errors.portfolioUrl = 'Portfolio Website URL is required.';
    }

    Object.keys(formData).forEach(k => {
      const key = k as keyof PortfolioData;
      const url = formData[key]?.trim();
      if (url) {
        if (!isValidUrl(url)) {
          errors[key] = 'Please enter a valid HTTP or HTTPS URL.';
        } else {
          const normalized = formatUrlWithHttps(url).toLowerCase().replace(/\/$/, '');
          
          // Domain-specific validation
          try {
            const parsedUrl = new URL(normalized);
            const hostname = parsedUrl.hostname;
            
            if (key === 'githubUrl' && !hostname.includes('github.com')) {
              errors[key] = 'Please enter a valid GitHub URL.';
            } else if (key === 'linkedinUrl' && !hostname.includes('linkedin.com')) {
              errors[key] = 'Please enter a valid LinkedIn URL.';
            } else if (key === 'leetcodeUrl' && !hostname.includes('leetcode.com')) {
              errors[key] = 'Please enter a valid LeetCode URL.';
            } else if (key === 'hackerrankUrl' && !hostname.includes('hackerrank.com')) {
              errors[key] = 'Please enter a valid HackerRank URL.';
            }
          } catch (e) {
            errors[key] = 'Please enter a valid HTTP or HTTPS URL.';
          }

          if (!urlOccurrences[normalized]) {
            urlOccurrences[normalized] = [];
          }
          urlOccurrences[normalized].push(key);
        }
      }
    });

    Object.values(urlOccurrences).forEach(keys => {
      if (keys.length > 1) {
        keys.forEach(k => {
          errors[k] = 'Duplicate URLs are not allowed.';
        });
      }
    });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage('Please fix highlighted errors before saving.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        email: candidate?.email,
        portfolioUrl: formatUrlWithHttps(formData.portfolioUrl),
        githubUrl: formatUrlWithHttps(formData.githubUrl),
        linkedinUrl: formatUrlWithHttps(formData.linkedinUrl),
        leetcodeUrl: formatUrlWithHttps(formData.leetcodeUrl),
        hackerrankUrl: formatUrlWithHttps(formData.hackerrankUrl),
        codechefUrl: formatUrlWithHttps(formData.codechefUrl),
        codeforcesUrl: formatUrlWithHttps(formData.codeforcesUrl),
        designUrl: formatUrlWithHttps(formData.designUrl),
        otherUrl: formatUrlWithHttps(formData.otherUrl)
      };
      const res = await fetch('/api/candidate-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resData = await res.json();
      if (resData.success && resData.portfolio) {
        const cleanData: PortfolioData = {
          portfolioUrl: resData.portfolio.portfolioUrl || '',
          githubUrl: resData.portfolio.githubUrl || '',
          linkedinUrl: resData.portfolio.linkedinUrl || '',
          leetcodeUrl: resData.portfolio.leetcodeUrl || '',
          hackerrankUrl: resData.portfolio.hackerrankUrl || '',
          codechefUrl: resData.portfolio.codechefUrl || '',
          codeforcesUrl: resData.portfolio.codeforcesUrl || '',
          designUrl: resData.portfolio.designUrl || '',
          otherUrl: resData.portfolio.otherUrl || ''
        };
        setSavedData(cleanData); setFormData(cleanData);
        setIsEditing(false); setIsPreview(false);
        setSuccessMessage('Portfolio links updated successfully!');
        setTimeout(() => setSuccessMessage(null), 4000);
      } else { setErrorMessage(resData.error || 'Failed to save portfolio links.'); }
    } catch { setErrorMessage('An unexpected error occurred while saving.'); }
    finally { setSaving(false); }
  };

  const handleCopy = (key: string, url: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  /* ── Loading ───────────────────────────────────────── */
  if (authLoading || loading) {
    return (
      <CandidateDashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="w-10 h-10 rounded-full border-4 border-[#0077B6]/20 border-t-[#00B4D8]"
          />
          <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">Loading Portfolio Profile...</p>
        </div>
      </CandidateDashboardLayout>
    );
  }

  const linkFields = [
    { key: 'portfolioUrl', label: 'Portfolio Website', icon: <Globe size={20} />, color: '#00B4D8', placeholder: 'https://yourportfolio.com', required: true },
    { key: 'githubUrl', label: 'GitHub', icon: <GithubIcon size={20} />, color: '#a855f7', placeholder: 'https://github.com/username', required: false },
    { key: 'linkedinUrl', label: 'LinkedIn', icon: <LinkedinIcon size={20} />, color: '#0284c7', placeholder: 'https://linkedin.com/in/username', required: false },
    { key: 'leetcodeUrl', label: 'LeetCode', icon: <Code size={20} />, color: '#f59e0b', placeholder: 'https://leetcode.com/username', required: false },
    { key: 'hackerrankUrl', label: 'HackerRank', icon: <Terminal size={20} />, color: '#10b981', placeholder: 'https://hackerrank.com/username', required: false },
  ];

  const cs = {
    section: `relative rounded-3xl border p-6 md:p-8 transition-all duration-300 ${
      isDark
        ? 'bg-white/[0.03] border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
        : 'bg-white border-slate-200/70 shadow-[0_4px_30px_rgba(0,0,0,0.04)]'
    }`,
    label: `text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`,
    input: (hasErr: boolean) => `w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200 ${
      isDark
        ? `bg-white/[0.06] border text-white placeholder-slate-500 ${hasErr ? 'border-red-500/60 focus:border-red-400' : 'border-white/10 focus:border-[#00B4D8]/60'}`
        : `bg-slate-50 border text-slate-900 placeholder-slate-400 ${hasErr ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#0077B6]'}`
    }`,
    card: `rounded-2xl p-5 border transition-all duration-300 group hover:scale-[1.02] ${
      isDark
        ? 'bg-white/[0.04] border-white/10 hover:border-[#0077B6]/35 hover:bg-white/[0.07]'
        : 'bg-slate-50 border-slate-200 hover:border-[#0077B6]/40 hover:bg-white hover:shadow-md'
    }`,
  };

  return (
    <CandidateDashboardLayout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto space-y-6 pb-10"
      >

        {/* ── Page Header ─────────────────────────────── */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0077B6]/30 bg-[#0077B6]/10 text-[#0077B6] text-[11px] font-black tracking-widest uppercase mb-3">
              <Sparkles size={11} className="animate-pulse" />
              Online Presence & Social Handles
            </div>
            <h1 className={`text-2xl md:text-3xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Candidate Portfolio Links
            </h1>
            <p className={`mt-1.5 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Connect your online profiles, repositories, and developer handles for recruiters.
            </p>
          </div>

          {savedData && !isEditing && (
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setIsPreview(!isPreview)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                isPreview
                  ? 'bg-[#0077B6]/15 text-[#00B4D8] border border-[#0077B6]/35'
                  : isDark ? 'bg-white/8 text-white border border-white/10 hover:bg-white/12' : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              {isPreview ? <X size={15} /> : <Eye size={15} />}
              {isPreview ? 'Exit Preview' : 'Preview Card'}
            </motion.button>
          )}
        </motion.div>

        {/* ── Notifications ───────────────────────────── */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-green-500/30 bg-green-500/10 text-green-500 font-bold text-sm"
            >
              <CheckCircle2 size={18} /> {successMessage}
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 font-bold text-sm"
            >
              <AlertCircle size={18} /> {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main Card ───────────────────────────────── */}
        <motion.div variants={fadeUp} className={cs.section}>

          {/* Card header */}
          <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
            <div>
              <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Verified Candidate Profiles
              </h2>
              <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Links visible and verified for recruiters.
              </p>
            </div>
            {!isEditing && savedData && (
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => { setIsEditing(true); setIsPreview(false); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white relative overflow-hidden shadow-[0_0_18px_rgba(0,119,182,0.3)] hover:shadow-[0_0_30px_rgba(0,119,182,0.45)] transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#0077B6] to-[#00B4D8]" />
                <Edit3 size={14} className="relative" /> <span className="relative">Edit Links</span>
              </motion.button>
            )}
          </div>

          {/* ── Empty State ─────────────────────────── */}
          {!isEditing && !savedData && (
            <motion.div
              variants={fadeIn}
              className={`flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border-2 border-dashed ${
                isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-[#0077B6]/10 border border-[#0077B6]/20 flex items-center justify-center text-[#00B4D8] mb-5"
              >
                <Globe size={32} />
              </motion.div>
              <h3 className={`text-lg font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                No portfolio links yet
              </h3>
              <p className={`text-sm font-medium mb-6 max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Add your portfolio, GitHub, LinkedIn, and competitive programming profiles to stand out to recruiters.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white relative overflow-hidden shadow-[0_0_24px_rgba(0,119,182,0.35)] hover:shadow-[0_0_36px_rgba(0,180,216,0.5)] transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#0077B6] to-[#00B4D8]" />
                <PlusCircle size={16} className="relative" />
                <span className="relative">Add Portfolio Links</span>
              </motion.button>
            </motion.div>
          )}

          {/* ── Saved Links Grid ────────────────────── */}
          {!isEditing && savedData && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {linkFields.map((field) => {
                const val = savedData[field.key as keyof PortfolioData];
                if (!val) return null;
                const isCopied = copiedKey === field.key;
                return (
                  <motion.div key={field.key} variants={fadeUp} className={cs.card}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${field.color}18`, color: field.color }}>
                        {field.icon}
                      </div>
                      <span className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{field.label}</span>
                    </div>

                    <div className={`px-3 py-2 rounded-xl mb-4 ${isDark ? 'bg-black/30 border border-white/8' : 'bg-white border border-slate-200'}`}>
                      <a href={val} target="_blank" rel="noopener noreferrer"
                        className="text-[#00B4D8] text-xs font-semibold break-all hover:underline">
                        {val}
                      </a>
                    </div>

                    <div className="flex gap-2">
                      <a href={val} target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-xs text-white relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-[#0077B6] to-[#00B4D8]" />
                        <ExternalLink size={12} className="relative" />
                        <span className="relative">Open</span>
                      </a>
                      <button onClick={() => handleCopy(field.key, val)}
                        className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all duration-200 ${
                          isCopied
                            ? 'bg-green-500/15 border border-green-500/30 text-green-500'
                            : isDark ? 'bg-white/8 border border-white/10 text-white hover:bg-white/15' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}>
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                        {isCopied ? 'Copied!' : 'Copy'}
                      </button>
                      <button onClick={() => { setIsEditing(true); setIsPreview(false); }}
                        className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all duration-200 ${
                          isDark ? 'bg-white/8 border border-white/10 text-white hover:bg-white/15' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}>
                        <Edit3 size={12} /> Edit
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ── Edit Form ───────────────────────────── */}
          <AnimatePresence>
            {isEditing && (
              <motion.form
                key="edit-form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                onSubmit={handleSaveLinks}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {linkFields.map(field => {
                    const val = formData[field.key as keyof PortfolioData] || '';
                    const err = fieldErrors[field.key];
                    return (
                      <div key={field.key} className="flex flex-col gap-2">
                        <label className={cs.label}>
                          <span className="flex items-center gap-2" style={{ color: field.color }}>
                            {field.icon}
                            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </span>
                          </span>
                        </label>
                        <input
                          type="url"
                          value={val}
                          placeholder={field.placeholder}
                          onChange={e => handleChange(field.key as keyof PortfolioData, e.target.value)}
                          className={cs.input(!!err)}
                        />
                        <AnimatePresence>
                          {err && (
                            <motion.span
                              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              className="text-red-400 text-xs font-semibold"
                            >
                              {err}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className={`flex items-center justify-end gap-3 pt-5 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <motion.button
                    type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { if (savedData) setFormData(savedData); setIsEditing(false); }}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      isDark ? 'bg-white/8 text-white border border-white/10 hover:bg-white/15' : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white relative overflow-hidden shadow-[0_0_18px_rgba(0,119,182,0.35)] hover:shadow-[0_0_30px_rgba(0,180,216,0.5)] disabled:opacity-60 transition-all duration-300"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#0077B6] to-[#00B4D8]" />
                    {saving
                      ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="relative w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                      : <Save size={14} className="relative" />
                    }
                    <span className="relative">{saving ? 'Saving...' : 'Save Links'}</span>
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Preview Card ────────────────────────────── */}
        <AnimatePresence>
          {isPreview && savedData && (
            <motion.div
              key="preview-card"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`rounded-3xl border p-6 md:p-8 ${
                isDark
                  ? 'bg-gradient-to-br from-[#03045E]/40 to-[#010a18]/60 border-[#0077B6]/25'
                  : 'bg-gradient-to-br from-blue-50 to-white border-[#0077B6]/20'
              }`}
            >
              {/* Recruiter view header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#0077B6]/15 border border-[#0077B6]/25 flex items-center justify-center text-[#00B4D8]">
                  <LinkIcon size={18} />
                </div>
                <div>
                  <h3 className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Recruiter View — Portfolio Card</h3>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>This is how your links appear to recruiters</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {linkFields.map(field => {
                  const val = savedData[field.key as keyof PortfolioData];
                  if (!val) return null;
                  return (
                    <motion.a
                      key={field.key}
                      href={val} target="_blank" rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border transition-all duration-200 ${
                        isDark
                          ? 'bg-white/[0.06] border-white/15 text-white hover:border-[#0077B6]/40'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-[#0077B6]/40 shadow-sm'
                      }`}
                    >
                      <span style={{ color: field.color }}>{field.icon}</span>
                      {field.label}
                      <ExternalLink size={12} className="text-slate-400" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </CandidateDashboardLayout>
  );
}

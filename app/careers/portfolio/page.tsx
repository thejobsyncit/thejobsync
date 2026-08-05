'use client';

import React, { useState, useEffect } from 'react';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { usePortalTheme } from '@/context/PortalThemeContext';
import CandidateDashboardLayout from '../DashboardLayout';
import {
  Globe,
  Code,
  Terminal,
  Cpu,
  Palette,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  Save,
  Eye,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Sparkles,
  Layers
} from 'lucide-react';

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

export default function PortfolioPage() {
  const { candidate, isLoading: authLoading } = useCandidateAuth();
  const { isDark } = usePortalTheme();

  const [formData, setFormData] = useState<PortfolioData>({
    portfolioUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    leetcodeUrl: '',
    hackerrankUrl: '',
    codechefUrl: '',
    codeforcesUrl: '',
    designUrl: '',
    otherUrl: ''
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
    if (candidate?.email) {
      fetchPortfolioLinks();
    }
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

        const hasAnyLink = Object.values(cleanData).some(val => val && val.trim() !== '');

        if (hasAnyLink) {
          setSavedData(cleanData);
          setFormData(cleanData);
          setIsEditing(false);
        } else {
          setSavedData(null);
          setIsEditing(false);
        }
      } else {
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Fetch portfolio error:', err);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (url: string): boolean => {
    if (!url || !url.trim()) return true;
    try {
      const trimmed = url.trim();
      let formatted = trimmed;
      if (!/^https?:\/\//i.test(trimmed)) {
        formatted = 'https://' + trimmed;
      }
      const parsed = new URL(formatted);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const formatUrlWithHttps = (url: string): string => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (!/^https?:\/\//i.test(trimmed)) {
      return 'https://' + trimmed;
    }
    return trimmed;
  };

  const handleChange = (key: keyof PortfolioData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));

    if (key === 'portfolioUrl' && !value.trim()) {
      setFieldErrors(prev => ({ ...prev, portfolioUrl: 'Portfolio Website URL is required.' }));
    } else if (value.trim() && !isValidUrl(value)) {
      setFieldErrors(prev => ({ ...prev, [key]: 'Please enter a valid HTTP or HTTPS URL (e.g. https://example.com).' }));
    } else {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const handleSaveLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const errors: Record<string, string> = {};
    if (!formData.portfolioUrl || !formData.portfolioUrl.trim()) {
      errors.portfolioUrl = 'Portfolio Website URL is required.';
    }

    Object.keys(formData).forEach(k => {
      const key = k as keyof PortfolioData;
      const val = formData[key];
      if (val && val.trim() && !isValidUrl(val)) {
        errors[key] = 'Please enter a valid HTTP or HTTPS URL.';
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage('Please fix highlighted errors before saving.');
      return;
    }

    setSaving(true);
    try {
      const formattedPayload = {
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
        body: JSON.stringify(formattedPayload)
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
        setSavedData(cleanData);
        setFormData(cleanData);
        setIsEditing(false);
        setIsPreview(false);
        setSuccessMessage('Portfolio links updated successfully!');
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(resData.error || 'Failed to save portfolio links.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = (key: string, url: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  if (authLoading || loading) {
    return (
      <CandidateDashboardLayout>
        <div style={{ padding: '4rem', textAlign: 'center', color: isDark ? '#94a3b8' : '#64748b' }}>
          Loading Portfolio Profile...
        </div>
      </CandidateDashboardLayout>
    );
  }

  const linkFields = [
    { key: 'portfolioUrl', label: 'Portfolio Website URL', icon: <Globe size={20} color="#00B4D8" />, placeholder: 'https://yourportfolio.com', required: true },
    { key: 'githubUrl', label: 'GitHub URL', icon: <GithubIcon size={20} color="#a855f7" />, placeholder: 'https://github.com/username', required: false },
    { key: 'linkedinUrl', label: 'LinkedIn URL', icon: <LinkedinIcon size={20} color="#0284c7" />, placeholder: 'https://linkedin.com/in/username', required: false },
    { key: 'leetcodeUrl', label: 'LeetCode Profile URL', icon: <Code size={20} color="#f59e0b" />, placeholder: 'https://leetcode.com/username', required: false },
    { key: 'hackerrankUrl', label: 'HackerRank Profile URL', icon: <Terminal size={20} color="#10b981" />, placeholder: 'https://hackerrank.com/username', required: false }
  ];

  return (
    <CandidateDashboardLayout>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00B4D8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Online Presence & Social Handles
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', margin: '4px 0 0 0' }}>
              Candidate Portfolio Links
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#64748b' }}>
              Connect your existing online profiles, code repositories, and developer profiles for recruiters.
            </p>
          </div>

          {/* Requirement #1 & #2: Top Section Header contains ONLY Preview Card button */}
          {savedData && !isEditing && (
            <button
              onClick={() => setIsPreview(!isPreview)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 12,
                background: isPreview ? 'rgba(56, 189, 248, 0.15)' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
                color: isPreview ? '#38bdf8' : (isDark ? '#ffffff' : '#0f172a'),
                border: `1px solid ${isPreview ? 'rgba(56, 189, 248, 0.4)' : 'transparent'}`,
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Eye size={16} /> {isPreview ? 'Exit Preview' : 'Preview Card'}
            </button>
          )}
        </div>

        {/* Notifications */}
        {successMessage && (
          <div style={{ padding: '1rem 1.25rem', borderRadius: 14, background: 'rgba(34, 197, 94, 0.15)', border: '1.5px solid rgba(34, 197, 94, 0.3)', color: '#22c55e', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 size={20} /> {successMessage}
          </div>
        )}

        {errorMessage && (
          <div style={{ padding: '1rem 1.25rem', borderRadius: 14, background: 'rgba(239, 68, 68, 0.15)', border: '1.5px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={20} /> {errorMessage}
          </div>
        )}

        {/* Verified Candidate Profiles Main Card */}
        <div style={{ padding: '2rem', borderRadius: 24, background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff', border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'}`, marginBottom: '2rem' }}>
          
          {/* Section Header */}
          <div style={{ marginBottom: isEditing ? '1.5rem' : '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', margin: 0 }}>
              Verified Candidate Profiles
            </h2>
            <p style={{ margin: '4px 0 1rem 0', fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#64748b' }}>
              Links verified and visible to recruiters.
            </p>

            {/* Requirement #3 & #4: Edit Links button below heading and description */}
            {!isEditing && savedData && (
              <button
                onClick={() => { setIsEditing(true); setIsPreview(false); }}
                style={{
                  padding: '0.65rem 1.35rem',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(0, 180, 216, 0.3)'
                }}
              >
                <Edit3 size={16} /> Edit Links
              </button>
            )}
          </div>

          {/* Requirement #10: Empty State when no links saved */}
          {!isEditing && !savedData && (
            <div style={{
              padding: '2.5rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              borderRadius: 18,
              background: isDark ? 'rgba(30, 41, 59, 0.4)' : '#f8fafc',
              border: `1.5px dashed ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1'}`
            }}>
              <Globe size={44} color="#00B4D8" style={{ marginBottom: '0.85rem', opacity: 0.85 }} />
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '1rem' }}>
                No portfolio or professional profile links have been added yet.
              </div>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '0.75rem 1.65rem',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(0, 180, 216, 0.3)'
                }}
              >
                <PlusCircle size={18} /> Add Portfolio Links
              </button>
            </div>
          )}

          {/* Requirement #8 & #9: Display saved links inside Verified Candidate Profiles card */}
          {!isEditing && savedData && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
              {linkFields.map((field) => {
                const val = savedData[field.key as keyof PortfolioData];
                if (!val) return null;
                const isCopied = copiedKey === field.key;

                return (
                  <div
                    key={field.key}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 18,
                      background: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc',
                      border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        {field.icon}
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: isDark ? '#ffffff' : '#0f172a' }}>
                          {field.label.replace(' URL', '')}
                        </span>
                      </div>

                      <div style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 10,
                        background: isDark ? 'rgba(15, 23, 42, 0.7)' : '#ffffff',
                        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'}`,
                        marginBottom: '1.25rem'
                      }}>
                        <a
                          href={val}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.825rem',
                            fontWeight: 600,
                            color: '#00B4D8',
                            textDecoration: 'none',
                            wordBreak: 'break-all'
                          }}
                        >
                          {val}
                        </a>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <a
                        href={val}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          padding: '0.55rem',
                          borderRadius: 10,
                          background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
                          color: '#ffffff',
                          textDecoration: 'none',
                          fontWeight: 700,
                          fontSize: '0.8125rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6
                        }}
                      >
                        Open Link <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => handleCopy(field.key, val)}
                        style={{
                          padding: '0.55rem 0.85rem',
                          borderRadius: 10,
                          background: isCopied ? 'rgba(34, 197, 94, 0.15)' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
                          color: isCopied ? '#22c55e' : (isDark ? '#ffffff' : '#0f172a'),
                          border: `1px solid ${isCopied ? 'rgba(34, 197, 94, 0.3)' : 'transparent'}`,
                          fontWeight: 700,
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        {isCopied ? <Check size={14} /> : <Copy size={14} />} {isCopied ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={() => { setIsEditing(true); setIsPreview(false); }}
                        style={{
                          padding: '0.55rem 0.85rem',
                          borderRadius: 10,
                          background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                          color: isDark ? '#ffffff' : '#0f172a',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Requirement #5, #6, #7: Expanded Professional Form when editing */}
          {isEditing && (
            <form onSubmit={handleSaveLinks} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {linkFields.map(field => {
                  const val = formData[field.key as keyof PortfolioData] || '';
                  const err = fieldErrors[field.key];

                  return (
                    <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {field.icon} {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                        </span>
                      </label>
                      <input
                        type="url"
                        value={val}
                        placeholder={field.placeholder}
                        onChange={(e) => handleChange(field.key as keyof PortfolioData, e.target.value)}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: 12,
                          background: isDark ? 'rgba(30, 41, 59, 0.6)' : '#f8fafc',
                          border: `1.5px solid ${err ? '#ef4444' : (isDark ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1')}`,
                          color: isDark ? '#ffffff' : '#0f172a',
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                      />
                      {err && <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600 }}>{err}</span>}
                    </div>
                  );
                })}
              </div>

              {/* Requirement #7: Save Links & Cancel Buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}>
                <button
                  type="button"
                  onClick={() => {
                    if (savedData) setFormData(savedData);
                    setIsEditing(false);
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: 12,
                    background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                    color: isDark ? '#ffffff' : '#0f172a',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '0.75rem 1.75rem',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(0, 180, 216, 0.3)'
                  }}
                >
                  <Save size={18} /> {saving ? 'Saving Links...' : 'Save Links'}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </CandidateDashboardLayout>
  );
}

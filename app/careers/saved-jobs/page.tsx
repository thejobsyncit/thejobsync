'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { Bookmark, MapPin, DollarSign, Briefcase, Clock, Trash2, Zap } from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import { motion } from 'framer-motion';
import { usePortalTheme } from '@/context/PortalThemeContext';

export default function SavedJobsPage() {
  const { isDark } = usePortalTheme();
  const { candidate, isAuthenticated, isLoading } = useCandidateAuth();
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/careers/login');
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!candidate) return;
    fetch(`/api/candidate-auth/saved-jobs?candidateAccountId=${candidate.id}`)
      .then(r => r.json())
      .then(data => { setSavedJobs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [candidate]);

  const handleRemove = async (jobId: string) => {
    try {
      const res = await fetch(`/api/candidate-auth/saved-jobs?jobId=${jobId}&candidateAccountId=${candidate?.id}`, { method: 'DELETE' });
      if (res.ok) {
        setSavedJobs(jobs => jobs.filter(j => j.requirementId !== jobId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!candidate) return null;

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? 'white' : '#0f172a', marginBottom: 8, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Bookmark size={28} color="#38bdf8" /> Saved Jobs
        </h1>
        <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '1rem' }}>Jobs you've bookmarked for later. Don't wait too long to apply!</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: isDark ? '#94a3b8' : '#64748b' }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderTopColor: '#00B4D8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          Loading your saved jobs...
        </div>
      ) : savedJobs.length === 0 ? (
        <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 24, padding: '5rem 2rem', textAlign: 'center' }}>
          <Bookmark size={56} color="#475569" style={{ margin: '0 auto 1.5rem' }} />
          <h3 style={{ fontWeight: 800, color: isDark ? 'white' : '#0f172a', fontSize: '1.25rem', marginBottom: 10 }}>Your wishlist is empty</h3>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', marginBottom: '2rem' }}>Browse open positions and bookmark the ones you like.</p>
          <Link href="/careers" style={{ background: 'linear-gradient(135deg,#0ea5e9,#0077B6)', color: 'white', padding: '1rem 2.5rem', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: '1.05rem', boxShadow: '0 10px 20px rgba(14,165,233,0.3)' }} className="hover:scale-105 inline-block transition-transform">Explore Jobs</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {savedJobs.map((saved, i) => {
            const job = saved.requirement;
            const hue = job?.client?.companyName ? [...job.client.companyName].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360 : 200;

            return (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={saved.id} style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column', position: 'relative' }} className="hover:bg-[#0077B6]/5 hover:border-[#0077B6]/40 transition-all">
                <button onClick={() => handleRemove(job.id)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', zIndex: 10 }} className="hover:bg-red-500 hover:text-white transition-colors" title="Remove from saved">
                  <Trash2 size={16} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `hsl(${hue}, 70%, 15%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.15rem', color: `hsl(${hue}, 80%, 70%)`, flexShrink: 0, border: `1px solid hsl(${hue}, 50%, 25%)` }}>
                    {(job?.client?.companyName || 'J')[0]}
                  </div>
                  <div style={{ paddingRight: 40 }}>
                    <Link href={`/careers/jobs/${job?.id}`} style={{ fontWeight: 800, fontSize: '1.1rem', color: isDark ? 'white' : '#0f172a', textDecoration: 'none' }} className="hover:text-[#00B4D8] transition-colors line-clamp-1">
                      {job?.title}
                    </Link>
                    <p style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job?.client?.companyName}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1.5rem', flex: 1 }}>
                  {job.location && <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={16} color="#64748b" />{job.location.startsWith('{') ? (() => { try { const l = JSON.parse(job.location); return [l.city, l.district, l.state, l.country].filter(Boolean).join(', '); } catch { return job.location; } })() : job.location}</span>}
                  {job.salaryRange && <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><DollarSign size={16} color="#64748b" />{job.salaryRange}</span>}
                  {job.experience && <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Briefcase size={16} color="#64748b" />{job.experience}</span>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, paddingTop: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> Saved {new Date(saved.savedAt).toLocaleDateString()}
                  </span>
                  <Link href={`/careers/jobs/${job?.id}`} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #0ea5e9, #0077B6)', color: 'white', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }} className="hover:scale-105 transition-transform">
                    <Zap size={14} /> Apply
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </DashboardLayout>
  );
}

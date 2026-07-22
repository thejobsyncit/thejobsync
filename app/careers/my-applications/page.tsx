'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle, XCircle, Phone, Star, AlertCircle } from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import { motion } from 'framer-motion';
import { usePortalTheme } from '@/context/PortalThemeContext';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  applied:             { label: 'Applied',            color: '#00B4D8', bg: 'rgba(56,189,248,0.1)', icon: <Clock size={14} /> },
  new:                 { label: 'Applied',            color: '#00B4D8', bg: 'rgba(56,189,248,0.1)', icon: <Clock size={14} /> },
  shortlisted:         { label: 'Shortlisted',        color: '#00B4D8', bg: 'rgba(129,140,248,0.1)', icon: <Star size={14} /> },
  interview_scheduled: { label: 'Interview Scheduled',color: '#fcd34d', bg: 'rgba(252,211,77,0.1)', icon: <Phone size={14} /> },
  interviewing:        { label: 'Interviewing',       color: '#fb923c', bg: 'rgba(251,146,60,0.1)', icon: <Phone size={14} /> },
  interviewed:         { label: 'Interviewed',        color: '#00B4D8', bg: 'rgba(14,165,233,0.1)', icon: <Phone size={14} /> },
  selected:            { label: 'Selected 🎉',        color: '#34d399', bg: 'rgba(52,211,153,0.1)', icon: <CheckCircle size={14} /> },
  offered:             { label: 'Offer Sent',         color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: <CheckCircle size={14} /> },
  offer_accepted:      { label: 'Offer Accepted 🎉',  color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: <CheckCircle size={14} /> },
  joined:              { label: 'Joined',             color: '#14b8a6', bg: 'rgba(20,184,166,0.1)', icon: <CheckCircle size={14} /> },
  rejected:            { label: 'Not Selected',       color: '#f87171', bg: 'rgba(248,113,113,0.1)', icon: <XCircle size={14} /> },
  withdrawn:           { label: 'Withdrawn',          color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', icon: <XCircle size={14} /> },
};

export default function MyApplicationsPage() {
  const { candidate, isAuthenticated, isLoading } = useCandidateAuth();
  const { isDark } = usePortalTheme();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/careers/login');
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!candidate) return;
    fetch(`/api/candidate-auth/applications?candidateAccountId=${candidate.id}`)
      .then(r => r.json())
      .then(data => { setApplications(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [candidate]);

  const handleAcceptOffer = async (appId: string) => {
    try {
      const res = await fetch(`/api/candidate-auth/applications/${appId}/accept`, { method: 'POST' });
      if (res.ok) {
        setApplications(apps => apps.map(a => a.id === appId ? { ...a, status: 'offer_accepted' } : a));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectOffer = async (appId: string) => {
    try {
      const res = await fetch(`/api/candidate-auth/applications/${appId}/reject`, { method: 'POST' });
      if (res.ok) {
        setApplications(apps => apps.map(a => a.id === appId ? { ...a, status: 'rejected' } : a));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const stats = {
    total: applications.length,
    shortlisted: applications.filter(a => a.status === 'shortlisted' || a.status === 'interviewing').length,
    selected: applications.filter(a => a.status === 'selected' || a.status === 'offered' || a.status === 'joined').length,
    pending: applications.filter(a => a.status === 'applied' || a.status === 'new').length,
  };

  if (!candidate) return null;

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? 'white' : '#0f172a', marginBottom: 8, letterSpacing: '-0.5px' }}>My Applications</h1>
        <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '1rem' }}>Track the status of all your job applications in real-time.</p>
      </div>

      {/* Stats */}
      <div className="apps-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Total Applied', value: stats.total, color: '#00B4D8' },
          { label: 'In Progress', value: stats.shortlisted, color: '#fb923c' },
          { label: 'Selected / Offered', value: stats.selected, color: '#34d399' },
          { label: 'Pending Review', value: stats.pending, color: '#00B4D8' },
        ].map((s, i) => (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={s.label} style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 20, padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: s.color, marginBottom: 8 }}>{s.value}</div>
            <div style={{ fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Applications list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: isDark ? '#94a3b8' : '#64748b' }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderTopColor: '#00B4D8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          Loading your applications...
        </div>
      ) : applications.length === 0 ? (
        <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 24, padding: '5rem 2rem', textAlign: 'center' }}>
          <AlertCircle size={56} color="#475569" style={{ margin: '0 auto 1.5rem' }} />
          <h3 style={{ fontWeight: 800, color: isDark ? 'white' : '#0f172a', fontSize: '1.25rem', marginBottom: 10 }}>No applications yet</h3>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', marginBottom: '2rem' }}>Start applying to your dream jobs today!</p>
          <Link href="/careers" style={{ background: 'linear-gradient(135deg,#0ea5e9,#0077B6)', color: 'white', padding: '1rem 2.5rem', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: '1.05rem', boxShadow: '0 10px 20px rgba(14,165,233,0.3)' }} className="hover:scale-105 inline-block transition-transform">Browse Jobs</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {applications.map((app, i) => {
            const s = STATUS_CONFIG[app.status] || STATUS_CONFIG['applied'];
            const job = app.requirement;
            const hue = job?.client?.companyName ? [...job.client.companyName].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360 : 200;

            return (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={app.id} style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 20, padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }} className="app-card hover:bg-[#0077B6]/5 transition-colors">
                <div className="app-card-left" style={{ flex: 1, minWidth: 300 }}>
                  <div className="app-card-header" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1rem' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `hsl(${hue}, 70%, 15%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', color: `hsl(${hue}, 80%, 70%)`, flexShrink: 0, border: `1px solid hsl(${hue}, 50%, 25%)` }}>
                      {(job?.client?.companyName || 'J')[0]}
                    </div>
                    <div>
                      <Link href={`/careers/jobs/${job?.id}`} style={{ fontWeight: 800, fontSize: '1.15rem', color: isDark ? 'white' : '#0f172a', textDecoration: 'none' }} className="hover:text-[#00B4D8] transition-colors">
                        {job?.title || 'General Application'}
                      </Link>
                      <p style={{ fontSize: '0.95rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: 4 }}>{job?.client?.companyName || 'Confidential Company'}</p>
                    </div>
                  </div>

                  {job && (
                    <div className="app-meta" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.85rem', color: isDark ? '#cbd5e1' : '#475569' }}>
                      {job.location && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} color="#64748b" />{job.location.startsWith('{') ? (() => { try { const l = JSON.parse(job.location); return [l.city, l.district, l.state, l.country].filter(Boolean).join(', '); } catch { return job.location; } })() : job.location}</span>}
                      {job.salaryRange && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><DollarSign size={14} color="#64748b" />{job.salaryRange}</span>}
                      {job.experience && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Briefcase size={14} color="#64748b" />{job.experience}</span>}
                    </div>
                  )}

                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={14} />Applied on {new Date(app.appliedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>

                {/* Status Section */}
                <div className="app-card-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', minWidth: 200 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, background: s.bg, color: s.color, border: `1px solid ${s.color}40`, borderRadius: 12, padding: '0.5rem 1.25rem', fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {s.icon}{s.label}
                  </span>
                  
                  {app.status === 'applied' && (
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Awaiting HR review</span>
                  )}
                  {app.status === 'offered' && (
                    <div className="offer-btns" style={{ display: 'flex', gap: '0.5rem', marginTop: 8 }}>
                      <button 
                        onClick={() => handleRejectOffer(app.id)}
                        style={{ background: 'transparent', color: '#f87171', padding: '0.75rem 1.25rem', borderRadius: 10, fontSize: '0.9rem', fontWeight: 800, border: '1px solid #f87171', cursor: 'pointer' }}
                        className="hover:bg-red-500/10 transition-colors"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleAcceptOffer(app.id)}
                        style={{ background: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 10, fontSize: '0.9rem', fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px rgba(16,185,129,0.3)' }}
                        className="hover:scale-105 transition-transform"
                      >
                        Accept Offer
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .apps-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 1rem !important; }
          .app-card { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; padding: 1.25rem !important; }
          .app-card-left { min-width: unset !important; width: 100% !important; }
          .app-card-right { align-items: flex-start !important; min-width: unset !important; width: 100% !important; flex-direction: row !important; flex-wrap: wrap !important; gap: 0.75rem !important; }
          .app-meta { flex-wrap: wrap !important; gap: 0.75rem !important; }
          .offer-btns { flex-direction: row !important; flex-wrap: wrap !important; }
        }
        @media (max-width: 480px) {
          .apps-stats-grid { grid-template-columns: 1fr 1fr !important; gap: 0.75rem !important; }
          .app-card-header { flex-wrap: wrap !important; }
        }
      `}</style>
    </DashboardLayout>
  );
}

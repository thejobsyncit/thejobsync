'use client';

import Link from 'next/link';
import { MapPin, Briefcase, DollarSign, Clock, Users, ArrowLeft, Building2 } from 'lucide-react';
import ApplyButton from '@/components/ApplyButton';
import SaveJobButton from '@/components/SaveJobButton';
import { formatLocation } from '@/lib/utils';
import { usePortalTheme } from '@/context/PortalThemeContext';

export default function JobDetailsClient({ job, similarJobs, skills, companyInitial, hue }: {
  job: any;
  similarJobs: any[];
  skills: string[];
  companyInitial: string;
  hue: number;
}) {
  const { isDark } = usePortalTheme();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isDark ? '#0f172a' : '#f8fafc', 
      color: isDark ? '#f8fafc' : '#1e293b', 
      fontFamily: 'var(--font-inter, Inter, sans-serif)', 
      paddingBottom: '6rem',
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>
      
      {/* Top Navigation Bar */}
      <nav style={{ 
        background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.85)', 
        backdropFilter: 'blur(12px)', 
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, 
        position: 'sticky', top: 0, zIndex: 100,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/careers" style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDark ? '#94a3b8' : '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }} className={isDark ? "hover:text-white" : "hover:text-black"}>
            <ArrowLeft size={18} /> Back to Jobs
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '3rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }} className="job-details-grid">
        
        {/* Main Content (Left) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header */}
          <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.95)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 24, padding: '2.5rem', boxShadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: `hsl(${hue}, 70%, 15%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `hsl(${hue}, 80%, 70%)`, fontWeight: 800, fontSize: '2rem', border: `1px solid hsl(${hue}, 50%, 25%)` }}>
                {companyInitial}
              </div>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? 'white' : '#0f172a', marginBottom: 8, letterSpacing: '-0.5px' }}>{job.title}</h1>
                <Link href={`/careers/company/${job.client?.id}`} style={{ fontSize: '1.1rem', color: isDark ? '#00B4D8' : '#0077B6', textDecoration: 'none', fontWeight: 600 }} className="hover:underline">
                  {job.client?.companyName}
                </Link>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.95rem', color: isDark ? '#cbd5e1' : '#475569', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={18} color="#94a3b8" /> {formatLocation(job.location)}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Briefcase size={18} color="#94a3b8" /> {job.experience}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><DollarSign size={18} color="#94a3b8" /> {job.salaryRange}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={18} color="#94a3b8" /> Posted Recently</span>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <ApplyButton jobId={job.id} />
              <SaveJobButton jobId={job.id} />
            </div>
          </div>

          {/* Description */}
          <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.95)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 24, padding: '2.5rem', boxShadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? 'white' : '#0f172a', marginBottom: '1.5rem' }}>Job Description</h2>
            <div style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '1rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {job.description}
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: isDark ? 'white' : '#0f172a', marginTop: '2.5rem', marginBottom: '1rem' }}>Required Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {skills.map((skill: string) => (
                <span key={skill} style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: isDark ? '#cbd5e1' : '#475569', borderRadius: 8, padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 600 }}>{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Company Snapshot */}
          <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.95)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 24, padding: '2rem', boxShadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? 'white' : '#0f172a', marginBottom: '1.5rem' }}>About the Company</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: isDark ? '#94a3b8' : '#475569', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <Building2 size={18} color="#64748b" style={{ flexShrink: 0 }} />
                <span>{job.client?.companyName}</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <MapPin size={18} color="#64748b" style={{ flexShrink: 0 }} />
                <span>{job.client?.address}</span>
              </div>
              {job.client?.website && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <Users size={18} color="#64748b" style={{ flexShrink: 0 }} />
                  <a href={job.client.website} target="_blank" rel="noreferrer" style={{ color: isDark ? '#00B4D8' : '#0077B6', textDecoration: 'none' }} className="hover:underline">Visit Website</a>
                </div>
              )}
            </div>
            <Link href={`/careers/company/${job.client?.id}`} style={{ display: 'inline-block', marginTop: '1.5rem', color: isDark ? '#00B4D8' : '#0077B6', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }} className="hover:underline">
              View full company profile →
            </Link>
          </div>

          {/* Similar Jobs */}
          {similarJobs.length > 0 && (
            <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.95)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 24, padding: '2rem', boxShadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? 'white' : '#0f172a', marginBottom: '1.5rem' }}>Similar Openings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {similarJobs.map(sj => (
                  <Link key={sj.id} href={`/careers/jobs/${sj.id}`} style={{ textDecoration: 'none' }} className="group">
                    <div style={{ fontWeight: 700, color: isDark ? 'white' : '#0f172a', fontSize: '1.05rem', marginBottom: 4, transition: 'color 0.2s' }} className="group-hover:text-[#0077B6]">{sj.title}</div>
                    <div style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', display: 'flex', gap: 12 }}>
                      <span>{formatLocation(sj.location)}</span>
                      <span>•</span>
                      <span>{sj.experience}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      <style>{`
        @media(max-width: 900px) {
          .job-details-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

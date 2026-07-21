import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Globe, Mail, Building2, Briefcase, ArrowLeft } from 'lucide-react';

export default async function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await prisma.client.findUnique({
    where: { id }
  });

  if (!company) return notFound();

  const openJobs = await prisma.jobRequirement.findMany({
    where: { clientId: id, status: 'open' }
  });

  const companyInitial = (company.companyName || 'C')[0].toUpperCase();
  const hue = company.companyName ? [...company.companyName].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360 : 200;

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: 'var(--font-inter, Inter, sans-serif)', paddingBottom: '6rem' }}>
      
      {/* Top Navigation Bar */}
      <nav style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/careers" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }} className="hover:text-white">
            <ArrowLeft size={18} /> Back to Jobs
          </Link>
        </div>
      </nav>

      {/* Hero Banner */}
      <div style={{ height: 250, background: `linear-gradient(135deg, hsl(${hue}, 40%, 15%), hsl(${hue}, 60%, 25%))`, position: 'relative' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', height: '100%' }}>
          <div style={{ position: 'absolute', bottom: -50, left: '1.5rem', display: 'flex', alignItems: 'flex-end', gap: '1.5rem' }}>
            <div style={{ width: 120, height: 120, borderRadius: 24, background: `hsl(${hue}, 70%, 15%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `hsl(${hue}, 80%, 70%)`, fontWeight: 900, fontSize: '3.5rem', border: '4px solid #0f172a', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              {companyInitial}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '5rem 1.5rem 3rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }} className="company-details-grid">
        
        {/* Main Content (Left) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: 8, letterSpacing: '-0.5px' }}>{company.companyName}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00B4D8', fontWeight: 600, fontSize: '1.1rem' }}>
              <Building2 size={20} /> {company.industry}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>About Us</h2>
            <div style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {company.notes || `${company.companyName} is a leading organization in the ${company.industry} sector. We are always looking for top talent to join our innovative teams and drive the future of our industry.`}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Briefcase size={24} color="#38bdf8" /> Open Positions ({openJobs.length})
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {openJobs.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px dashed rgba(255,255,255,0.1)', color: '#64748b' }}>
                  No open positions currently available.
                </div>
              ) : (
                openJobs.map(job => (
                  <Link key={job.id} href={`/careers/jobs/${job.id}`} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="hover:bg-white/5 hover:border-[#0077B6]/50 transition-all group">
                    <div>
                      <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.15rem', marginBottom: 6 }} className="group-hover:text-[#00B4D8] transition-colors">{job.title}</h3>
                      <div style={{ fontSize: '0.9rem', color: '#94a3b8', display: 'flex', gap: 12 }}>
                        <span>{job.location?.startsWith('{') ? (() => { try { const l = JSON.parse(job.location); return [l.city, l.district, l.state, l.country].filter(Boolean).join(', '); } catch { return job.location; } })() : job.location}</span>
                        <span>•</span>
                        <span>{job.experience}</span>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem 1rem', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem' }} className="group-hover:bg-[#0077B6] group-hover:text-white transition-colors">
                      View Job
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>Company Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <MapPin size={20} color="#64748b" style={{ flexShrink: 0 }} />
                <span>{company.address}</span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Mail size={20} color="#64748b" style={{ flexShrink: 0 }} />
                <span>{company.email}</span>
              </div>
              {company.website && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <Globe size={20} color="#64748b" style={{ flexShrink: 0 }} />
                  <a href={company.website} target="_blank" rel="noreferrer" style={{ color: '#00B4D8', textDecoration: 'none' }} className="hover:underline">{company.website}</a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <style>{`
        @media(max-width: 900px) {
          .company-details-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

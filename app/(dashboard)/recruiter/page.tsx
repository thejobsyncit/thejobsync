'use client';

import { MOCK_REQUIREMENTS, MOCK_CANDIDATES, MOCK_INTERVIEWS } from '@/lib/mock-data';
import { STATUS_COLORS } from '@/lib/types';
import { Briefcase, Users, Calendar, TrendingUp, Search, UserCheck, ArrowRight, Clock, Target, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function RecruiterPage() {
  const [activeTab, setActiveTab] = useState<'requirements' | 'candidates' | 'pipeline'>('requirements');
  const myRequirements = MOCK_REQUIREMENTS.filter(r => r.assignedRecruiters.includes('5'));
  const myCandidates = MOCK_CANDIDATES.filter(c => myRequirements.some(r => r.id === c.appliedFor));

  return (
    <div>
      <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Recruiter Hub</h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Your recruitment dashboard and tools</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Assigned Requirements', value: myRequirements.length, icon: <Briefcase size={18} />, color: '#0077B6' },
          { label: 'Candidates in Pipeline', value: myCandidates.length, icon: <Users size={18} />, color: '#22c55e' },
          { label: 'Interviews This Week', value: 2, icon: <Calendar size={18} />, color: '#f97316' },
          { label: 'Placements (Month)', value: 1, icon: <Target size={18} />, color: '#ec4899' },
        ].map((stat, i) => (
          <div key={stat.label} className={`stat-card animate-fade-in-up delay-${i + 1}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: `${stat.color}15`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: stat.color,
              }}>{stat.icon}</div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.125rem' }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-list animate-fade-in delay-3" style={{ marginBottom: '1.25rem', width: 'fit-content' }}>
        {['requirements', 'candidates', 'pipeline'].map(tab => (
          <button key={tab} className={`tab-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab as typeof activeTab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'requirements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {myRequirements.map((req, i) => (
            <div key={req.id} className={`card animate-fade-in-up delay-${Math.min(i + 1, 6)}`} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{req.title}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>{req.clientName} • {req.location}</p>
                </div>
                <span className="badge" style={{ background: `${STATUS_COLORS[req.status]}15`, color: STATUS_COLORS[req.status] }}>
                  {req.status.replace('_', ' ')}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Users size={12} /> {req.filledPositions}/{req.positions} filled
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> Deadline: {new Date(req.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="progress-bar" style={{ marginTop: '0.75rem' }}>
                <div className="progress-fill" style={{ width: `${(req.filledPositions / req.positions) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'candidates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {myCandidates.map((cand, i) => (
            <div key={cand.id} className={`card animate-fade-in-up delay-${Math.min(i + 1, 6)}`} style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.625rem' }}>
                <div className="avatar avatar-md" style={{ background: `hsl(${cand.name.charCodeAt(0) * 15}, 55%, 45%)`, borderRadius: 10 }}>
                  {cand.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{cand.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{cand.experience} • {cand.location}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {cand.skills.slice(0, 3).map(s => (
                  <span key={s} style={{ padding: '0.125rem 0.375rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius-full)', fontSize: '0.625rem', color: 'var(--muted-foreground)' }}>{s}</span>
                ))}
              </div>
              <span className="badge" style={{ background: `${STATUS_COLORS[cand.status] || '#6b7280'}15`, color: STATUS_COLORS[cand.status] || '#94a3b8' }}>
                {cand.status.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {['new', 'shortlisted', 'interview_scheduled', 'interviewed', 'selected', 'offered'].map(status => {
            const count = myCandidates.filter(c => c.status === status).length;
            return (
              <div key={status} className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[status] || '#6b7280' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, textTransform: 'capitalize' }}>{status.replace(/_/g, ' ')}</span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{count}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>candidates</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

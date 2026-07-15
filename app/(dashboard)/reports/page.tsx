'use client';

import { useState } from 'react';
import { MONTHLY_PLACEMENT_DATA, REQUIREMENT_STATUS_DATA, TOP_SKILLS_DATA, MOCK_CLIENTS, MOCK_PLACEMENTS, MOCK_CANDIDATES } from '@/lib/mock-data';
import { BarChart3, Download, Calendar, TrendingUp, Users, Building2, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<'overview' | 'recruitment' | 'client' | 'placement'>('overview');

  const clientReportData = MOCK_CLIENTS.map(c => ({
    name: c.companyName.length > 12 ? c.companyName.slice(0, 12) + '...' : c.companyName,
    requirements: Math.floor(Math.random() * 5) + 1,
    placements: Math.floor(Math.random() * 3),
  }));

  return (
    <div>
      <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Reports & Analytics</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Comprehensive recruitment insights</p>
        </div>
        <button className="btn btn-secondary"><Download size={16} /> Export Report</button>
      </div>

      <div className="tab-list animate-fade-in delay-1" style={{ marginBottom: '1.5rem', width: 'fit-content' }}>
        {['overview', 'recruitment', 'client', 'placement'].map(tab => (
          <button key={tab} className={`tab-item ${activeReport === tab ? 'active' : ''}`} onClick={() => setActiveReport(tab as typeof activeReport)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeReport === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Total Placements', value: '43', change: '+18%', icon: <Award size={18} />, color: '#22c55e' },
              { label: 'Interviews Conducted', value: '186', change: '+24%', icon: <Calendar size={18} />, color: '#0077B6' },
              { label: 'Candidates Processed', value: '312', change: '+32%', icon: <Users size={18} />, color: '#0077B6' },
              { label: 'Active Clients', value: '5', change: '+10%', icon: <Building2 size={18} />, color: '#f97316' },
            ].map((s, i) => (
              <div key={s.label} className={`stat-card animate-fade-in-up delay-${i + 1}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4ade80' }}>{s.change}</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="card animate-fade-in-up delay-3" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Monthly Trends</h3>
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MONTHLY_PLACEMENT_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted)" fontSize={12} />
                    <YAxis stroke="var(--muted)" fontSize={12} />
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                    <Line type="monotone" dataKey="placements" stroke="#0077B6" strokeWidth={2} dot={{ fill: '#0077B6' }} />
                    <Line type="monotone" dataKey="interviews" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card animate-fade-in-up delay-4" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Skills Distribution</h3>
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={TOP_SKILLS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="skill" stroke="var(--muted)" fontSize={11} />
                    <YAxis stroke="var(--muted)" fontSize={12} />
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                    <Bar dataKey="count" fill="#0077B6" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {activeReport === 'recruitment' && (
        <div className="card animate-fade-in-up" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Recruitment Funnel</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { stage: 'Applications Received', count: 312, pct: 100, color: '#0077B6' },
              { stage: 'Shortlisted', count: 156, pct: 50, color: '#0077B6' },
              { stage: 'Interviews Scheduled', count: 98, pct: 31, color: '#f97316' },
              { stage: 'Interviews Completed', count: 82, pct: 26, color: '#06b6d4' },
              { stage: 'Selected', count: 52, pct: 17, color: '#22c55e' },
              { stage: 'Offers Made', count: 48, pct: 15, color: '#eab308' },
              { stage: 'Joined', count: 43, pct: 14, color: '#10b981' },
            ].map(item => (
              <div key={item.stage}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>
                  <span>{item.stage}</span>
                  <span style={{ fontWeight: 600 }}>{item.count} ({item.pct}%)</span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div style={{ width: `${item.pct}%`, height: '100%', borderRadius: 'var(--radius-full)', background: item.color, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeReport === 'client' && (
        <div className="card animate-fade-in-up" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Client Performance</h3>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientReportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} />
                <YAxis stroke="var(--muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="requirements" fill="#0077B6" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="placements" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeReport === 'placement' && (
        <div className="table-container animate-fade-in-up">
          <table className="table">
            <thead>
              <tr><th>Candidate</th><th>Position</th><th>Client</th><th>Salary</th><th>Joining Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {MOCK_PLACEMENTS.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.candidateName}</td>
                  <td>{p.position}</td>
                  <td>{p.clientName}</td>
                  <td style={{ color: 'var(--primary-hover)', fontWeight: 500 }}>{p.salary}</td>
                  <td>{new Date(p.joiningDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td><span className={`badge ${p.status === 'joined' ? 'badge-success' : 'badge-info'}`}>{p.status.replace(/_/g, ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

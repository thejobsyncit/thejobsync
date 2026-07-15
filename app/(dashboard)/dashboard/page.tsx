'use client';

import { useAuth } from '@/context/AuthContext';
import { useDataStore } from '@/lib/useDataStore';
import {
  MONTHLY_PLACEMENT_DATA,
  REQUIREMENT_STATUS_DATA, TOP_SKILLS_DATA,
} from '@/lib/mock-data';
import {
  Building2, Briefcase, Users, Calendar, Award, TrendingUp,
  ArrowUpRight, ArrowDownRight, Clock, User,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { useEffect, useState } from 'react';

const STAT_CARDS = [
  { label: 'Total Clients', key: 'totalClients' as const, icon: <Building2 size={20} />, gradient: 'linear-gradient(135deg, #0077B6, #0077B6)', change: '+12%', up: true },
  { label: 'Active Requirements', key: 'activeRequirements' as const, icon: <Briefcase size={20} />, gradient: 'linear-gradient(135deg, #0077B6, #06b6d4)', change: '+8%', up: true },
  { label: 'Total Candidates', key: 'totalCandidates' as const, icon: <Users size={20} />, gradient: 'linear-gradient(135deg, #22c55e, #10b981)', change: '+24%', up: true },
  { label: 'Scheduled Interviews', key: 'scheduledInterviews' as const, icon: <Calendar size={20} />, gradient: 'linear-gradient(135deg, #f97316, #eab308)', change: '-5%', up: false },
  { label: 'Total Placements', key: 'placements' as const, icon: <Award size={20} />, gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)', change: '+18%', up: true },
  { label: 'Open Positions', key: 'openPositions' as const, icon: <TrendingUp size={20} />, gradient: 'linear-gradient(135deg, #0077B6, #00B4D8)', change: '+15%', up: true },
];

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  client: <Building2 size={14} />,
  requirement: <Briefcase size={14} />,
  candidate: <User size={14} />,
  interview: <Calendar size={14} />,
  placement: <Award size={14} />,
};

const ACTIVITY_COLORS: Record<string, string> = {
  client: '#06b6d4',
  requirement: '#0077B6',
  candidate: '#22c55e',
  interview: '#f97316',
  placement: '#ec4899',
};

interface DashboardData {
  stats: Record<string, number>;
  recentActivities: any[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (!user) return null;

  return (
    <div>
      {/* Header */}
      <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.625rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Welcome back, {user.name.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
          Here&apos;s an overview of your recruitment activities
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            {STAT_CARDS.map((card, i) => (
              <div
                key={card.key}
                className={`stat-card animate-fade-in-up delay-${i + 1}`}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: card.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                  }}>
                    {card.icon}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    fontSize: '0.75rem', fontWeight: 600,
                    color: card.up ? '#4ade80' : '#f87171',
                  }}>
                    {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {card.change}
                  </div>
                </div>
                <div className="animate-count-up" style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  {data?.stats[card.key] || 0}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            {/* Recruitment Trends */}
            <div className="card animate-fade-in-up delay-3" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>
                Recruitment Trends
              </h3>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MONTHLY_PLACEMENT_DATA}>
                    <defs>
                      <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0077B6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0077B6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted)" fontSize={12} />
                    <YAxis stroke="var(--muted)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        fontSize: '0.8125rem',
                      }}
                    />
                    <Area type="monotone" dataKey="interviews" stroke="#22c55e" fill="url(#colorInterviews)" strokeWidth={2} />
                    <Area type="monotone" dataKey="placements" stroke="#0077B6" fill="url(#colorPlacements)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: '#0077B6' }} /> Placements
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: '#22c55e' }} /> Interviews
                </div>
              </div>
            </div>

            {/* Requirement Status Distribution */}
            <div className="card animate-fade-in-up delay-4" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>
                Requirement Status
              </h3>
              <div style={{ height: 260, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={REQUIREMENT_STATUS_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {REQUIREMENT_STATUS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--surface)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 8, fontSize: '0.8125rem',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    {REQUIREMENT_STATUS_DATA.reduce((acc, curr) => acc + curr.value, 0)}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>Total</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                {REQUIREMENT_STATUS_DATA.map(item => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} /> {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}>
            {/* Top Skills Demand */}
            <div className="card animate-fade-in-up delay-5" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>
                Top Skills in Demand
              </h3>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={TOP_SKILLS_DATA} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" />
                    <XAxis type="number" stroke="var(--muted)" fontSize={12} />
                    <YAxis dataKey="name" type="category" width={80} stroke="var(--muted)" fontSize={11} tick={{ fill: 'var(--muted-foreground)' }} />
                    <Tooltip
                      cursor={{ fill: 'var(--surface-hover)' }}
                      contentStyle={{
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 8, fontSize: '0.8125rem',
                      }}
                    />
                    <Bar dataKey="demand" fill="#00B4D8" radius={[0, 4, 4, 0]} barSize={20}>
                      {TOP_SKILLS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(270, 70%, ${60 - index * 5}%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="card animate-fade-in-up delay-6" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Recent Activities</h3>
                <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>View All</button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                {(data?.recentActivities || []).length > 0 ? data!.recentActivities.map((activity: any, i: number) => (
                  <div key={activity.id ? `${activity.id}-${i}` : i} style={{ display: 'flex', gap: '0.875rem' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: `${ACTIVITY_COLORS[activity.type] || '#666'}15`,
                      color: ACTIVITY_COLORS[activity.type] || '#666',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {ACTIVITY_ICONS[activity.type] || <Clock size={14} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem', marginBottom: '0.125rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{activity.action}</span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>
                          {new Date(activity.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                        {activity.description}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem', marginTop: '2rem' }}>
                    No recent activities
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

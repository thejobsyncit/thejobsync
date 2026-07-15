'use client';

import { Server, Database, Shield, Activity, FileText, HardDrive, Cpu, Wifi, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function ITAdminPage() {
  return (
    <div>
      <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>IT Administration</h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Server monitoring, security, and system health</p>
      </div>

      {/* System Health Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Server Uptime', value: '99.9%', icon: <Server size={18} />, color: '#22c55e', status: 'healthy' },
          { label: 'CPU Usage', value: '34%', icon: <Cpu size={18} />, color: '#0077B6', status: 'healthy' },
          { label: 'Memory Usage', value: '62%', icon: <HardDrive size={18} />, color: '#f97316', status: 'warning' },
          { label: 'Active Connections', value: '23', icon: <Wifi size={18} />, color: '#0077B6', status: 'healthy' },
        ].map((s, i) => (
          <div key={s.label} className={`stat-card animate-fade-in-up delay-${i + 1}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.status === 'healthy' ? '#22c55e' : '#eab308', boxShadow: `0 0 8px ${s.status === 'healthy' ? '#22c55e' : '#eab308'}` }} />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Audit Logs */}
        <div className="card animate-fade-in-up delay-3" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={16} /> Recent Audit Logs
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
            {[
              { user: 'Rajesh Kumar', action: 'Updated system settings', time: '2 min ago', type: 'info' },
              { user: 'Priya Sharma', action: 'Database backup completed', time: '15 min ago', type: 'success' },
              { user: 'Arun Patel', action: 'Added new user: Karthik', time: '1 hr ago', type: 'info' },
              { user: 'System', action: 'SSL certificate renewal', time: '3 hr ago', type: 'warning' },
              { user: 'Vikram Singh', action: 'Password reset for user', time: '5 hr ago', type: 'info' },
              { user: 'System', action: 'Failed login attempt (3x)', time: '6 hr ago', type: 'danger' },
            ].map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.625rem', padding: '0.625rem 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: log.type === 'success' ? '#22c55e' : log.type === 'warning' ? '#eab308' : log.type === 'danger' ? '#ef4444' : '#0077B6',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{log.user}</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}> — {log.action}</span>
                </div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--muted)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={10} />{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Access */}
        <div className="card animate-fade-in-up delay-4" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} /> Security Overview
          </h3>
          {[
            { label: 'SSL Certificate', status: 'Valid', icon: <CheckCircle size={14} />, color: '#22c55e' },
            { label: 'Firewall', status: 'Active', icon: <CheckCircle size={14} />, color: '#22c55e' },
            { label: 'Last Backup', status: '15 min ago', icon: <Database size={14} />, color: '#0077B6' },
            { label: 'Pending Updates', status: '2 available', icon: <AlertTriangle size={14} />, color: '#eab308' },
            { label: 'Failed Logins (24h)', status: '3 attempts', icon: <AlertTriangle size={14} />, color: '#f97316' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8125rem' }}>
                <span style={{ color: item.color }}>{item.icon}</span>
                {item.label}
              </div>
              <span style={{ fontSize: '0.8125rem', color: item.color, fontWeight: 500 }}>{item.status}</span>
            </div>
          ))}

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary btn-sm"><Database size={13} /> Backup Now</button>
            <button className="btn btn-secondary btn-sm"><Activity size={13} /> View Logs</button>
          </div>
        </div>
      </div>
    </div>
  );
}

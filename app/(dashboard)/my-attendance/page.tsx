'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';

export default function MyAttendancePage() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/attendance/${user.id}?limit=30`)
      .then(res => res.json())
      .then(data => {
        setAttendance(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div>
      <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>My Attendance</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Review your login sessions and effective hours (Last 30 Days)</p>
      </div>

      <div className="card animate-fade-in-up delay-1" style={{ padding: '2rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><div className="spinner" /></div>
        ) : attendance.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>No attendance records found</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {attendance.map((record, index) => (
              <div 
                key={record.id} 
                style={{ background: 'var(--background)', borderRadius: 16, padding: '1.25rem', border: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}
              >
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 200 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: record.status === 'present' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: record.status === 'present' ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CalendarIcon size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>{record.status}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: 250 }}>
                  {record.sessions && record.sessions.length > 0 ? (
                    record.sessions.map((s: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(0,0,0,0.02)', padding: '0.5rem', borderRadius: 8 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-foreground)', width: 60 }}>Session {idx + 1}</div>
                        <div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)' }}>Login</div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{s.loginTime ? new Date(s.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)' }}>Logout</div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{s.logoutTime ? new Date(s.logoutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ display: 'flex', gap: '2rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Login</div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{record.loginTime ? new Date(record.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Logout</div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{record.logoutTime ? new Date(record.logoutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</div>
                      </div>
                    </div>
                  )}
                  
                  {record.totalHours > 1 && (
                    <div style={{ fontSize: '0.75rem', color: '#eab308', marginTop: '0.25rem' }}>
                      * 1hr break deducted from effective hours
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Effective</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: record.is9Hours ? '#22c55e' : (record.effectiveHours > 0 ? '#f97316' : 'var(--muted)') }}>
                      {record.effectiveHours > 0 ? `${Math.floor(record.effectiveHours)}h ${Math.round((record.effectiveHours % 1) * 60)}m` : '--'}
                    </div>
                  </div>
                  {record.effectiveHours > 0 && (
                    <div title={record.is9Hours ? "Completed 9 hours shift" : "Shift incomplete"}>
                      {record.is9Hours ? <CheckCircle size={24} color="#22c55e" /> : <XCircle size={24} color="#f97316" />}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

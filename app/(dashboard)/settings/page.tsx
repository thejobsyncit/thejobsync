'use client';

import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/types';
import { Settings, User, Lock, Bell, Palette, Globe, Save } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  return (
    <div>
      <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Settings</h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Manage your account and preferences</p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Sidebar tabs */}
        <div className="animate-fade-in delay-1" style={{ width: 200, flexShrink: 0 }}>
          {[
            { key: 'profile', label: 'Profile', icon: <User size={16} /> },
            { key: 'security', label: 'Security', icon: <Lock size={16} /> },
            { key: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
            { key: 'preferences', label: 'Preferences', icon: <Palette size={16} /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                width: '100%', padding: '0.625rem 0.875rem', marginBottom: '0.25rem',
                borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                background: activeTab === tab.key ? 'var(--primary-glow)' : 'transparent',
                color: activeTab === tab.key ? 'var(--primary-hover)' : 'var(--muted-foreground)',
                fontWeight: activeTab === tab.key ? 500 : 400,
                fontSize: '0.875rem', textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 300 }}>
          {activeTab === 'profile' && (
            <div className="card animate-fade-in-up" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Profile Information</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="avatar avatar-xl" style={{
                  background: ROLE_COLORS[user.role],
                  fontSize: '1.5rem', width: 72, height: 72,
                }}>
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{user.name}</div>
                  <span className="badge" style={{ background: `${ROLE_COLORS[user.role]}15`, color: ROLE_COLORS[user.role] }}>
                    {ROLE_LABELS[user.role]}
                  </span>
                </div>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSaving(true);
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const phone = formData.get('phone') as string;
                const department = formData.get('department') as string;

                try {
                  const res = await fetch(`/api/users/${user.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone, department }),
                  });
                  if (res.ok) {
                    const data = await res.json();
                    updateUser(data);
                    alert('Profile updated successfully!');
                  } else {
                    alert('Failed to update profile.');
                  }
                } catch (err) {
                  alert('An error occurred while saving.');
                } finally {
                  setIsSaving(false);
                }
              }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 480 }}>
                <div><label className="label">Full Name</label><input name="name" className="input" defaultValue={user.name} required /></div>
                <div><label className="label">Email Address</label><input className="input" type="email" defaultValue={user.email} disabled title="Email cannot be changed" style={{ opacity: 0.7, cursor: 'not-allowed' }} /></div>
                <div><label className="label">Phone</label><input name="phone" className="input" defaultValue={user.phone} /></div>
                <div><label className="label">Department</label><input name="department" className="input" defaultValue={user.department || ''} /></div>
                <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ alignSelf: 'flex-end', opacity: isSaving ? 0.7 : 1 }}>
                  <Save size={14} /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card animate-fade-in-up" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Change Password</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 480 }}>
                <div><label className="label">Current Password</label><input className="input" type="password" placeholder="Enter current password" /></div>
                <div><label className="label">New Password</label><input className="input" type="password" placeholder="Enter new password" /></div>
                <div><label className="label">Confirm New Password</label><input className="input" type="password" placeholder="Confirm new password" /></div>
                <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }}><Lock size={14} /> Update Password</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card animate-fade-in-up" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Notification Preferences</h3>
              {[
                { label: 'Email Notifications', desc: 'Receive updates via email' },
                { label: 'Interview Reminders', desc: 'Get reminded before scheduled interviews' },
                { label: 'Requirement Updates', desc: 'Notify on requirement status changes' },
                { label: 'Placement Alerts', desc: 'Alert on new placements' },
                { label: 'System Announcements', desc: 'Important system updates' },
              ].map((pref, i) => (
                <div key={pref.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: '0.125rem', fontSize: '0.875rem' }}>{pref.label}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>{pref.desc}</div>
                  </div>
                  <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked={i < 3} style={{ display: 'none' }} />
                    <div style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: i < 3 ? 'var(--primary)' : 'var(--surface-hover)',
                      border: '1px solid var(--border)',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', background: 'white',
                        position: 'absolute', top: 2, left: i < 3 ? 22 : 2,
                        transition: 'left 0.2s ease',
                      }} />
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="card animate-fade-in-up" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Display Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 480 }}>
                <div>
                  <label className="label">Language</label>
                  <select className="input select">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Tamil</option>
                    <option>Telugu</option>
                  </select>
                </div>
                <div>
                  <label className="label">Date Format</label>
                  <select className="input select">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="label">Timezone</label>
                  <select className="input select">
                    <option>Asia/Kolkata (IST, +05:30)</option>
                    <option>UTC</option>
                    <option>America/New_York (EST)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Items Per Page</label>
                  <select className="input select">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </div>
                <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }}><Save size={14} /> Save Preferences</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

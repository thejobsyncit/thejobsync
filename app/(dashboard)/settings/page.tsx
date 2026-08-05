'use client';

import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/types';
import { Settings, User, Lock, Bell, Palette, Globe, Save, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [preferences, setPreferences] = useState({
    language: 'English',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Asia/Kolkata (IST, +05:30)',
    itemsPerPage: '10'
  });

  useEffect(() => {
    const stored = localStorage.getItem('crm_preferences');
    if (stored) {
      try {
        setPreferences(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

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
                <div><label className="label">Phone</label><input name="phone" type="tel" pattern="[0-9]*" maxLength={15} onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} className="input" defaultValue={user.phone} /></div>
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
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newPass = formData.get('newPass') as string;
                const confirmPass = formData.get('confirmPass') as string;

                if (newPass !== confirmPass) {
                  alert('New passwords do not match!');
                  return;
                }

                try {
                  const res = await fetch(`/api/users/${user.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: newPass }),
                  });
                  if (res.ok) {
                    alert('Password updated successfully! Please log in again with your new password.');
                    logout(true); // logout without confirmation prompt
                  } else {
                    alert('Failed to update password');
                  }
                } catch (err) {
                  alert('An error occurred while updating password');
                }
              }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 480 }}>
                <div>
                  <label className="label">Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input name="currentPass" className="input" type={showCurrent ? "text" : "password"} placeholder="Enter current password" required />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}>{showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
                <div>
                  <label className="label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input name="newPass" className="input" type={showNew ? "text" : "password"} placeholder="Enter new password" minLength={6} required />
                    <button type="button" onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}>{showNew ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input name="confirmPass" className="input" type={showConfirm ? "text" : "password"} placeholder="Confirm new password" minLength={6} required />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}>{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}><Lock size={14} /> Update Password</button>
              </form>
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
              <form onSubmit={(e) => {
                e.preventDefault();
                setIsSavingPrefs(true);
                const formData = new FormData(e.currentTarget);
                const prefs = {
                  language: formData.get('language') as string,
                  dateFormat: formData.get('dateFormat') as string,
                  timezone: formData.get('timezone') as string,
                  itemsPerPage: formData.get('itemsPerPage') as string,
                };
                localStorage.setItem('crm_preferences', JSON.stringify(prefs));
                setPreferences(prefs);
                
                const langMap: Record<string, string> = {
                  'English': '',
                  'Hindi': '/en/hi',
                  'Tamil': '/en/ta',
                  'Telugu': '/en/te'
                };
                const selectedLang = prefs.language;
                if (selectedLang === 'English') {
                  // Clear Google Translate cookie to reset to default language
                  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
                } else if (langMap[selectedLang]) {
                  document.cookie = `googtrans=${langMap[selectedLang]}; path=/`;
                  document.cookie = `googtrans=${langMap[selectedLang]}; path=/; domain=` + window.location.hostname;
                }
                
                setTimeout(() => {
                  setIsSavingPrefs(false);
                  window.location.reload();
                }, 500);
              }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 480 }}>
                <div>
                  <label className="label">Language</label>
                  <select name="language" className="input select" defaultValue={preferences.language} key={preferences.language}>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                  </select>
                </div>
                <div>
                  <label className="label">Date Format</label>
                  <select name="dateFormat" className="input select" defaultValue={preferences.dateFormat} key={preferences.dateFormat}>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="label">Timezone</label>
                  <select name="timezone" className="input select" defaultValue={preferences.timezone} key={preferences.timezone}>
                    <option value="Asia/Kolkata (IST, +05:30)">Asia/Kolkata (IST, +05:30)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York (EST)">America/New_York (EST)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Items Per Page</label>
                  <select name="itemsPerPage" className="input select" defaultValue={preferences.itemsPerPage} key={preferences.itemsPerPage}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
                <button type="submit" disabled={isSavingPrefs} className="btn btn-primary" style={{ alignSelf: 'flex-end', opacity: isSavingPrefs ? 0.7 : 1 }}>
                  <Save size={14} /> {isSavingPrefs ? 'Saving...' : 'Save Preferences'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

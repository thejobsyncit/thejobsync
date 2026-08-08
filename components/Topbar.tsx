'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/types';
import { Bell, Search, LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { toggleGlobalTheme } from '@/lib/theme';

interface TopbarProps {
  sidebarCollapsed: boolean;
  onMobileMenuToggle: () => void;
}

export default function Topbar({ sidebarCollapsed, onMobileMenuToggle }: TopbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const currentTheme = resolvedTheme || theme || 'dark';

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    
    if (user) {
      const fetchNotifications = async () => {
        try {
          const res = await fetch(`/api/notifications?userId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setNotifications(data);
          }
        } catch (e) {
          console.error('Failed to fetch notifications', e);
        }
      };

      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/crm');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user) return null;

  return (
    <header
      className="topbar"
      style={{ left: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }}
    >
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuToggle}
        className="btn-ghost btn-icon mobile-menu-btn"
        style={{ marginRight: '0.75rem' }}
      >
        <Menu size={20} />
      </button>

      {/* Spacer */}
      <div style={{ flex: 1 }}></div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
        
        {/* Theme Toggle */}
        {mounted && (
          <button
            className="btn-ghost btn-icon"
            onClick={() => {
              const next = toggleGlobalTheme(currentTheme as any);
              setTheme(next);
            }}
            title={currentTheme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-ghost btn-icon"
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            style={{ position: 'relative' }}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-dot" />}
          </button>

          {showNotifications && (
            <div className="animate-scale-in notification-dropdown" style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              width: 360, background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.4)', zIndex: 50,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: '0.875rem' }}>
                Notifications ({unreadCount} new)
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '0.8125rem' }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} 
                      onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                      style={{
                        padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)',
                        background: n.isRead ? 'transparent' : 'rgba(99,102,241,0.04)',
                        cursor: n.isRead ? 'default' : 'pointer', transition: 'background 0.15s ease',
                    }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: n.isRead ? 500 : 700, marginBottom: '0.25rem' }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', lineHeight: 1.4 }}>
                        {n.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 0.375rem' }} />

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              background: 'none', border: 'none', cursor: 'pointer', padding: '0.375rem',
              borderRadius: 'var(--radius-md)', transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="avatar avatar-sm" style={{ background: ROLE_COLORS[user.role] }}>
              {getInitials(user.name)}
            </div>
            <div className="topbar-user-info" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--foreground)', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>
                {ROLE_LABELS[user.role]}
              </div>
            </div>
          </button>

          {showUserMenu && (
            <div className="animate-scale-in user-menu-dropdown" style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              width: 200, background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.4)', zIndex: 50,
              overflow: 'hidden',
            }}>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  width: '100%', padding: '0.75rem 1rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#f87171', fontSize: '0.875rem', textAlign: 'left',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click-away listener */}
      {(showNotifications || showUserMenu) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
          onClick={() => { setShowNotifications(false); setShowUserMenu(false); }}
        />
      )}
    </header>
  );
}

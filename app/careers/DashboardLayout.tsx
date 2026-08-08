'use client';

import { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { User, Briefcase, Bookmark, MessageSquare, LogOut, Zap, Menu, X, Sun, Moon, Mic, Award, Globe, Video, Bell } from 'lucide-react';
import { usePortalTheme } from '@/context/PortalThemeContext';
import { motion } from 'framer-motion';

export default function CandidateDashboardLayout({ children }: { children: ReactNode }) {
  const { candidate, logout, isLoading } = useCandidateAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isDark, toggleTheme } = usePortalTheme();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: isDark ? '#0f172a' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 50, height: 50, border: `3px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderTopColor: '#00B4D8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    if (candidate) {
      fetch(`/api/candidate-auth/messages?candidateAccountId=${candidate.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const count = data.filter((m: any) => !m.isRead && m.sender === 'hr').length;
            setUnreadMessagesCount(count);
          }
        })
        .catch(console.error);
    }
  }, [candidate]);

  useEffect(() => {
    if (pathname === '/careers/messages') {
      setUnreadMessagesCount(0);
    }
  }, [pathname]);

  if (!candidate) {
    return null;
  }

  const navItems = [
    { label: 'My Profile', href: '/careers/profile', icon: <User size={20} /> },
    { label: 'Portfolio', href: '/careers/portfolio', icon: <Globe size={20} /> },
    { label: 'Saved Jobs', href: '/careers/saved-jobs', icon: <Bookmark size={20} /> },
    { label: 'Applications', href: '/careers/my-applications', icon: <Briefcase size={20} /> },
    { label: 'Messages', href: '/careers/messages', icon: <MessageSquare size={20} />, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined },
    { label: 'AI Mock Interview', href: '/careers/mock-interview', icon: <Mic size={20} /> },
    { label: 'My Score Reports', href: '/careers/assessment-reports', icon: <Award size={20} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#0f172a' : '#f8fafc', color: isDark ? '#f8fafc' : '#0f172a', fontFamily: 'var(--font-inter, Inter, sans-serif)', display: 'flex' }}>

      {/* Mobile Top Header */}
      <div className="candidate-mobile-header" style={{
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        zIndex: 40,
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/loooo.jpeg" alt="The jobsync Logo" style={{ height: 32, width: 32, objectFit: 'contain', borderRadius: '50%' }} />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: isDark ? 'white' : '#0f172a' }}>The jobsync</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/careers/messages" onClick={() => setUnreadMessagesCount(0)} style={{ position: 'relative', color: isDark ? 'white' : '#0f172a', display: 'flex', alignItems: 'center' }}>
            <Bell size={22} />
            {unreadMessagesCount > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', width: 10, height: 10, borderRadius: '50%', border: `2px solid ${isDark ? '#0f172a' : 'white'}` }} />
            )}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: isDark ? 'white' : '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 45 }} 
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`candidate-sidebar ${mobileOpen ? 'open' : ''}`}
        style={{ width: 280, background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)', borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, position: 'fixed', top: 0, bottom: 0, left: 0, height: '100vh', display: 'flex', flexDirection: 'column', zIndex: 50 }}
      >
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexShrink: 0 }}>
            <Link href="/careers" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <img src="/loooo.jpeg" alt="The jobsync Logo" style={{ height: 36, width: 36, objectFit: 'contain', borderRadius: '50%' }} />
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: isDark ? 'white' : '#0f172a', letterSpacing: '-0.5px' }}>The Job<span style={{ color: '#00B4D8' }}>Sync</span></span>
            </Link>
            <button 
              onClick={() => setMobileOpen(false)} 
              className="candidate-mobile-close"
              style={{ display: 'none', background: 'none', border: 'none', color: isDark ? '#cbd5e1' : '#475569', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navItems.map(item => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={() => {
                  setMobileOpen(false);
                  if (item.href === '/careers/messages') setUnreadMessagesCount(0);
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 12,
                    background: active ? 'rgba(56,189,248,0.12)' : 'transparent',
                    color: active ? '#00B4D8' : (isDark ? '#cbd5e1' : '#475569'),
                    fontWeight: active ? 700 : 600,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s', border: `1px solid ${active ? 'rgba(56,189,248,0.25)' : 'transparent'}`
                  }}
                    className="hover:bg-sky-900/20 hover:text-sky-300">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {item.icon} {item.label}
                    </div>
                    {item.badge !== undefined && (
                      <span style={{
                        background: '#ef4444', color: 'white', fontSize: '0.75rem', fontWeight: 700,
                        padding: '2px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div style={{ flexShrink: 0, padding: '1.25rem 1.25rem', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, background: isDark ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#ffffff', flexShrink: 0 }}>
              {candidate.name[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isDark ? 'white' : '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidate.name}</div>
              <div style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidate.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', width: '100%' }}>
            <button 
              onClick={toggleTheme} 
              style={{
                width: '100%',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0 1rem',
                margin: 0,
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxSizing: 'border-box',
                outline: 'none',
                background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                color: isDark ? '#f8fafc' : '#0f172a',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              }} 
              className="hover:scale-[1.01] active:scale-[0.98] hover:bg-sky-500/10 hover:border-sky-500/30 dark:hover:bg-white/10 dark:hover:border-white/20"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={18} className="flex-shrink-0" /> : <Moon size={18} className="flex-shrink-0" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <Link 
              href="/careers/messages"
              onClick={() => setUnreadMessagesCount(0)}
              style={{
                width: '100%',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0 1rem',
                margin: 0,
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxSizing: 'border-box',
                textDecoration: 'none',
                background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                color: isDark ? '#f8fafc' : '#0f172a',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                position: 'relative'
              }} 
              className="hover:scale-[1.01] active:scale-[0.98] hover:bg-sky-500/10 hover:border-sky-500/30 dark:hover:bg-white/10 dark:hover:border-white/20"
            >
              <Bell size={18} className="flex-shrink-0" />
              <span>Notifications</span>
              {unreadMessagesCount > 0 && (
                <span style={{ 
                  position: 'absolute', top: 12, right: 12, 
                  background: '#ef4444', color: 'white', 
                  fontSize: '0.65rem', fontWeight: 800, 
                  padding: '2px 6px', borderRadius: 10,
                  lineHeight: 1
                }}>
                  {unreadMessagesCount}
                </span>
              )}
            </Link>

            <button 
              onClick={() => { if(window.confirm("Are you sure you want to log out?")) { logout(); router.push('/careers'); } }} 
              style={{
                width: '100%',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0 1rem',
                margin: 0,
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxSizing: 'border-box',
                outline: 'none',
                background: 'rgba(239, 68, 68, 0.08)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }} 
              className="hover:scale-[1.01] active:scale-[0.98] hover:bg-red-500/15 hover:border-red-500/40"
              title="Sign Out"
            >
              <LogOut size={18} className="flex-shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="candidate-main" style={{ marginLeft: 280, flex: 1, background: isDark ? '#0f172a' : '#f8fafc', minHeight: '100vh', position: 'relative', transition: 'margin-left 0.3s ease', overflowX: 'hidden' }}>
        {/* Subtle Background Glow */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, rgba(0,0,0,0) 70%)', top: 0, left: '20%', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: '3rem 1.5rem', position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto' }}>
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="candidate-bottom-nav" style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: isDark ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        zIndex: 40,
        backdropFilter: 'blur(12px)',
        padding: '0 0.5rem',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
        {navItems.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none', flex: 1, position: 'relative' }} onClick={() => {
              setMobileOpen(false);
              if (item.href === '/careers/messages') setUnreadMessagesCount(0);
            }}>
              {item.badge !== undefined && (
                <span style={{
                  position: 'absolute', top: 4, right: '20%', background: '#ef4444', color: 'white',
                  fontSize: '0.65rem', fontWeight: 800, padding: '1px 5px', borderRadius: 10,
                  zIndex: 10
                }}>
                  {item.badge}
                </span>
              )}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 3, padding: '0.5rem 0', borderRadius: 10,
                color: active ? '#00B4D8' : (isDark ? '#64748b' : '#94a3b8'),
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: active ? '1.1em' : '1em', transition: 'all 0.2s' }}>{item.icon}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: active ? 700 : 500, letterSpacing: '0.01em' }}>
                  {item.label.replace('My ', '')}
                </span>
                {active && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#00B4D8' }} />}
              </div>
            </Link>
          );
        })}
      </nav>

      <style>{`
        @media (max-width: 992px) {
          .candidate-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .candidate-sidebar.open {
            transform: translateX(0);
          }
          .candidate-mobile-header {
            display: flex !important;
          }
          .candidate-mobile-close {
            display: flex !important;
          }
          .candidate-main {
            margin-left: 0 !important;
            padding-top: 64px !important;
            padding-bottom: 72px !important;
          }
          .candidate-bottom-nav {
            display: flex !important;
          }
        }
        @media (max-width: 640px) {
          .candidate-main > div {
            padding: 1rem !important;
          }
        }
        @media (max-width: 400px) {
          .candidate-main > div {
            padding: 0.75rem !important;
          }
        }
      `}</style>

    </div>
  );
}

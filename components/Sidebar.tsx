'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/lib/types';
import {
  LayoutDashboard, Users, Briefcase, UserCheck, Calendar, Heart,
  Award, BarChart3, Settings, Shield, Server, Crown, Code, TestTube2,
  Building2, ChevronLeft, ChevronRight, X, LifeBuoy, Clock, PhoneCall
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} />, roles: ['super_admin', 'it_admin', 'admin', 'placement_coordinator', 'recruiter', 'interviewer', 'hr', 'developer', 'tester', 'dms', 'coordinator'] },
  { label: 'Company Client', href: '/dms', icon: <Building2 size={18} />, roles: ['super_admin', 'admin', 'dms'] },
  { label: 'Fresh Leads', href: '/coordinator', icon: <PhoneCall size={18} />, roles: ['super_admin', 'admin', 'coordinator'] },
  { label: 'All Leads', href: '/leads', icon: <Building2 size={18} />, roles: ['super_admin', 'admin'] },
  { label: 'Requirements', href: '/requirements', icon: <Briefcase size={18} />, roles: ['super_admin', 'admin', 'placement_coordinator', 'recruiter'] },
  { label: 'Candidates', href: '/candidates', icon: <Users size={18} />, roles: ['super_admin', 'admin', 'placement_coordinator', 'recruiter', 'interviewer', 'hr'] },
  { label: 'Interviews', href: '/interviews', icon: <Calendar size={18} />, roles: ['super_admin', 'admin', 'placement_coordinator', 'recruiter', 'interviewer', 'hr'] },
  { label: 'Placements', href: '/placements', icon: <Award size={18} />, roles: ['super_admin', 'admin', 'placement_coordinator', 'recruiter', 'hr'] },
  { label: 'Recruiter Hub', href: '/recruiter', icon: <UserCheck size={18} />, roles: ['recruiter'] },
  { label: 'Interviewer Hub', href: '/interviewer', icon: <Calendar size={18} />, roles: ['interviewer'] },
  { label: 'HR Hub', href: '/hr', icon: <Heart size={18} />, roles: ['hr'] },
  { label: 'Fresh Dump', href: '/fresh-dump', icon: <TestTube2 size={18} />, roles: ['super_admin', 'admin', 'hr', 'placement_coordinator', 'recruiter'] },
  { label: 'Reports', href: '/reports', icon: <BarChart3 size={18} />, roles: ['super_admin', 'admin', 'placement_coordinator', 'hr'] },
  { label: 'Admin Panel', href: '/admin', icon: <Shield size={18} />, roles: ['super_admin', 'admin'] },
  { label: 'Super Admin', href: '/super-admin', icon: <Crown size={18} />, roles: ['super_admin'] },
  { label: 'Candidate Stats', href: '/candidate-registrations', icon: <BarChart3 size={18} />, roles: ['super_admin'] },
  { label: 'Helpdesk & Leave', href: '/helpdesk', icon: <LifeBuoy size={18} />, roles: ['super_admin', 'it_admin', 'admin', 'placement_coordinator', 'recruiter', 'interviewer', 'hr', 'developer', 'tester', 'dms', 'coordinator'] },
  { label: 'My Attendance', href: '/my-attendance', icon: <Clock size={18} />, roles: ['super_admin', 'it_admin', 'admin', 'placement_coordinator', 'recruiter', 'interviewer', 'hr', 'developer', 'tester', 'dms', 'coordinator'] },
  { label: 'Settings', href: '/settings', icon: <Settings size={18} />, roles: ['super_admin', 'admin', 'placement_coordinator', 'recruiter', 'interviewer', 'hr', 'client'] },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleItems = NAV_ITEMS.filter(item => user && item.roles.includes(user.role));

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 39,
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? '1.25rem 0.75rem' : '1.25rem 1.25rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          minHeight: 'var(--topbar-height)',
        }}>
          <img src="/loooo.jpeg" alt="The jobsync Logo" style={{ height: 32, width: 32, objectFit: 'contain', borderRadius: '50%', flexShrink: 0 }} />
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--foreground)', whiteSpace: 'nowrap', letterSpacing: '-0.3px' }}>
                The jobsync
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                Recruitment System
              </div>
            </div>
          )}

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="btn-ghost btn-icon mobile-menu-btn"
            style={{ marginLeft: 'auto' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
          {visibleItems.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
              >
                <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div style={{
          padding: '0.75rem',
          borderTop: '1px solid var(--border)',
        }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-nav-item"
            style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
          </button>
        </div>
      </aside>
    </>
  );
}

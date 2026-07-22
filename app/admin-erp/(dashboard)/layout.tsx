'use client';

import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, Briefcase, Users, FileText, HelpCircle, FileCheck, Mail, Menu, X } from "lucide-react";

export default function AdminERPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = (
    <div className="p-4 flex-1">
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Main</h3>
        <nav className="space-y-1">
          <Link href="/admin-erp" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-white/10 text-white transition-colors">
            <LayoutDashboard size={18} />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link href="/admin-erp/job-board" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <Briefcase size={18} />
            <span className="text-sm font-medium">Job Board</span>
          </Link>
        </nav>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Users</h3>
        <nav className="space-y-1">
          <Link href="/admin-erp/companies" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <Briefcase size={18} />
            <span className="text-sm font-medium">Companies</span>
          </Link>
          <Link href="/admin-erp/candidates" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <Users size={18} />
            <span className="text-sm font-medium">Candidates</span>
          </Link>
          <Link href="/admin-erp/resumes" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <FileText size={18} />
            <span className="text-sm font-medium">Resumes</span>
          </Link>
        </nav>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Settings (CMS)</h3>
        <nav className="space-y-1">
          <Link href="/admin-erp/blog" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <FileCheck size={18} />
            <span className="text-sm font-medium">Blog</span>
          </Link>
          <Link href="/admin-erp/faqs" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <HelpCircle size={18} />
            <span className="text-sm font-medium">FAQs</span>
          </Link>
          <Link href="/admin-erp/newsletter" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <Mail size={18} />
            <span className="text-sm font-medium">Newsletter</span>
          </Link>
        </nav>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop always visible, mobile slide-in */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#03045E] text-white flex flex-col h-full overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/loooo.jpeg" alt="The jobsync Logo" className="h-8 w-8 object-contain rounded-full border border-gray-700 bg-white" />
            <div>
              <h1 className="font-bold tracking-wider text-sm">The jobsync</h1>
              <p className="text-[10px] text-gray-300 tracking-widest uppercase">Admin Panel</p>
            </div>
          </div>
          {/* Close button (mobile) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-gray-300 hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        {navLinks}

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-gray-400 truncate">admin@thejobsync.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Top Header */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="hidden sm:inline">Admin Panel</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-gray-900 font-medium">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="text-gray-500 hover:text-gray-700 text-lg">🔔</button>
            <Link href="/admin-erp/login" className="text-sm text-red-600 font-medium hover:underline">
              Logout
            </Link>
          </div>
        </header>

        {/* Page Content — responsive padding */}
        <div className="p-3 sm:p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

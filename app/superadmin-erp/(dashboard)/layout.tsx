'use client';

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard, Briefcase, Users, FileText, HelpCircle, FileCheck, Mail,
  CreditCard, Tag, BarChart, Image as ImageIcon, MapPin, UserCheck, Shield,
  Menu, X
} from "lucide-react";

export default function SuperAdminERPLayout({
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
          <Link href="/superadmin-erp" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-white/10 text-white transition-colors">
            <LayoutDashboard size={18} /><span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link href="/superadmin-erp/job-board" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <Briefcase size={18} /><span className="text-sm font-medium">Job Board</span>
          </Link>
        </nav>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Users</h3>
        <nav className="space-y-1">
          <Link href="/superadmin-erp/companies" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <Briefcase size={18} /><span className="text-sm font-medium">Companies</span>
          </Link>
          <Link href="/superadmin-erp/candidates" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <Users size={18} /><span className="text-sm font-medium">Candidates</span>
          </Link>
          <Link href="/superadmin-erp/candidate-registrations" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <BarChart size={18} /><span className="text-sm font-medium">Candidate Stats</span>
          </Link>
        </nav>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Finance</h3>
        <nav className="space-y-1">
          <Link href="/superadmin-erp/invoices" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <FileText size={18} /><span className="text-sm font-medium">Invoices</span>
          </Link>
          <Link href="/superadmin-erp/coupons" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <Tag size={18} /><span className="text-sm font-medium">Coupons</span>
          </Link>
          <Link href="/superadmin-erp/reports" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <BarChart size={18} /><span className="text-sm font-medium">Reports</span>
          </Link>
          <Link href="/superadmin-erp/packages" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <Briefcase size={18} /><span className="text-sm font-medium">Packages</span>
          </Link>
        </nav>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Settings</h3>
        <nav className="space-y-1">
          <Link href="/superadmin-erp/payment" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <CreditCard size={18} /><span className="text-sm font-medium">Payment</span>
          </Link>
          <Link href="/superadmin-erp/employees" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <UserCheck size={18} /><span className="text-sm font-medium">Employees</span>
          </Link>
          <Link href="/superadmin-erp/media" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <ImageIcon size={18} /><span className="text-sm font-medium">Media</span>
          </Link>
          <Link href="/superadmin-erp/locations" onClick={() => setMobileOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <MapPin size={18} /><span className="text-sm font-medium">Locations</span>
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

      {/* Sidebar */}
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
              <p className="text-[10px] text-blue-300 tracking-widest uppercase">Super Admin</p>
            </div>
          </div>
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
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
              SA
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">Super Admin</p>
              <p className="text-xs text-blue-300 flex items-center gap-1 truncate"><Shield size={10} /> Full Access</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="hidden sm:inline">Super Admin Panel</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-gray-900 font-medium">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="text-gray-500 hover:text-gray-700 text-lg">🔔</button>
            <Link href="/superadmin-erp/login" className="text-sm text-red-600 font-medium hover:underline">
              Logout
            </Link>
          </div>
        </header>

        <div className="p-3 sm:p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

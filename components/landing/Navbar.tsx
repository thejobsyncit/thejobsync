'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogIn, Menu, X, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <nav className="fixed w-full top-0 z-[100] bg-white/90 dark:bg-[#010a18]/90 backdrop-blur-md shadow-sm border-b border-[#90E0EF]/30 dark:border-[#0077B6]/20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <img src="/loooo.jpeg" alt="The jobsync Logo" className="h-12 w-auto object-contain rounded-full border border-[#90E0EF]/40 shadow-sm" />
              <span className="font-extrabold text-2xl text-[#03045E] dark:text-[#00B4D8] tracking-tight transition-colors">
                The jobsync
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center space-x-10">
              <Link href="/" className={`${isActive('/') ? 'text-[#0077B6] border-b-2 border-[#0077B6] pb-1' : 'text-slate-700 dark:text-[#CAF0F8] hover:text-[#0077B6] dark:hover:text-[#00B4D8] transition-colors'} font-bold text-base`}>Home</Link>
              <Link href="/about" className={`${isActive('/about') ? 'text-[#0077B6] border-b-2 border-[#0077B6] pb-1' : 'text-slate-700 dark:text-[#CAF0F8] hover:text-[#0077B6] dark:hover:text-[#00B4D8] transition-colors'} font-bold text-base`}>About Us</Link>
              <Link href="/companies" className={`${isActive('/companies') ? 'text-[#0077B6] border-b-2 border-[#0077B6] pb-1' : 'text-slate-700 dark:text-[#CAF0F8] hover:text-[#0077B6] dark:hover:text-[#00B4D8] transition-colors'} font-bold text-base`}>Companies</Link>
              <Link href="/careers" className={`${isActive('/careers') ? 'text-[#0077B6] border-b-2 border-[#0077B6] pb-1' : 'text-slate-700 dark:text-[#CAF0F8] hover:text-[#0077B6] dark:hover:text-[#00B4D8] transition-colors'} font-bold text-base`}>Job Seekers</Link>
            </div>

            {/* Desktop Buttons & Theme Toggle */}
            <div className="hidden md:flex items-center space-x-4">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 text-[#03045E] dark:text-[#CAF0F8] hover:text-[#0077B6] dark:hover:text-[#00B4D8] transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              )}
              
              <Link href="/register" className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#0077B6] text-[#0077B6] dark:text-[#00B4D8] dark:border-[#00B4D8] rounded-lg font-semibold hover:bg-[#CAF0F8]/20 dark:hover:bg-[#0077B6]/10 transition-colors">
                <User size={18} strokeWidth={2.5} />
                <span>Register</span>
              </Link>
              <Link href="/login" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white rounded-lg font-semibold hover:scale-105 transition-transform shadow-md">
                <LogIn size={18} strokeWidth={2.5} />
                <span>Sign In</span>
              </Link>
            </div>

            {/* Mobile Menu Button & Theme Toggle */}
            <div className="lg:hidden flex items-center space-x-2">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="text-[#03045E] dark:text-[#CAF0F8] hover:text-[#0077B6] transition-colors p-2"
                >
                  {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                </button>
              )}
              <button onClick={() => setIsOpen(!isOpen)} className="text-[#03045E] dark:text-[#CAF0F8] hover:text-[#0077B6] transition-colors p-2">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed top-20 left-0 w-full bg-white dark:bg-[#010a18] border-b border-[#90E0EF]/30 dark:border-[#0077B6]/20 px-4 py-4 space-y-4 shadow-xl z-[90]">
          <Link href="/" className={`block ${isActive('/') ? 'text-[#0077B6]' : 'text-slate-700 dark:text-[#CAF0F8] hover:text-[#0077B6]'} font-bold text-base`} onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/about" className={`block ${isActive('/about') ? 'text-[#0077B6]' : 'text-slate-700 dark:text-[#CAF0F8] hover:text-[#0077B6]'} font-bold text-base`} onClick={() => setIsOpen(false)}>About Us</Link>
          <Link href="/companies" className={`block ${isActive('/companies') ? 'text-[#0077B6]' : 'text-slate-700 dark:text-[#CAF0F8] hover:text-[#0077B6]'} font-bold text-base`} onClick={() => setIsOpen(false)}>Companies</Link>
          <Link href="/careers" className={`block ${isActive('/careers') ? 'text-[#0077B6]' : 'text-slate-700 dark:text-[#CAF0F8] hover:text-[#0077B6]'} font-bold text-base`} onClick={() => setIsOpen(false)}>Job Seekers</Link>
          <div className="pt-4 border-t border-[#90E0EF]/30 dark:border-[#0077B6]/20 flex flex-col space-y-3">
            <Link href="/register" className="flex justify-center items-center gap-2 w-full px-5 py-2.5 border-2 border-[#0077B6] text-[#0077B6] dark:text-[#00B4D8] dark:border-[#00B4D8] rounded-lg font-semibold hover:bg-[#CAF0F8]/20 transition-colors" onClick={() => setIsOpen(false)}>
              <User size={18} strokeWidth={2.5} />
              <span>Register</span>
            </Link>
            <Link href="/login" className="flex justify-center items-center gap-2 w-full px-5 py-2.5 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white rounded-lg font-semibold hover:scale-105 transition-transform shadow-md" onClick={() => setIsOpen(false)}>
              <LogIn size={18} strokeWidth={2.5} />
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

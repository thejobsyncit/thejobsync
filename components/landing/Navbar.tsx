'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogIn, Menu, X, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { toggleGlobalTheme } from '@/lib/theme';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = resolvedTheme || theme || 'dark';

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleToggleTheme = () => {
    const next = toggleGlobalTheme(currentTheme as any);
    setTheme(next);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/companies', label: 'Companies' },
    { href: '/careers', label: 'Job Seekers' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed w-full top-0 z-[100] transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 dark:bg-[#010a18]/90 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] border-b border-[#0077B6]/15'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#00B4D8]/20 blur-md group-hover:blur-lg transition-all duration-300" />
                <img
                  src="/loooo.jpeg"
                  alt="The jobsync Logo"
                  className="relative h-11 w-auto object-contain rounded-full border border-[#0077B6]/40 shadow-[0_0_16px_rgba(0,119,182,0.2)]"
                />
              </div>
              <span className="font-black text-2xl bg-gradient-to-r from-[#03045E] to-[#0077B6] dark:from-white dark:to-[#90E0EF] bg-clip-text text-transparent tracking-tight">
                GoJobSync
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-4 py-2 rounded-xl font-semibold text-[15px] transition-all duration-300 ${
                    isActive(href)
                      ? 'text-[#0077B6] dark:text-[#00B4D8]'
                      : 'text-slate-600 dark:text-[#CAF0F8]/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0077B6]/10'
                  }`}
                >
                  {label}
                  {isActive(href) && (
                    <motion.span
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-[#0077B6]/10 rounded-xl border border-[#0077B6]/20"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {mounted && (
                <button
                  onClick={handleToggleTheme}
                  className="p-2.5 text-slate-500 dark:text-[#CAF0F8]/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0077B6]/15 transition-all rounded-xl"
                  aria-label="Toggle Theme"
                >
                  {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}
              <Link
                href="/register"
                className="flex items-center gap-2 px-5 py-2.5 border border-[#0077B6]/50 text-[#0077B6] dark:text-[#00B4D8] rounded-xl font-semibold text-sm hover:bg-[#0077B6]/10 hover:border-[#0077B6] transition-all duration-300"
              >
                <User size={16} strokeWidth={2.5} />
                Register
              </Link>
              <Link
                href="/login"
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white overflow-hidden shadow-[0_0_20px_rgba(0,119,182,0.3)] hover:shadow-[0_0_30px_rgba(0,119,182,0.5)] transition-all duration-300 group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#0077B6] to-[#00B4D8]" />
                <span className="absolute inset-0 bg-gradient-to-r from-[#00B4D8] to-[#0077B6] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <LogIn size={16} strokeWidth={2.5} className="relative" />
                <span className="relative">Sign In</span>
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center space-x-2">
              {mounted && (
                <button
                  onClick={handleToggleTheme}
                  className="text-slate-600 dark:text-[#CAF0F8] hover:text-slate-900 dark:hover:text-white transition-colors p-2"
                  aria-label="Toggle dark mode"
                >
                  {currentTheme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                </button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-600 dark:text-[#CAF0F8] hover:text-slate-900 dark:hover:text-white transition-colors p-2"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-20 left-0 w-full bg-white/95 dark:bg-[#010a18]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-[#0077B6]/20 px-5 py-6 space-y-2 shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[90]"
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl font-semibold text-[15px] transition-all duration-200 ${
                  isActive(href)
                    ? 'bg-[#0077B6]/10 text-[#0077B6] border border-[#0077B6]/20'
                    : 'text-slate-600 dark:text-[#CAF0F8]/80 hover:bg-slate-100 dark:hover:bg-[#0077B6]/10 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-200 dark:border-[#0077B6]/20 flex flex-col space-y-3">
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="flex justify-center items-center gap-2 w-full px-5 py-3 border border-[#0077B6]/50 text-[#0077B6] dark:text-[#00B4D8] rounded-xl font-semibold hover:bg-[#0077B6]/10 transition-all"
              >
                <User size={16} strokeWidth={2.5} />
                Register
              </Link>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="relative flex justify-center items-center gap-2 w-full px-5 py-3 rounded-xl font-bold text-white overflow-hidden shadow-[0_0_20px_rgba(0,119,182,0.3)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#0077B6] to-[#00B4D8]" />
                <LogIn size={16} strokeWidth={2.5} className="relative" />
                <span className="relative">Sign In</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

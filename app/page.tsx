'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import AboutUs from '@/components/landing/AboutUs';
import Services from '@/components/landing/Services';
import Features from '@/components/landing/Features';
import NewsBlog from '@/components/landing/NewsBlog';
import FAQ from '@/components/landing/FAQ';
import ContactUs from '@/components/landing/ContactUs';
import Footer from '@/components/landing/Footer';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isDark = mounted ? theme === 'dark' : true;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans overflow-x-hidden transition-colors duration-300">
      <Navbar />
      <Hero />
      <AboutUs />
      <FAQ />
      <Services />
      <Features />
      <NewsBlog />
      <ContactUs />
      <Footer />
    </main>
  );
}

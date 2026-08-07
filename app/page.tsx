'use client';

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
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#010a18] text-slate-900 dark:text-white font-sans overflow-x-hidden transition-colors duration-300" suppressHydrationWarning>
      <Navbar />
      <Hero />
      <AboutUs />
      <Services />
      <Features />
      <FAQ />
      <NewsBlog />
      <ContactUs />
      <Footer />
    </main>
  );
}

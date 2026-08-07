'use client';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

// Inline LinkedIn SVG (lucide-react v1.x doesn't export Linkedin)
const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const links = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/#blog' },
  { label: 'FAQs', href: '/#faq' },
];
const resources = [
  { label: 'Companies', href: '/companies' },
  { label: 'Candidates', href: '/careers' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Disclaimer', href: '#' },
];
const support = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Use', href: '#' },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#03045E] dark:bg-[#010a18] overflow-hidden border-t border-[#0077B6]/30">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0077B6]/50 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-[radial-gradient(ellipse,rgba(0,180,216,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* CTA Banner */}
        <div className="relative my-16 rounded-[2rem] overflow-hidden p-10 md:p-16 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0077B6]/30 via-[#00B4D8]/10 to-transparent" />
          <div className="absolute inset-0 border border-white/10 rounded-[2rem]" />
          <div className="relative">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00B4D8] mb-4">Ready to Start?</p>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              Your Next Opportunity{' '}
              <span className="bg-gradient-to-r from-[#00B4D8] to-[#90E0EF] bg-clip-text text-transparent">
                is One Click Away
              </span>
            </h3>
            <p className="text-white/60 font-medium mb-8 max-w-md mx-auto">
              Join thousands of candidates and top employers who trust GoJobSync to make their next move.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/careers" className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white overflow-hidden shadow-[0_0_24px_rgba(0,180,216,0.3)] hover:shadow-[0_0_40px_rgba(0,180,216,0.5)] transition-all duration-300">
                <span className="absolute inset-0 bg-gradient-to-r from-[#0077B6] to-[#00B4D8]" />
                <span className="absolute inset-0 bg-gradient-to-r from-[#00B4D8] to-[#0077B6] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative">Find Jobs</span>
                <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white border border-white/30 hover:bg-white/10 transition-all duration-300">
                Post a Job
              </Link>
            </div>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#00B4D8]/20 blur-md group-hover:blur-lg transition-all" />
                <img src="/loooo.jpeg" alt="GoJobSync" width="44" height="44" className="relative h-11 w-auto rounded-full border border-white/20" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">GoJobSync</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed font-medium mb-6">
              The trusted bridge between ambition and opportunity. Connecting top talent with leading employers across India and UAE.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com/company/gojobsync" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300">
                <LinkedinIcon />
              </a>
              <a href="mailto:hr@gojobsync.com"
                className="w-9 h-9 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300">
                <Mail size={16} />
              </a>
              <a href="tel:9003096078"
                className="w-9 h-9 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300">
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-black text-white mb-6 text-sm uppercase tracking-widest">Links</h4>
            <ul className="space-y-3">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-white/50 hover:text-white transition-colors duration-300 text-sm font-semibold">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-black text-white mb-6 text-sm uppercase tracking-widest">Resources</h4>
            <ul className="space-y-3">
              {resources.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-white/50 hover:text-white transition-colors duration-300 text-sm font-semibold">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-black text-white mb-6 text-sm uppercase tracking-widest">Support</h4>
            <ul className="space-y-3 mb-8">
              {support.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-white/50 hover:text-white transition-colors duration-300 text-sm font-semibold">{label}</Link>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/30 text-xs"><Phone size={12} /> <span>9003096078</span></div>
              <div className="flex items-center gap-2 text-white/30 text-xs"><Mail size={12} /> <span>hr@gojobsync.com</span></div>
              <div className="flex items-start gap-2 text-white/30 text-xs"><MapPin size={12} className="mt-0.5 flex-shrink-0" /> <span>Dubai Creek Tower, UAE</span></div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/30 text-sm font-medium">© 2026 GoJobSync. All rights reserved.</p>
          <p className="text-white/20 text-xs">Designed with ❤️ for ambitious professionals</p>
        </div>
      </div>
    </footer>
  );
}

'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0a1f44] text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logooo.jpeg" alt="JobSync Logo" className="h-12 w-auto object-contain rounded-full border border-gray-700" />
              <span className="font-extrabold text-xl tracking-tight">JobSync</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed font-medium">
              The trusted bridge between ambition and opportunity. Connecting top talent with leading employers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-6">Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-blue-200 hover:text-white transition-colors text-sm font-medium">Home</Link></li>
              <li><Link href="/about" className="text-blue-200 hover:text-white transition-colors text-sm font-medium">About Us</Link></li>
              <li><Link href="#" className="text-blue-200 hover:text-white transition-colors text-sm font-medium">Blog</Link></li>
              <li><Link href="/#faq" className="text-blue-200 hover:text-white transition-colors text-sm font-medium">FAQs</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-white mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-blue-200 hover:text-white transition-colors text-sm font-medium">Companies</Link></li>
              <li><Link href="#" className="text-blue-200 hover:text-white transition-colors text-sm font-medium">Candidates</Link></li>
              <li><Link href="/pricing" className="text-blue-200 hover:text-white transition-colors text-sm font-medium">Pricing</Link></li>
              <li><Link href="#" className="text-blue-200 hover:text-white transition-colors text-sm font-medium">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-white mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-blue-200 hover:text-white transition-colors text-sm font-medium">Contact Us</Link></li>
              <li><Link href="#" className="text-blue-200 hover:text-white transition-colors text-sm font-medium">Privacy Policy</Link></li>
              <li><Link href="#" className="text-blue-200 hover:text-white transition-colors text-sm font-medium">Terms of Use</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex justify-center text-center">
          <p className="text-blue-200 text-sm font-medium">
            &copy; 2026 JobSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

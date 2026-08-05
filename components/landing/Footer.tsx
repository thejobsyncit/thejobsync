'use client';
import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="bg-[#03045E] dark:bg-[#010a18] text-white pt-20 pb-8 transition-colors duration-300 border-t border-[#0077B6]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src="/loooo.jpeg" alt="The jobsync Logo" className="h-12 w-auto object-contain rounded-full border border-[#0077B6]" />
              <span className="font-extrabold text-xl tracking-tight text-[#CAF0F8]">The jobsync</span>
            </div>
            <p className="text-[#90E0EF] text-sm leading-relaxed font-medium mb-8">
              The trusted bridge between ambition and opportunity. Connecting top talent with leading employers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-[#CAF0F8] mb-6">Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-[#90E0EF] hover:text-[#00B4D8] transition-colors duration-300 text-sm font-medium">Home</Link></li>
              <li><Link href="/about" className="text-[#90E0EF] hover:text-[#00B4D8] transition-colors duration-300 text-sm font-medium">About Us</Link></li>
              <li><Link href="/#blog" className="text-[#90E0EF] hover:text-[#00B4D8] transition-colors duration-300 text-sm font-medium">Blog</Link></li>
              <li><Link href="/#faq" className="text-[#90E0EF] hover:text-[#00B4D8] transition-colors duration-300 text-sm font-medium">FAQs</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-[#CAF0F8] mb-6">Resources</h4>
            <ul className="space-y-4 mb-8">
              <li><Link href="/companies" className="text-[#90E0EF] hover:text-[#00B4D8] transition-colors duration-300 text-sm font-medium">Companies</Link></li>
              <li><Link href="/careers" className="text-[#90E0EF] hover:text-[#00B4D8] transition-colors duration-300 text-sm font-medium">Candidates</Link></li>
              <li><Link href="/pricing" className="text-[#90E0EF] hover:text-[#00B4D8] transition-colors duration-300 text-sm font-medium">Pricing</Link></li>
              <li><Link href="#" className="text-[#90E0EF] hover:text-[#00B4D8] transition-colors duration-300 text-sm font-medium">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-[#CAF0F8] mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-[#90E0EF] hover:text-[#00B4D8] transition-colors duration-300 text-sm font-medium">Contact Us</Link></li>
              <li><Link href="#" className="text-[#90E0EF] hover:text-[#00B4D8] transition-colors duration-300 text-sm font-medium">Privacy Policy</Link></li>
              <li><Link href="#" className="text-[#90E0EF] hover:text-[#00B4D8] transition-colors duration-300 text-sm font-medium">Terms of Use</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-[#0077B6]/30 pt-8 flex justify-center text-center">
          <p className="text-[#90E0EF] text-sm font-medium">
            &copy; 2026 The jobsync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

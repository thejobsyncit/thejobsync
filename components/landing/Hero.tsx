'use client';
import { Search, Monitor, Building2, ChevronDown } from 'lucide-react';

export default function Hero() {

  return (
    <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Main Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat mt-[45vh]"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=2850&q=80")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 transition-colors duration-300"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Floating Circular Image */}
        <div 
          className="hidden lg:block absolute right-0 top-0 w-[400px] h-[400px] rounded-full border-[12px] border-white dark:border-slate-800 shadow-2xl overflow-hidden z-20 transition-colors duration-300 animate-scale-in delay-2"
        >
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" 
            alt="Professionals" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center lg:text-left max-w-4xl mx-auto lg:mx-0 relative z-30">
          <h1 
            className="text-5xl md:text-6xl lg:text-[76px] font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight transition-colors duration-300"
          >
            Navigate your Jobs here!
          </h1>
          
          <p 
            className="text-lg md:text-xl text-slate-500 dark:text-slate-400 italic font-medium max-w-2xl mb-12 mx-auto lg:mx-0 transition-colors duration-300"
          >
            "Lakhs of Employers. Millions of Job seekers. Endless success — only on THEJOBSYNC.COM."
          </p>
          
          {/* Stats Bar */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto lg:mx-0 z-50 mt-4 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex flex-col items-center sm:items-start flex-1 text-center sm:text-left">
              <span className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400">10,000+</span>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1 uppercase tracking-wider">Active Candidates</span>
            </div>
            
            <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-gray-300 dark:via-slate-600 to-transparent"></div>
            
            <div className="flex flex-col items-center sm:items-start flex-1 text-center sm:text-left">
              <span className="text-3xl md:text-4xl font-extrabold text-[#03045E] dark:text-[#90E0EF]">500+</span>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1 uppercase tracking-wider">Trusted Companies</span>
            </div>

            <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-gray-300 dark:via-slate-600 to-transparent"></div>
            
            <div className="flex flex-col items-center sm:items-start flex-1 text-center sm:text-left">
              <span className="text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">1,200+</span>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1 uppercase tracking-wider">Live Jobs</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer to push content up and show background image below */}
      <div className="h-[30vh] lg:h-[45vh]"></div>
    </div>
  );
}

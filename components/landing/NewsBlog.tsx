'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NewsBlog() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-[40px] font-extrabold text-slate-900 dark:text-white mb-2 transition-colors duration-300">News and Blog</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">Get the latest news, updates and tips</p>
          </div>
          <div className="hidden md:flex gap-3">
            <button className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-[#0077B6] hover:border-[#0077B6] transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-[#0077B6] hover:border-[#0077B6] transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Featured Post Card */}
        <div 
          className="bg-white dark:bg-slate-800/80 rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row mb-12 transition-all duration-300"
        >
          {/* Image Left */}
          <div className="w-full md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80" 
              alt="Blog post thumbnail" 
              className="w-full h-full object-cover min-h-[300px]"
            />
          </div>
          
          {/* Content Right */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex gap-2 mb-6 flex-wrap">
              <span className="bg-[#0077B6] text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">FEATURED</span>
              <span className="bg-[#0077B6] text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">PLATFORM UPDATES</span>
            </div>
            
            <h3 className="text-2xl md:text-[28px] font-extrabold text-slate-900 dark:text-white mb-6 leading-tight transition-colors duration-300">
              The jobsync — Navigate Your Career, Live!
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 text-[15px] transition-colors duration-300">
              Watch our latest platform walkthrough and see how The jobsync connects thousands of job seekers with top employers every day. From AI-powered job matching to seamless applications — ...
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50 dark:border-white/10 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-white flex items-center justify-center text-xs font-bold">
                  GT
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors duration-300">The jobsync Team</span>
              </div>
              <span className="text-[13px] font-medium text-slate-400 dark:text-slate-500 transition-colors duration-300">May 25, 2026</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

'use client';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NewsBlog() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-[40px] font-extrabold text-[#0a1f44] mb-2">News and Blog</h2>
            <p className="text-gray-500 font-medium">Get the latest news, updates and tips</p>
          </div>
          <div className="hidden md:flex gap-3">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1e3a8a] hover:border-[#1e3a8a] transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1e3a8a] hover:border-[#1e3a8a] transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Featured Post Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col md:flex-row mb-12"
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
              <span className="bg-[#1e3a8a] text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">FEATURED</span>
              <span className="bg-[#3b82f6] text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">PLATFORM UPDATES</span>
            </div>
            
            <h3 className="text-2xl md:text-[28px] font-extrabold text-[#0a1f44] mb-6 leading-tight">
              GOJOBSYNC \u2014 Navigate Your Career, Live!
            </h3>
            
            <p className="text-gray-500 font-medium leading-relaxed mb-8 text-[15px]">
              Watch our latest platform walkthrough and see how GOJOBSYNC connects thousands of job seekers with top employers every day. From AI-powered job matching to seamless applications \u2014 ...
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-xs font-bold">
                  GT
                </div>
                <span className="text-sm font-bold text-gray-700">GOJOBSYNC Team</span>
              </div>
              <span className="text-[13px] font-medium text-gray-400">May 25, 2026</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

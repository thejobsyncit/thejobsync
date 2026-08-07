'use client';
import { ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/blog')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setPosts(data.filter(p => p.status === 'published')); })
      .catch(err => console.error("Error fetching blogs:", err))
      .finally(() => setLoading(false));
  }, []);

  const handlePrev = () => { if (posts.length === 0) return; setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1)); };
  const handleNext = () => { if (posts.length === 0) return; setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1)); };

  if (loading || posts.length === 0) return null;

  const currentPost = posts[currentIndex];
  const formattedDate = new Date(currentPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <section id="blog" className="relative py-28 bg-slate-50 dark:bg-[#010a18] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0077B6]/20 dark:via-[#0077B6]/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(0,119,182,0.04)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse,rgba(0,119,182,0.07)_0%,transparent_70%)] -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-14">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#0077B6] mb-4">News & Blog</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">
              Latest <span className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] bg-clip-text text-transparent">Insights</span>
            </h2>
            <p className="text-slate-500 dark:text-[#90E0EF]/60 font-medium text-lg">Get the latest news, updates and career tips</p>
          </div>
          {posts.length > 1 && (
            <div className="hidden md:flex gap-3">
              <button onClick={handlePrev} className="w-11 h-11 rounded-full border border-slate-300 dark:border-[#0077B6]/25 flex items-center justify-center text-slate-400 dark:text-[#90E0EF]/50 hover:text-[#0077B6] dark:hover:text-white hover:border-[#0077B6] dark:hover:border-[#0077B6]/60 transition-all duration-300">
                <ChevronLeft size={20} />
              </button>
              <button onClick={handleNext} className="w-11 h-11 rounded-full border border-slate-300 dark:border-[#0077B6]/25 flex items-center justify-center text-slate-400 dark:text-[#90E0EF]/50 hover:text-[#0077B6] dark:hover:text-white hover:border-[#0077B6] dark:hover:border-[#0077B6]/60 transition-all duration-300">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row rounded-[2rem] overflow-hidden border border-slate-200 dark:border-[#0077B6]/15 bg-white dark:bg-[#03045E]/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.3)] hover:border-[#0077B6]/30 dark:hover:border-[#0077B6]/30 transition-all duration-400">
            <div className="w-full md:w-1/2 relative">
              <img src={currentPost.coverImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80"}
                alt={currentPost.title} className="w-full h-full object-cover min-h-[280px]" />
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <span className="inline-flex items-center gap-1.5 self-start text-[10px] font-black px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white tracking-widest uppercase mb-5">
                Blog Post
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                {currentPost.title}
              </h3>
              <p className="text-slate-500 dark:text-[#90E0EF]/60 font-medium leading-relaxed mb-8 text-[15px]">
                {currentPost.excerpt || currentPost.content.substring(0, 160) + "..."}
              </p>
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-[#0077B6]/15">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-white flex items-center justify-center text-xs font-black uppercase">
                    {currentPost.author ? currentPost.author.substring(0, 2) : "GT"}
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-[#90E0EF]/80 text-sm font-semibold">
                    <User size={13} />
                    <span>{currentPost.author || "GoJobSync Team"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-[#90E0EF]/50 text-sm">
                  <Calendar size={13} />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {posts.length > 1 && (
          <div className="flex md:hidden justify-center gap-4 mt-6">
            <button onClick={handlePrev} className="w-11 h-11 rounded-full border border-slate-300 dark:border-[#0077B6]/25 flex items-center justify-center text-slate-400 hover:text-[#0077B6] hover:border-[#0077B6] transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={handleNext} className="w-11 h-11 rounded-full border border-slate-300 dark:border-[#0077B6]/25 flex items-center justify-center text-slate-400 hover:text-[#0077B6] hover:border-[#0077B6] transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

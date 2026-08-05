'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function NewsBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/blog')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data.filter(p => p.status === 'published'));
        }
      })
      .catch(err => console.error("Error fetching blogs:", err))
      .finally(() => setLoading(false));
  }, []);

  const handlePrev = () => {
    if (posts.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (posts.length === 0) return;
    setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };

  if (loading || posts.length === 0) return null;

  const currentPost = posts[currentIndex];
  const formattedDate = new Date(currentPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <section id="blog" className="py-20 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-[40px] font-extrabold text-slate-900 dark:text-white mb-2 transition-colors duration-300">News and Blog</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">Get the latest news, updates and tips</p>
          </div>
          {posts.length > 1 && (
            <div className="hidden md:flex gap-3">
              <button onClick={handlePrev} className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-[#0077B6] hover:border-[#0077B6] transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={handleNext} className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-[#0077B6] hover:border-[#0077B6] transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Featured Post Card */}
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row mb-12 transition-all duration-300">
          
          {/* Image Left */}
          <div className="w-full md:w-1/2">
            <img 
              src={currentPost.coverImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80"} 
              alt={currentPost.title} 
              className="w-full h-full object-cover min-h-[300px]"
            />
          </div>
          
          {/* Content Right */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex gap-2 mb-6 flex-wrap">
              <span className="bg-[#0077B6] text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">BLOG POST</span>
            </div>
            
            <h3 className="text-2xl md:text-[28px] font-extrabold text-slate-900 dark:text-white mb-6 leading-tight transition-colors duration-300">
              {currentPost.title}
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 text-[15px] transition-colors duration-300">
              {currentPost.excerpt || currentPost.content.substring(0, 150) + "..."}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50 dark:border-white/10 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-white flex items-center justify-center text-xs font-bold uppercase">
                  {currentPost.author ? currentPost.author.substring(0, 2) : "GT"}
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors duration-300">{currentPost.author || "The jobsync Team"}</span>
              </div>
              <span className="text-[13px] font-medium text-slate-400 dark:text-slate-500 transition-colors duration-300">{formattedDate}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

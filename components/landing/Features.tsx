'use client';

export default function Features() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* For Job Seekers - Top Centered */}
        <div className="mb-20 max-w-4xl mx-auto text-center">
          <h2 
            className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6 transition-colors duration-300"
          >
            For Job Seekers
          </h2>
          <p 
            className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px] md:text-[17px] font-medium max-w-3xl mx-auto transition-colors duration-300"
          >
            We provide a centralized space to explore opportunities, apply with ease, and navigate your career journey. With thousands of applications submitted daily, THEJOBSYNC.COM empowers you to connect with employers who value your talent.
          </p>
        </div>

        {/* For Employers - Two Column */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Illustration Left */}
          <div 
            className="w-full lg:w-1/2"
          >
            <div className="bg-[#CAF0F8]/30 dark:bg-slate-800/50 rounded-[40px] p-8 flex justify-center items-center transition-colors duration-300">
              {/* Placeholder for the Job Search illustration */}
              <img 
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80" 
                alt="Job Search Illustration" 
                className="w-full max-w-md rounded-2xl shadow-xl mix-blend-multiply"
              />
            </div>
          </div>

          {/* Text Right */}
          <div 
            className="w-full lg:w-1/2"
          >
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white italic mb-6 transition-colors duration-300">
              For Employers
            </h2>
            <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px] md:text-[16px] font-medium italic transition-colors duration-300">
              <p>
                "THEJOBSYNC.COM enables organizations to connect with top talent effortlessly, managing the entire recruitment lifecycle—from job posting to placement, and rebuttals—all within one seamless platform."
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

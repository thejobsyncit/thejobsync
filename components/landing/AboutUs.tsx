'use client';

export default function AboutUs() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ABOUT US Top Section */}
        <div className="mb-24 max-w-5xl mx-auto">
          <h2 
            className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-8 transition-colors duration-300"
          >
            About Us
          </h2>
          <p 
            className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px] md:text-[17px] font-medium transition-colors duration-300"
          >
            At THEJOBSYNC.COM, we are redefining the future of recruitment. Our platform is built to digitize and streamline the entire hiring lifecycle, ensuring efficiency, transparency, and trust at every stage. From candidate placement to rebuttal management, we deliver a seamless, data-driven experience that empowers both employers and job seekers. By integrating advanced technology and AI-enhanced processes, THEJOBSYNC.COM transforms recruitment into a scalable, intelligent, and user-friendly ecosystem.
          </p>
        </div>

        {/* ABOUT OUR COMPANY Section */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Illustration Left */}
          <div 
            className="w-full lg:w-1/2"
          >
            <div className="bg-[#CAF0F8]/30 dark:bg-slate-800/50 rounded-[40px] p-8 flex justify-center items-center transition-colors duration-300">
              {/* Placeholder for the specific dashboard illustration */}
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" 
                alt="About Our Company Illustration" 
                className="w-full max-w-md rounded-2xl shadow-xl mix-blend-multiply"
              />
            </div>
          </div>

          {/* Text Right */}
          <div 
            className="w-full lg:w-1/2"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-8 transition-colors duration-300">
              About Our Company
            </h2>
            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed text-[15px] md:text-[16px] font-medium text-justify transition-colors duration-300">
              <p>
                "THEJOBSYNC.COM" starts its humble beginnings in 2025 at United Arab Emirates, as a modest venture of job portal access worldwide. We set out with a clear mission: to be the trusted bridge between ambition and opportunity—empowering job seekers and employers to create success stories every day.
              </p>
              <p>
                Our global job portal offers access to the best career opportunities free of charge, providing a comprehensive solution that matches skills with the right roles. We are committed to empowering individuals to find their ideal employment and take confident steps toward building their future.
              </p>
              <p>
                THEJOBSYNC.COM is more than a job portal—it is a complete recruitment ecosystem designed to bring top talent and top organizations together seamlessly.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

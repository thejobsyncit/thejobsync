'use client';
import { motion } from 'framer-motion';

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* For Job Seekers - Top Centered */}
        <div className="mb-20 max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-extrabold text-[#0a1f44] mb-6"
          >
            For Job Seekers
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 leading-relaxed text-[15px] md:text-[17px] font-medium max-w-3xl mx-auto"
          >
            We provide a centralized space to explore opportunities, apply with ease, and navigate your career journey. With thousands of applications submitted daily, GOJOBSYNC.COM empowers you to connect with employers who value your talent.
          </motion.p>
        </div>

        {/* For Employers - Two Column */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Illustration Left */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2"
          >
            <div className="bg-blue-50/50 rounded-[40px] p-8 flex justify-center items-center">
              {/* Placeholder for the Job Search illustration */}
              <img 
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80" 
                alt="Job Search Illustration" 
                className="w-full max-w-md rounded-2xl shadow-xl mix-blend-multiply"
              />
            </div>
          </motion.div>

          {/* Text Right */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-xl md:text-2xl font-extrabold text-[#0a1f44] italic mb-6">
              For Employers
            </h2>
            <div className="text-gray-600 leading-relaxed text-[15px] md:text-[16px] font-medium italic">
              <p>
                "GOJOBSYNC.COM enables organizations to connect with top talent effortlessly, managing the entire recruitment lifecycle—from job posting to placement, and rebuttals—all within one seamless platform."
              </p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}

'use client';
import { motion } from 'framer-motion';

export default function AboutUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ABOUT US Top Section */}
        <div className="mb-24 max-w-5xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-extrabold text-[#0a1f44] uppercase tracking-wider mb-8"
          >
            About Us
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 leading-relaxed text-[15px] md:text-[17px] font-medium"
          >
            At GOJOBSYNC.COM, we are redefining the future of recruitment. Our platform is built to digitize and streamline the entire hiring lifecycle, ensuring efficiency, transparency, and trust at every stage. From candidate placement to rebuttal management, we deliver a seamless, data-driven experience that empowers both employers and job seekers. By integrating advanced technology and AI-enhanced processes, GOJOBSYNC.COM transforms recruitment into a scalable, intelligent, and user-friendly ecosystem.
          </motion.p>
        </div>

        {/* ABOUT OUR COMPANY Section */}
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
              {/* Placeholder for the specific dashboard illustration */}
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" 
                alt="About Our Company Illustration" 
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
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a1f44] uppercase tracking-wider mb-8">
              About Our Company
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed text-[15px] md:text-[16px] font-medium text-justify">
              <p>
                "GOJOBSYNC.COM" starts its humble beginnings in 2025 at United Arab Emirates, as a modest venture of job portal access worldwide. We set out with a clear mission: to be the trusted bridge between ambition and opportunity—empowering job seekers and employers to create success stories every day.
              </p>
              <p>
                Our global job portal offers access to the best career opportunities free of charge, providing a comprehensive solution that matches skills with the right roles. We are committed to empowering individuals to find their ideal employment and take confident steps toward building their future.
              </p>
              <p>
                GOJOBSYNC.COM is more than a job portal—it is a complete recruitment ecosystem designed to bring top talent and top organizations together seamlessly.
              </p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}

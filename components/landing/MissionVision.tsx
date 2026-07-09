'use client';
import { motion } from 'framer-motion';

export default function MissionVision() {
  const steps = [
    {
      id: 1,
      title: 'Our Mission',
      desc: '"To Be The Trusted Bridge Between Ambition And Opportunity" "Empowering Job Seekers & Employers Creates Their Success Stories Every Day"'
    },
    {
      id: 2,
      title: 'Our Vision',
      desc: '"AI-driven recruitment ecosystem | Seamless hiring | Global access"'
    },
    {
      id: 3,
      title: 'Our Promise',
      desc: 'At GOJOBSYNC.COM, we are more than a job portal. We are a bridge between ambition and opportunity. Job Seekers: "Search. Apply. Succeed." Employers: "Post. Connect. Hire."'
    }
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-start relative">
          
          {/* Dashed Line Background (hidden on mobile) */}
          <div className="hidden md:block absolute top-[30px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-blue-200 z-0"></div>

          {steps.map((step, idx) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3 px-4 mb-12 md:mb-0"
            >
              <div className="w-16 h-16 rounded-full bg-[#f0f4f8] border-2 border-blue-100 flex items-center justify-center text-2xl font-bold text-[#0a1f44] mb-6 shadow-sm">
                {step.id}
              </div>
              <h3 className="text-lg font-bold text-[#0a1f44] mb-4">{step.title}</h3>
              <p className="text-gray-500 text-sm md:text-[15px] italic font-medium leading-relaxed max-w-sm">
                {step.desc}
              </p>
            </motion.div>
          ))}
          
        </div>
      </div>
    </section>
  );
}

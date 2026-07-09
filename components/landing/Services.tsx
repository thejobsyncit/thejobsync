'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ClipboardList, Database, UserPlus, Check, ArrowRight } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: 'Job Posting',
      icon: <ClipboardList className="text-orange-500 mb-4" size={32} />,
      features: [
        'Post a job and receive relevant applications',
        'Attract qualified candidates actively seeking new opportunities',
        'Customize postings to match your hiring requirements'
      ],
      link: '/pricing#job_posting'
    },
    {
      title: 'RESDEX \u2013 Resume Database',
      icon: <Database className="text-gray-800 mb-4" size={32} />,
      features: [
        'Search GOJOBSYNC\'s extensive resume database',
        'Discover talent across every city in India',
        'Filter candidates by location, skills, experience, and more'
      ],
      link: '/pricing#resume_access'
    },
    {
      title: 'Assisted Hiring',
      badge: 'NEW',
      icon: <UserPlus className="text-purple-600 mb-4" size={32} />,
      features: [
        'Get a dedicated hiring expert to support your recruitment',
        'Experts assess your needs and identify the right candidates',
        'We screen, shortlist, and share resumes directly with you'
      ],
      link: '/pricing'
    }
  ];

  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h3 className="text-[#1e3a8a] font-bold text-xs tracking-widest uppercase mb-4">Our Services</h3>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-[#0a1f44] mb-6">Three Ways to Hire Smarter</h2>
          <p className="text-gray-500 font-medium">
            From single job postings to full-service hiring assistance \u2014 pick the path that fits how your team grows.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="bg-white rounded-[20px] p-8 shadow-sm hover:shadow-xl transition-shadow flex flex-col border border-gray-100"
            >
              <div>{service.icon}</div>
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <h3 className="text-[19px] font-extrabold text-[#0a1f44]">{service.title}</h3>
                {service.badge && (
                  <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">
                    {service.badge}
                  </span>
                )}
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="text-green-500 mt-1 flex-shrink-0" size={16} strokeWidth={3} />
                    <span className="text-gray-600 text-[14px] font-medium leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={service.link} className="flex items-center justify-center gap-2 bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#172554] transition-colors self-start">
                View Plans
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

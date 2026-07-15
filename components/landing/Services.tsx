'use client';
import Link from 'next/link';
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
        'Search THEJOBSYNC\'s extensive resume database',
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
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h3 className="text-[#0077B6] dark:text-[#00B4D8] font-bold text-xs tracking-widest uppercase mb-4 transition-colors duration-300">Our Services</h3>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-slate-900 dark:text-white mb-6 transition-colors duration-300">Three Ways to Hire Smarter</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">
            From single job postings to full-service hiring assistance \u2014 pick the path that fits how your team grows.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div 
              key={idx}
              className={`bg-white dark:bg-slate-800/80 rounded-[20px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100 dark:border-white/5`}
            >
              <div>{service.icon}</div>
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <h3 className="text-[19px] font-extrabold text-slate-900 dark:text-white transition-colors duration-300">{service.title}</h3>
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
                    <span className="text-slate-600 dark:text-slate-300 text-[14px] font-medium leading-relaxed transition-colors duration-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={service.link} className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:scale-[1.02] transition-transform shadow-md self-start">
                View Plans
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

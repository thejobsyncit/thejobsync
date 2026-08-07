'use client';
import { Phone, Mail, MapPin, Send, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1 },
  }),
};

const contactInfo = [
  { icon: <Phone size={22} />, label: 'Phone', value: '9003096078', sub: 'Mon–Fri, 9am–6pm IST' },
  { icon: <Mail size={22} />, label: 'Email', value: 'hr@gojobsync.com', sub: 'Response within 24 hours', href: 'mailto:hr@gojobsync.com' },
  { icon: <MapPin size={22} />, label: 'Address', value: 'Dubai Creek Tower', sub: 'Deira, Riggat Al Buteen, Dubai' },
];

const hours = [
  { day: 'Monday – Friday', time: '9:00 AM – 6:00 PM', open: true },
  { day: 'Saturday', time: '9:00 AM – 4:00 PM', open: true },
  { day: 'Sunday', time: '—', open: false },
  { day: 'Public Holidays', time: '—', open: false },
];

export default function ContactUs() {
  return (
    <section className="relative py-28 bg-white dark:bg-[#010a18] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0077B6]/20 dark:via-[#0077B6]/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(0,119,182,0.04)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse,rgba(0,119,182,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center text-xs font-bold tracking-[0.25em] uppercase text-[#0077B6] mb-4">Get In Touch</motion.p>
        <motion.h1 variants={fadeUp} initial="hidden" whileInView="show" custom={1} viewport={{ once: true }}
          className="text-center text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-5 tracking-tight leading-tight max-w-2xl mx-auto">
          We'd Love to{' '}
          <span className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] bg-clip-text text-transparent">Hear From You</span>
        </motion.h1>
        <motion.p variants={fadeUp} initial="hidden" whileInView="show" custom={2} viewport={{ once: true }}
          className="text-center text-slate-500 dark:text-[#90E0EF]/70 font-medium mb-16 max-w-xl mx-auto text-lg">
          Have a question or need support? Our team typically responds within 24 hours.
        </motion.p>

        {/* Contact info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {contactInfo.map((item, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" custom={i} viewport={{ once: true }}
              className="flex flex-col items-center text-center p-7 rounded-2xl border border-slate-200 dark:border-[#0077B6]/15 bg-slate-50 dark:bg-[#03045E]/20 hover:border-[#0077B6]/40 hover:bg-blue-50 dark:hover:bg-[#03045E]/35 transition-all duration-300 group shadow-sm dark:shadow-none">
              <div className="w-14 h-14 rounded-2xl bg-[#0077B6]/10 border border-[#0077B6]/15 flex items-center justify-center text-[#0077B6] dark:text-[#00B4D8] mb-5 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <p className="text-xs font-bold tracking-widest uppercase text-[#0077B6] mb-2">{item.label}</p>
              {item.href
                ? <a href={item.href} className="text-slate-900 dark:text-white font-bold text-lg mb-1 hover:text-[#0077B6] transition-colors">{item.value}</a>
                : <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">{item.value}</p>
              }
              <p className="text-slate-400 dark:text-[#90E0EF]/50 text-sm">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="w-full lg:w-[60%] rounded-[2rem] border border-slate-200 dark:border-[#0077B6]/15 bg-white dark:bg-[#03045E]/20 p-8 md:p-12 shadow-sm dark:shadow-none">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Send Us a Message</h3>
            <p className="text-slate-400 dark:text-[#90E0EF]/60 font-medium mb-8">Fill out the form and our team will get back to you as soon as possible.</p>
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-[#90E0EF]/70 mb-2">First Name</label>
                  <input type="text" placeholder="John" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#0077B6]/20 bg-slate-50 dark:bg-[#010a18]/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#90E0EF]/30 focus:outline-none focus:border-[#0077B6] dark:focus:border-[#00B4D8]/60 transition-all duration-300" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-[#90E0EF]/70 mb-2">Last Name</label>
                  <input type="text" placeholder="Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#0077B6]/20 bg-slate-50 dark:bg-[#010a18]/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#90E0EF]/30 focus:outline-none focus:border-[#0077B6] dark:focus:border-[#00B4D8]/60 transition-all duration-300" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-[#90E0EF]/70 mb-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#0077B6]/20 bg-slate-50 dark:bg-[#010a18]/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#90E0EF]/30 focus:outline-none focus:border-[#0077B6] dark:focus:border-[#00B4D8]/60 transition-all duration-300" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 dark:text-[#90E0EF]/70 mb-2">Phone Number</label>
                  <input type="text" placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#0077B6]/20 bg-slate-50 dark:bg-[#010a18]/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#90E0EF]/30 focus:outline-none focus:border-[#0077B6] dark:focus:border-[#00B4D8]/60 transition-all duration-300" />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-bold text-slate-600 dark:text-[#90E0EF]/70 mb-2">Subject</label>
                <select id="contact-subject" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#0077B6]/20 bg-slate-50 dark:bg-[#010a18]/80 text-slate-600 dark:text-[#90E0EF]/70 focus:outline-none focus:border-[#0077B6] dark:focus:border-[#00B4D8]/60 transition-all duration-300">
                  <option>Select a topic</option>
                  <option>General Inquiry</option>
                  <option>Support</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 dark:text-[#90E0EF]/70 mb-2">Message</label>
                <textarea rows={5} placeholder="Write your message here..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#0077B6]/20 bg-slate-50 dark:bg-[#010a18]/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#90E0EF]/30 focus:outline-none focus:border-[#0077B6] dark:focus:border-[#00B4D8]/60 resize-none transition-all duration-300" />
              </div>
              <button type="button"
                className="group relative w-full flex justify-center items-center gap-2 py-4 rounded-xl font-bold text-white overflow-hidden shadow-[0_0_24px_rgba(0,119,182,0.3)] hover:shadow-[0_0_40px_rgba(0,119,182,0.5)] transition-all duration-300">
                <span className="absolute inset-0 bg-gradient-to-r from-[#0077B6] to-[#00B4D8]" />
                <span className="absolute inset-0 bg-gradient-to-r from-[#00B4D8] to-[#0077B6] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Send size={18} className="relative" />
                <span className="relative">Send Message</span>
              </button>
            </form>
          </motion.div>

          {/* Right – Map + Hours */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
            className="w-full lg:w-[40%] space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-[#0077B6]/15 bg-white dark:bg-[#03045E]/20 overflow-hidden shadow-sm dark:shadow-none">
              <div className="relative h-52">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80"
                  alt="Dubai office" width="900" height="600" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 dark:bg-[#010a18]/80 backdrop-blur-xl border border-[#0077B6]/20 rounded-xl px-4 py-2">
                  <MapPin size={16} className="text-[#0077B6] dark:text-[#00B4D8]" />
                  <span className="text-slate-900 dark:text-white text-sm font-bold">Dubai Creek Tower</span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-slate-500 dark:text-[#90E0EF]/60 text-sm leading-relaxed">Dubai Creek Tower - 1st St, Deira Riggat Al Buteen, Dubai, UAE</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-[#0077B6]/15 bg-white dark:bg-[#03045E]/20 p-6 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#0077B6]/10 border border-[#0077B6]/15 flex items-center justify-center text-[#0077B6] dark:text-[#00B4D8]">
                  <Clock size={18} />
                </div>
                <h4 className="text-slate-900 dark:text-white font-bold">Office Hours</h4>
              </div>
              <div className="space-y-3">
                {hours.map((h, i) => (
                  <div key={i} className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-[#0077B6]/10 last:border-0">
                    <span className="text-slate-500 dark:text-[#90E0EF]/60 text-sm font-medium">{h.day}</span>
                    {h.open
                      ? <span className="text-slate-900 dark:text-white text-sm font-bold">{h.time}</span>
                      : <span className="text-[10px] px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-500/15 border border-red-200 dark:border-red-500/25 text-red-500 dark:text-red-400 font-bold tracking-widest uppercase">Closed</span>
                    }
                  </div>
                ))}
              </div>
              <p className="text-slate-400 dark:text-[#90E0EF]/40 text-xs mt-4 leading-relaxed">All times in <strong className="text-slate-500 dark:text-[#90E0EF]/60">IST</strong>. Email support available 24/7.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

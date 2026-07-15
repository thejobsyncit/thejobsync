'use client';
import { Phone, Mail, MapPin, Home, ChevronRight, Send } from 'lucide-react';
import Link from 'next/link';

export default function ContactUs() {
  return (
    <section className="bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-gray-300 font-medium">We'd love to hear from you \u2014 reach out anytime</p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium border border-white/10">
            <Link href="/" className="flex items-center gap-1 hover:text-white text-gray-300 transition-colors">
              <Home size={16} />
              <span>Home</span>
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-300">Contact Us</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        
        {/* Get In Touch Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 
            className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 transition-colors duration-300"
          >
            Get In Touch
          </h2>
          <p 
            className="text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300"
          >
            Have a question, feedback, or need support? Fill in the form below or reach us directly \u2014 our team typically responds within 24 hours.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div 
            className="bg-white dark:bg-slate-800/80 rounded-2xl p-8 text-center border border-gray-100 dark:border-white/5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-colors duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-[#CAF0F8]/30 dark:bg-slate-700 flex items-center justify-center text-[#0077B6] mx-auto mb-6 transition-colors duration-300">
              <Phone size={24} />
            </div>
            <h3 className="text-[#0077B6] dark:text-[#00B4D8] font-bold text-sm tracking-widest uppercase mb-4 transition-colors duration-300">Phone</h3>
            <p className="text-slate-900 dark:text-white font-bold text-lg mb-2 transition-colors duration-300">+971 54 740 5625</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">Mon-Fri, 9am-6pm GST</p>
          </div>
          
          <div 
            className="bg-white dark:bg-slate-800/80 rounded-2xl p-8 text-center border border-gray-100 dark:border-white/5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-colors duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-[#CAF0F8]/30 dark:bg-slate-700 flex items-center justify-center text-[#0077B6] mx-auto mb-6 transition-colors duration-300">
              <Mail size={24} />
            </div>
            <h3 className="text-[#0077B6] dark:text-[#00B4D8] font-bold text-sm tracking-widest uppercase mb-4 transition-colors duration-300">Email</h3>
            <p className="text-[#0077B6] dark:text-[#00B4D8] font-bold text-lg mb-2 transition-colors duration-300">info@thejobsync.com</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">Response within 24 hours</p>
          </div>

          <div 
            className="bg-white dark:bg-slate-800/80 rounded-2xl p-8 text-center border border-gray-100 dark:border-white/5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-colors duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-[#CAF0F8]/30 dark:bg-slate-700 flex items-center justify-center text-[#0077B6] mx-auto mb-6 transition-colors duration-300">
              <MapPin size={24} />
            </div>
            <h3 className="text-[#0077B6] dark:text-[#00B4D8] font-bold text-sm tracking-widest uppercase mb-4 transition-colors duration-300">Address</h3>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-[15px] mb-2 leading-relaxed transition-colors duration-300">Dubai Creek Tower - 1st St<br/>Deira-Riggat Al Buteen - Dubai</p>
          </div>
        </div>

        {/* Form and Map Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Form */}
          <div className="w-full lg:w-[60%] bg-white dark:bg-slate-800/80 rounded-3xl p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-white/5 transition-colors duration-300">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 transition-colors duration-300">Send Us a Message</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 transition-colors duration-300">Fill out the form and our team will get back to you as soon as possible.</p>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">First Name</label>
                  <input type="text" placeholder="John" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-sky-500 transition-colors duration-300" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">Last Name</label>
                  <input type="text" placeholder="Doe" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-sky-500 transition-colors duration-300" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-sky-500 transition-colors duration-300" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">Phone Number</label>
                  <input type="text" placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-sky-500 transition-colors duration-300" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">Subject</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-sky-500 text-slate-500 dark:text-slate-300 bg-white dark:bg-slate-900 transition-colors duration-300">
                  <option>Select a topic</option>
                  <option>General Inquiry</option>
                  <option>Support</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">Message</label>
                <textarea rows={5} placeholder="Write your message here..." className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-sky-500 resize-none transition-colors duration-300"></textarea>
              </div>

              <button type="button" className="w-full flex justify-center items-center gap-2 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-white px-8 py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg">
                <Send size={18} />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Map and Office Info */}
          <div className="w-full lg:w-[40%] space-y-8">
            
            {/* Map Card */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-white/5 transition-colors duration-300">
              <div className="rounded-2xl overflow-hidden h-48 mb-6 relative">
                {/* Map Placeholder Image */}
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" 
                  alt="Dubai Creek Tower Map" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500">
                  <MapPin size={32} fill="currentColor" stroke="white" />
                </div>
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white mb-2 text-lg transition-colors duration-300">THEJOBSYNC Office</h4>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed transition-colors duration-300">
                  Dubai Creek Tower - 1st St<br/>
                  Deira Riggat Al Buteen Dubai
                </p>
              </div>
            </div>

            {/* Office Hours Card */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-white/5 transition-colors duration-300">
              <h3 className="text-[#0077B6] dark:text-[#00B4D8] font-bold text-sm tracking-widest uppercase mb-6 transition-colors duration-300">Office Hours</h3>
              
              <div className="space-y-4 mb-8 text-sm font-medium">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 pb-4 transition-colors duration-300">
                  <span className="text-slate-500 dark:text-slate-400">Monday \u2013 Friday</span>
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                    9:00 AM \u2013 6:00 PM 
                    <span className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full uppercase">Open</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 pb-4 transition-colors duration-300">
                  <span className="text-slate-500 dark:text-slate-400">Saturday</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">9:00 AM \u2013 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 pb-4 transition-colors duration-300">
                  <span className="text-slate-500 dark:text-slate-400">Sunday</span>
                  <span className="bg-red-50 dark:bg-red-900/50 text-red-500 dark:text-red-400 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Closed</span>
                </div>
                <div className="flex justify-between items-center pb-2 transition-colors duration-300">
                  <span className="text-slate-500 dark:text-slate-400">Public Holidays</span>
                  <span className="bg-red-50 dark:bg-red-900/50 text-red-500 dark:text-red-400 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Closed</span>
                </div>
              </div>
              
              <p className="text-slate-400 dark:text-slate-500 text-xs leading-relaxed transition-colors duration-300">
                All times are in <strong className="text-slate-500 dark:text-slate-300">Indian Standard Time (IST)</strong>. Email support is available 24/7.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

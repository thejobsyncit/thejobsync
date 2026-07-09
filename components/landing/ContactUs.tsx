'use client';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Home, ChevronRight, Send } from 'lucide-react';
import Link from 'next/link';

export default function ContactUs() {
  return (
    <section className="bg-white pb-20">
      {/* Header Banner */}
      <div className="bg-[#0a1f44] text-white py-16">
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
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold text-[#0a1f44] mb-4"
          >
            Get In Touch
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-medium"
          >
            Have a question, feedback, or need support? Fill in the form below or reach us directly \u2014 our team typically responds within 24 hours.
          </motion.p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)]"
          >
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#1e3a8a] mx-auto mb-6">
              <Phone size={24} />
            </div>
            <h3 className="text-[#1e3a8a] font-bold text-sm tracking-widest uppercase mb-4">Phone</h3>
            <p className="text-[#0a1f44] font-bold text-lg mb-2">+971 54 740 5625</p>
            <p className="text-gray-500 text-sm">Mon-Fri, 9am-6pm GST</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)]"
          >
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#1e3a8a] mx-auto mb-6">
              <Mail size={24} />
            </div>
            <h3 className="text-[#1e3a8a] font-bold text-sm tracking-widest uppercase mb-4">Email</h3>
            <p className="text-[#1e3a8a] font-bold text-lg mb-2">info@gojobsync.com</p>
            <p className="text-gray-500 text-sm">Response within 24 hours</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)]"
          >
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#1e3a8a] mx-auto mb-6">
              <MapPin size={24} />
            </div>
            <h3 className="text-[#1e3a8a] font-bold text-sm tracking-widest uppercase mb-4">Address</h3>
            <p className="text-gray-600 font-medium text-[15px] mb-2 leading-relaxed">Dubai Creek Tower - 1st St<br/>Deira-Riggat Al Buteen - Dubai</p>
          </motion.div>
        </div>

        {/* Form and Map Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Form */}
          <div className="w-full lg:w-[60%] bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-gray-100">
            <h3 className="text-2xl font-extrabold text-[#0a1f44] mb-2">Send Us a Message</h3>
            <p className="text-gray-500 font-medium mb-8">Fill out the form and our team will get back to you as soon as possible.</p>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input type="text" placeholder="John" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input type="text" placeholder="Doe" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input type="text" placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] text-gray-500 bg-white">
                  <option>Select a topic</option>
                  <option>General Inquiry</option>
                  <option>Support</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea rows={5} placeholder="Write your message here..." className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] resize-none"></textarea>
              </div>

              <button type="button" className="w-full flex justify-center items-center gap-2 bg-[#1e3a8a] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#172554] transition-colors shadow-lg">
                <Send size={18} />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Map and Office Info */}
          <div className="w-full lg:w-[40%] space-y-8">
            
            {/* Map Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-gray-100">
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
                <h4 className="font-extrabold text-[#0a1f44] mb-2 text-lg">GOJOBSYNC Office</h4>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">
                  Dubai Creek Tower - 1st St<br/>
                  Deira Riggat Al Buteen Dubai
                </p>
              </div>
            </div>

            {/* Office Hours Card */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-gray-100">
              <h3 className="text-[#1e3a8a] font-bold text-sm tracking-widest uppercase mb-6">Office Hours</h3>
              
              <div className="space-y-4 mb-8 text-sm font-medium">
                <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                  <span className="text-gray-500">Monday \u2013 Friday</span>
                  <div className="flex items-center gap-2 text-gray-800 font-bold">
                    9:00 AM \u2013 6:00 PM 
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase">Open</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                  <span className="text-gray-500">Saturday</span>
                  <span className="text-gray-800 font-bold">9:00 AM \u2013 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                  <span className="text-gray-500">Sunday</span>
                  <span className="bg-red-50 text-red-500 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Closed</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-gray-500">Public Holidays</span>
                  <span className="bg-red-50 text-red-500 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Closed</span>
                </div>
              </div>
              
              <p className="text-gray-400 text-xs leading-relaxed">
                All times are in <strong className="text-gray-500">Indian Standard Time (IST)</strong>. Email support is available 24/7.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

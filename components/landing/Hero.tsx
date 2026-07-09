'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Monitor, ChevronDown, ChevronDownIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const industryData = [
  {
    category: 'I - Primary Sector',
    items: ['I-1 Agriculture', 'I-2 Fishing', 'I-3 Forestry', 'I-4 Mining', 'I-5 Oil & Gas E&P']
  },
  {
    category: 'II - Manufacturing & Construction',
    items: ['II-1 Aerospace & Defense', 'II-2 Automotive', 'II-3 Chemicals', 'II-4 Construction', 'II-5 Electronics', 'II-6 Food Processing', 'II-7 Heavy Machinery', 'II-8 Pharmaceuticals & Biotech', 'II-9 Steel & Metals', 'II-10 Textiles']
  },
  {
    category: 'III - Services',
    items: ['III-1 Accommodation & Food Services', 'III-2 Advertising & Marketing']
  }
];

const locationData = [
  'Mumbai, Maharashtra',
  'Delhi',
  'Bangalore, Karnataka',
  'Dubai Creek Tower - 1st St, Deira-Riggat Al Buteen - Dubai',
  'Hyderabad, Telangana',
  'Kolkata, West Bengal',
  'Pune, Maharashtra',
  'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan',
  'Surat, Gujarat',
  'Lucknow, Uttar Pradesh',
  'Kanpur, Uttar Pradesh',
  'Nagpur, Maharashtra',
  'Indore, Madhya Pradesh',
  'Bhopal, Madhya Pradesh',
  'Visakhapatnam, Andhra Pradesh',
  'Patna, Bihar',
  'Vadodara, Gujarat',
  'Noida, Uttar Pradesh'
];

const jobData = [
  'Software Developer',
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile App Developer',
  'Android Developer',
  'iOS Developer',
  'Data Scientist',
  'Data Analyst',
  'Machine Learning Engineer',
  'AI Engineer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Cybersecurity Analyst',
  'Network Engineer',
  'Database Administrator',
  'UI/UX Designer',
  'Graphic Designer'
];

export default function Hero() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedJob, setSelectedJob] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-white">
      {/* Main Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat mt-[45vh]"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=2850&q=80")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Floating Circular Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block absolute right-0 top-0 w-[400px] h-[400px] rounded-full border-[12px] border-white shadow-2xl overflow-hidden z-20"
        >
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" 
            alt="Professionals" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="text-center lg:text-left max-w-4xl mx-auto lg:mx-0 relative z-30">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-6xl lg:text-[76px] font-extrabold text-[#0a1f44] tracking-tight mb-6 leading-tight"
          >
            Navigate your Jobs here!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 italic font-medium max-w-2xl mb-12 mx-auto lg:mx-0"
          >
            "Lakhs of Employers. Millions of Job seekers. Endless success \u2014 only on GOJOBSYNC.COM."
          </motion.p>
          
          {/* Search Bar */}
          <div ref={dropdownRef} className="relative w-full max-w-4xl mx-auto lg:mx-0 z-50">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="bg-white rounded-full shadow-2xl p-2 flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-200 border border-gray-100 relative z-50"
            >
              
              {/* Industry */}
              <div 
                className="flex-1 flex items-center justify-between gap-3 px-6 py-4 md:py-2 w-full cursor-pointer hover:bg-gray-50 rounded-t-3xl md:rounded-l-full md:rounded-tr-none transition-colors relative"
                onClick={() => setActiveDropdown(activeDropdown === 'industry' ? null : 'industry')}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Monitor className="text-gray-400 flex-shrink-0" size={20} />
                  <p className="text-gray-600 font-medium text-sm md:text-base truncate">
                    {selectedIndustry || 'Industry'}
                  </p>
                </div>
                <ChevronDown className={`text-gray-400 transition-transform ${activeDropdown === 'industry' ? 'rotate-180' : ''}`} size={16} />
              </div>

              {/* Location */}
              <div 
                className="flex-1 flex items-center justify-between gap-3 px-6 py-4 md:py-2 w-full cursor-pointer hover:bg-gray-50 transition-colors relative"
                onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MapPin className="text-gray-400 flex-shrink-0" size={20} />
                  <p className={`font-medium text-sm md:text-base truncate ${selectedLocation ? 'text-gray-800' : 'text-gray-500'}`}>
                    {selectedLocation || 'Location'}
                  </p>
                </div>
                <ChevronDownIcon className={`text-gray-400 transition-transform ${activeDropdown === 'location' ? 'rotate-180' : ''}`} size={16} />
              </div>

              {/* Job Title */}
              <div 
                className="flex-[1.5] flex items-center justify-between gap-3 px-6 py-4 md:py-2 w-full cursor-pointer hover:bg-gray-50 transition-colors relative"
                onClick={() => setActiveDropdown(activeDropdown === 'job' ? null : 'job')}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Search className="text-gray-400 flex-shrink-0" size={20} />
                  <p className={`font-medium text-sm md:text-base truncate ${selectedJob ? 'text-gray-800' : 'text-gray-500'}`}>
                    {selectedJob || 'Job title, keyword...'}
                  </p>
                </div>
                <ChevronDownIcon className={`text-gray-400 transition-transform ${activeDropdown === 'job' ? 'rotate-180' : ''}`} size={16} />
              </div>

              {/* Submit Button */}
              <div className="px-2 pb-2 pt-2 md:p-0 w-full md:w-auto h-full flex items-center">
                <button 
                  onClick={() => setActiveDropdown(null)}
                  className="w-full md:w-auto bg-[#1e3a8a] text-white px-8 py-4 md:py-3.5 rounded-full font-bold hover:bg-[#172554] transition-colors shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Search size={18} strokeWidth={2.5} />
                  <span>Search</span>
                </button>
              </div>
            </motion.div>

            {/* Dropdowns */}
            <AnimatePresence>
              
              {/* Industry Dropdown */}
              {activeDropdown === 'industry' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[110%] left-0 w-full md:w-[350px] bg-white border border-gray-200 shadow-xl rounded-lg max-h-[400px] overflow-y-auto z-50 p-2"
                >
                  {industryData.map((category, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="font-bold text-[#0a1f44] text-sm px-3 py-2 bg-gray-50 rounded-md mb-1">
                        {category.category}
                      </div>
                      {category.items.map((item, i) => (
                        <div 
                          key={i} 
                          className="px-3 py-2 text-sm text-gray-600 hover:bg-[#1e3a8a] hover:text-white cursor-pointer rounded-md transition-colors"
                          onClick={() => {
                            setSelectedIndustry(item);
                            setActiveDropdown(null);
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Location Dropdown */}
              {activeDropdown === 'location' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[110%] left-0 md:left-[25%] w-full md:w-[350px] bg-[#1a1a1a] border border-[#333] shadow-xl rounded-lg max-h-[400px] overflow-y-auto z-50 py-2"
                >
                  {locationData.map((item, i) => (
                    <div 
                      key={i} 
                      className="px-4 py-2.5 text-sm text-gray-300 hover:bg-[#333] hover:text-white cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedLocation(item);
                        setActiveDropdown(null);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Job Dropdown */}
              {activeDropdown === 'job' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[110%] left-0 md:left-[50%] w-full md:w-[350px] bg-[#1a1a1a] border border-[#333] shadow-xl rounded-lg max-h-[400px] overflow-y-auto z-50 py-2"
                >
                  {jobData.map((item, i) => (
                    <div 
                      key={i} 
                      className="px-4 py-2.5 text-sm text-gray-300 hover:bg-[#333] hover:text-white cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedJob(item);
                        setActiveDropdown(null);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Spacer to push content up and show background image below */}
      <div className="h-[30vh] lg:h-[45vh]"></div>
    </div>
  );
}

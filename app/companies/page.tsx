import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';
import { Lightbulb, Users, User } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Companies | GOJOBSYNC',
  description: 'Explore dynamic companies across every major industry sector on GOJOBSYNC.'
};

export default function CompaniesPage() {
  const primarySectors = [
    { id: 'I - 1', title: 'Agriculture', description: 'Farming, crop production, and raising livestock.', image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80' },
    { id: 'I - 2', title: 'Fishing', description: 'Harvesting fish and other marine life.', image: 'https://images.unsplash.com/photo-1520632617758-c0b892a40e2b?auto=format&fit=crop&w=600&q=80' },
    { id: 'I - 3', title: 'Forestry', description: 'Management and harvesting of timber.', image: 'https://images.unsplash.com/photo-1448375240586-882707db8855?auto=format&fit=crop&w=600&q=80' },
    { id: 'I - 4', title: 'Mining', description: 'Extraction of minerals, metals, coal.', image: 'https://images.unsplash.com/photo-1578330752538-2e06186b510c?auto=format&fit=crop&w=600&q=80' },
    { id: 'I - 5', title: 'Oil & Gas E&P', description: 'Activities related to finding and extracting petroleum and natural gas.', image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=600&q=80' }
  ];

  const secondarySectors = [
    { id: 'II - 1', title: 'Aerospace & Defense', description: 'Manufacturing of aircraft, spacecraft, and military equipment.', image: 'https://images.unsplash.com/photo-1517409249714-2566ab6660fc?auto=format&fit=crop&w=600&q=80' },
    { id: 'II - 2', title: 'Automotive', description: 'Design, development, and manufacturing of motor vehicles and components.', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80' },
    { id: 'II - 3', title: 'Chemicals', description: 'Production of basic, specialty, and petrochemicals.', image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=600&q=80' },
    { id: 'II - 4', title: 'Construction', description: 'Building and maintenance of residential, commercial, and industrial structures.', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80' },
    { id: 'II - 5', title: 'Electronics', description: 'Design and manufacturing of electronic devices, computers, and telecom equipment.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' },
    { id: 'II - 6', title: 'Food Processing', description: 'Transforming raw agricultural products into packaged food and beverages.', image: 'https://images.unsplash.com/photo-1621317666993-27715694c1e4?auto=format&fit=crop&w=600&q=80' },
    { id: 'II - 7', title: 'Heavy Machinery', description: 'Manufacturing large-scale industrial machinery and equipment.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80' },
    { id: 'II - 8', title: 'Pharmaceuticals & Biotech', description: 'Research, development, and production of medications and biotech solutions.', image: 'https://images.unsplash.com/photo-1584308666744-24d59f29822d?auto=format&fit=crop&w=600&q=80' },
    { id: 'II - 9', title: 'Steel & Metals Production', description: 'Production of steel and other metals from raw materials.', image: 'https://images.unsplash.com/photo-1533604336064-a6b185ec2062?auto=format&fit=crop&w=600&q=80' },
    { id: 'II - 10', title: 'Textiles', description: 'Manufacturing of fabrics, clothing, and other textile products.', image: 'https://images.unsplash.com/photo-1558024220-b633d7350711?auto=format&fit=crop&w=600&q=80' }
  ];

  const tertiarySectors = [
    { id: 'III - 1', title: 'Accommodation & Food Services', description: 'Hotels, motels, restaurants, and bars.', image: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=600&q=80' },
    { id: 'III - 2', title: 'Advertising & Marketing', description: 'Services related to promoting products and brands to consumers.', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80' },
    { id: 'III - 3', title: 'Financial Services', description: 'Banking, insurance, investment, and asset management.', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80' },
    { id: 'III - 4', title: 'Healthcare Services', description: 'Provision of medical care through hospitals and clinics.', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80' },
    { id: 'III - 5', title: 'IT Services & Software', description: 'Development, maintenance, and distribution of software and IT solutions.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' },
    { id: 'III - 6', title: 'Legal Services', description: 'Provision of legal advice, representation, and related services.', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80' },
    { id: 'III - 7', title: 'Media & Entertainment', description: 'Production and distribution of content via film, TV, music, and online platforms.', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80' },
    { id: 'III - 8', title: 'Real Estate', description: 'Development, sales, leasing, and property management services.', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80' },
    { id: 'III - 9', title: 'Retail & Wholesale', description: 'Sale of goods directly to consumers or as an intermediary to businesses.', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80' },
    { id: 'III - 10', title: 'Telecommunications', description: 'Provision of voice, data, and internet connectivity services.', image: 'https://images.unsplash.com/photo-1516322074411-19fd41243422?auto=format&fit=crop&w=600&q=80' },
    { id: 'III - 11', title: 'Transportation & Logistics', description: 'Movement of people and goods and supply chain management.', image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?auto=format&fit=crop&w=600&q=80' },
    { id: 'III - 12', title: 'Utilities', description: 'Provision of electricity, natural gas, and water services.', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80' }
  ];

  const quaternarySectors = [
    { id: 'IV - 1', title: 'Education', description: 'Academic institutions, training centers, and online learning platforms.', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80' },
    { id: 'IV - 2', title: 'Information Services', description: 'Data processing, market research, and consultancy.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' },
    { id: 'IV - 3', title: 'Research & Development', description: 'Scientific and technological research linked to professional services.', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80' }
  ];

  const row1Partners = [
    { name: 'Wipro', code: 'WPR', color: 'bg-red-500' },
    { name: 'HCL Technologies', code: 'HCL', color: 'bg-teal-500' },
    { name: 'Accenture', code: 'ACN', color: 'bg-purple-600' },
    { name: 'Amazon', code: 'AMZ', color: 'bg-orange-500' },
    { name: 'Google', code: 'GOO', color: 'bg-green-500' },
    { name: 'Microsoft', code: 'MIC', color: 'bg-blue-600' },
    { name: 'Meta', code: 'MET', color: 'bg-pink-500' },
    { name: 'Apple', code: 'APL', color: 'bg-gray-300' }
  ];

  const row2Partners = [
    { name: 'Flipkart', code: 'FLK', color: 'bg-purple-600' },
    { name: 'Deloitte', code: 'DEL', color: 'bg-green-600' },
    { name: 'PwC', code: 'PwC', color: 'bg-red-600' },
    { name: 'Ernst & Young', code: 'EY', color: 'bg-blue-600' },
    { name: 'KPMG', code: 'KPM', color: 'bg-purple-400' },
    { name: 'Reliance Ind.', code: 'REL', color: 'bg-orange-400' },
    { name: 'HDFC Bank', code: 'HDR', color: 'bg-pink-500' },
    { name: 'ICICI Bank', code: 'ICI', color: 'bg-sky-200 text-sky-800' }
  ];

  return (
    <main className="min-h-screen bg-white font-sans overflow-x-hidden pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-white pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#0a1f44] tracking-tight mb-4">
            Navigate your Job posts here!
          </h1>
          <p className="text-lg md:text-xl text-gray-500 italic mb-8 max-w-3xl mx-auto">
            "Lakhs of Employers. Millions of Job seekers. Endless success — only on GOJOBSYNC.COM."
          </p>
          <Link href="/post-job" className="inline-block">
            <button className="bg-[#1e3a8a] text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-[#172554] transition-colors flex items-center gap-2 mx-auto">
              <span>🚀</span> Post a Job
            </button>
          </Link>
        </div>

        {/* Floating Circular Image on Right */}
        <div className="hidden lg:block absolute top-10 right-10 w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl z-20">
          <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80" alt="Team Silhouette" className="w-full h-full object-cover" />
        </div>

        {/* Large Bottom Image */}
        <div className="mt-16 relative w-full h-[400px]">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80" 
            alt="Business Meeting" 
            className="w-full h-full object-cover rounded-t-[3rem]"
          />
        </div>
      </section>

      {/* Breadcrumbs & About Companies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-12 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Link href="/" className="hover:text-[#1e3a8a]">Home</Link>
            <span>›</span>
            <span className="text-[#0a1f44] font-semibold">Companies</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Text Column */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#1e3a8a] uppercase tracking-wider mb-4">
                <div className="w-4 h-4 rounded-full border-2 border-[#1e3a8a] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-[#1e3a8a] rounded-full"></span>
                </div>
                About Companies on GoJobSync
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#0a1f44] leading-tight mb-6">
                Where Talent Meets<br/>Industry
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed mb-8">
                <p>
                  GOJOBSYNC brings together some of the world's most dynamic companies across every major industry sector. Whether you're a fresh graduate exploring your first career step or a seasoned professional seeking your next challenge, our platform connects you directly to the organizations that are shaping tomorrow.
                </p>
                <p>
                  From global conglomerates in energy and manufacturing to disruptive startups in technology and information services — every company listed on GOJOBSYNC is vetted, active, and actively hiring.
                </p>
              </div>

              {/* Alert Box */}
              <div className="bg-blue-50 border-l-4 border-[#1e3a8a] rounded-r-xl p-6 flex gap-4 shadow-sm">
                <Lightbulb className="text-yellow-500 flex-shrink-0" size={24} />
                <p className="text-[#0a1f44] font-medium text-sm leading-relaxed">
                  <span className="font-bold">Did you know?</span> Companies on GOJOBSYNC receive applications from over 140 countries, giving employers access to a truly global talent pool — and giving candidates access to international opportunities, all from one platform.
                </p>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" 
                alt="Modern Skyscrapers" 
                className="w-full h-[600px] object-cover rounded-3xl shadow-xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-[#1e3a8a]">
                  <Users size={28} />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#0a1f44]">500+</div>
                  <div className="text-gray-500 text-sm font-medium">Partner Companies</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Sectors Section */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#1e3a8a] font-bold text-xs tracking-widest uppercase rounded-full mb-4">
              Industry Sectors
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0a1f44] mb-6">
              All Major Industry Sectors
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Explore every economic sector — from raw material extraction to the knowledge economy — and find where your skills and ambitions align.
            </p>
          </div>

          <div className="space-y-16">
            {/* Sector I */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#3b82f6] text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-md flex-shrink-0">
                  I
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0a1f44]">Primary Sector (Raw Materials)</h3>
                  <p className="text-gray-500 text-sm mt-1">This sector involves the extraction and production of raw materials and natural resources.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {primarySectors.map((sector) => (
                  <div key={sector.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group">
                    <div className="h-48 overflow-hidden">
                      <img src={sector.image} alt={sector.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <span className="text-[#3b82f6] text-xs font-bold tracking-wider mb-2 block">{sector.id}</span>
                      <h4 className="text-[#0a1f44] font-bold text-lg mb-2">{sector.title}</h4>
                      <p className="text-gray-500 text-sm line-clamp-2">{sector.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sector II */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#3b82f6] text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-md flex-shrink-0">
                  II
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0a1f44]">Secondary Sector (Manufacturing & Construction)</h3>
                  <p className="text-gray-500 text-sm mt-1">This sector processes raw materials into finished goods and includes the construction industry.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {secondarySectors.map((sector) => (
                  <div key={sector.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group">
                    <div className="h-48 overflow-hidden">
                      <img src={sector.image} alt={sector.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <span className="text-[#3b82f6] text-xs font-bold tracking-wider mb-2 block">{sector.id}</span>
                      <h4 className="text-[#0a1f44] font-bold text-lg mb-2">{sector.title}</h4>
                      <p className="text-gray-500 text-sm line-clamp-2">{sector.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sector III */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#3b82f6] text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-md flex-shrink-0">
                  III
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0a1f44]">Tertiary Sector (Services)</h3>
                  <p className="text-gray-500 text-sm mt-1">Known as the service sector, this area provides services to consumers and businesses.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {tertiarySectors.map((sector) => (
                  <div key={sector.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group">
                    <div className="h-48 overflow-hidden">
                      <img src={sector.image} alt={sector.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <span className="text-[#3b82f6] text-xs font-bold tracking-wider mb-2 block">{sector.id}</span>
                      <h4 className="text-[#0a1f44] font-bold text-lg mb-2">{sector.title}</h4>
                      <p className="text-gray-500 text-sm line-clamp-2">{sector.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sector IV */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#3b82f6] text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-md flex-shrink-0">
                  IV
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0a1f44]">Quaternary Sector (Knowledge & Information)</h3>
                  <p className="text-gray-500 text-sm mt-1">This sector is information and knowledge-based, focusing on intellectual activities.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quaternarySectors.map((sector) => (
                  <div key={sector.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group">
                    <div className="h-48 overflow-hidden">
                      <img src={sector.image} alt={sector.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <span className="text-[#3b82f6] text-xs font-bold tracking-wider mb-2 block">{sector.id}</span>
                      <h4 className="text-[#0a1f44] font-bold text-lg mb-2">{sector.title}</h4>
                      <p className="text-gray-500 text-sm line-clamp-2">{sector.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Companies Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#1e3a8a] font-bold text-xs tracking-widest uppercase rounded-full mb-4">
            TIED-UP COMPANIES
          </span>
          <h2 className="text-4xl font-extrabold text-[#0a1f44] mb-6">Our Partner Companies</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg mb-16">
            Leading organisations across every industry have partnered with GOJOBSYNC to find the best talent.
          </p>

          <div className="relative overflow-hidden w-full mb-16 select-none flex flex-col gap-6">
            {/* Gradient overlays for smooth fading edges */}
            <div className="absolute top-0 left-0 w-20 md:w-40 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-20 md:w-40 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            {/* Row 1 Marquee */}
            <div className="flex w-max animate-marquee space-x-6 group hover:[animation-play-state:paused]">
              {[...row1Partners, ...row1Partners, ...row1Partners, ...row1Partners].map((partner, idx) => (
                <div key={`r1-${idx}`} className="bg-white border border-gray-100 rounded-3xl p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0 cursor-pointer group/card">
                  <div className={`w-14 h-14 rounded-2xl text-white font-extrabold flex items-center justify-center text-sm mb-4 group-hover/card:scale-110 transition-transform ${partner.color}`}>
                    {partner.code}
                  </div>
                  <span className="text-sm font-bold text-gray-600 text-center">{partner.name}</span>
                </div>
              ))}
            </div>

            {/* Row 2 Marquee - Reverse Scroll */}
            <div className="flex w-max animate-marquee space-x-6 group hover:[animation-play-state:paused]" style={{ animationDirection: 'reverse' }}>
              {[...row2Partners, ...row2Partners, ...row2Partners, ...row2Partners].map((partner, idx) => (
                <div key={`r2-${idx}`} className="bg-white border border-gray-100 rounded-3xl p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0 cursor-pointer group/card">
                  <div className={`w-14 h-14 rounded-2xl text-white font-extrabold flex items-center justify-center text-sm mb-4 group-hover/card:scale-110 transition-transform ${partner.color}`}>
                    {partner.code}
                  </div>
                  <span className="text-sm font-bold text-gray-600 text-center">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-500 font-medium mb-6">Are you a company looking to partner with GOJOBSYNC?</p>
          <Link href="/post-job" className="inline-block">
            <button className="bg-[#1e3a8a] text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-[#172554] transition-colors flex items-center gap-2 mx-auto">
              <User size={18} strokeWidth={2.5} />
              <span>Become a Partner & Post Jobs</span>
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

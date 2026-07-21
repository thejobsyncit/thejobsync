'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEmployerAuth } from '@/context/EmployerAuthContext';
import {
  Search, Filter, Download, Briefcase, MapPin, Building2,
  ChevronLeft, ChevronRight, User, X, Bookmark, DollarSign, ChevronDown, ChevronUp
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { DEPARTMENTS, SALARY_RANGES, DEPARTMENT_ROLES } from '@/lib/constants';
import { getAllStates, getDistricts } from 'india-state-district';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  headline: string | null;
  skills: string;
  experience: string | null;
  education: string | null;
  location: string | null;
  currentCompany: string | null;
  currentRole: string | null;
  expectedSalary: string | null;
  preferredRoles: string | null;
  photoUrl?: string | null;
  createdAt: string;
  isSaved?: boolean;
  languages?: string | null;
}

function parseLocation(loc: string | null): { state: string; district: string; city: string; address: string } {
  if (!loc) return { state: '', district: '', city: '', address: '' };
  if (loc.startsWith('{')) {
    try {
      const p = JSON.parse(loc);
      return { state: p.state || '', district: p.district || '', city: p.city || '', address: p.address || '' };
    } catch { /* */ }
  }
  return { state: '', district: '', city: loc, address: '' };
}

function formatLocation(loc: string | null): string {
  const p = parseLocation(loc);
  return [p.city, p.district, p.state].filter(Boolean).join(', ') || '-';
}




// Maps each department to relevant keywords to search in candidate profiles
const DEPARTMENT_KEYWORDS: Record<string, string> = {
  'Engineering - Software & QA': 'software,developer,engineer,programmer,QA,testing,frontend,backend,fullstack,devops,react,java,python,nodejs,angular,vue,coding',
  'Sales & Business Development': 'sales,business development,BD,account executive,BDE,BDM,client acquisition,revenue,target,lead generation',
  'Customer Success, Service & Operations': 'customer success,customer service,support,operations,CRM,client support,helpdesk,service desk,account management',
  'Finance & Accounting': 'finance,accounting,CA,accountant,CPA,GST,taxation,audit,bookkeeping,financial analyst,tally,CFO',
  'Production, Manufacturing & Engineering': 'production,manufacturing,mechanical,industrial engineer,plant,factory,assembly,quality control,lean,6 sigma',
  'BFSI, Investments & Trading': 'banking,financial services,insurance,investment,trading,BFSI,equity,mutual fund,loan,credit,relationship manager',
  'Human Resources': 'HR,human resources,recruiter,talent acquisition,payroll,HRBP,people operations,employee relations',
  'IT & Information Security': 'IT,information security,cybersecurity,network,sysadmin,cloud,AWS,Azure,infrastructure,CCNA,CEH,ethical hacking',
  'Marketing & Communication': 'marketing,digital marketing,SEO,SEM,social media,content marketing,brand,campaign,communications,PR',
  'Data Science & Analytics': 'data science,data analyst,machine learning,AI,analytics,Python,R,SQL,Power BI,Tableau,statistics,big data',
  'Consulting': 'consultant,consulting,management consulting,strategy,advisory,business analyst',
  'Healthcare & Life Sciences': 'doctor,nurse,physician,healthcare,medical,MBBS,BDS,dentist,pharmacist,physiotherapist,radiologist,xray,X-ray,hospital,clinical,paramedic,lab technician,life sciences',
  'Administration & Facilities': 'admin,administration,office manager,facilities,front office,receptionist,executive assistant,secretary',
  'Project & Program Management': 'project manager,program manager,PMP,scrum master,agile,PMO,project coordinator,delivery manager',
  'Procurement & Supply Chain': 'procurement,supply chain,logistics,purchasing,vendor management,sourcing,inventory,warehouse',
  'Engineering - Hardware & Networks': 'hardware,network engineer,embedded,VLSI,PCB,circuit,Cisco,Juniper,telecom,RF,CCNP',
  'Construction & Site Engineering': 'civil engineer,construction,site engineer,architecture,structural,AutoCAD,project site,contractor',
  'Teaching & Training': 'teacher,trainer,professor,lecturer,faculty,educator,tutor,coach,academic,school,college',
  'UX, Design & Architecture': 'UX,UI,designer,product design,Figma,Adobe,graphic,visual design,architecture,interior design',
  'Research & Development': 'research,R&D,scientist,laboratory,innovation,biotech,pharma research,experimental',
  'Quality Assurance': 'quality assurance,QA,quality control,QC,inspector,ISO,testing,compliance,auditor',
  'Food, Beverage & Hospitality': 'food,beverage,hospitality,chef,hotel,restaurant,catering,culinary,housekeeping,front desk',
  'Legal & Regulatory': 'legal,lawyer,advocate,compliance,regulatory,LLB,corporate law,contract,litigation',
  'Product Management': 'product manager,product owner,PM,product roadmap,agile,PRD,product strategy',
  'Content, Editorial & Journalism': 'content,writer,editor,journalist,copywriter,blogger,media,editorial,storytelling',
  'Environment, Health & Safety': 'EHS,environment,health safety,HSE,safety officer,environmental engineer,fire safety',
  'Risk Management & Compliance': 'risk,compliance,risk manager,internal audit,fraud,governance,regulatory',
  'Merchandising, Retail & eCommerce': 'retail,merchandising,ecommerce,store manager,buyer,visual merchandiser,e-commerce,Amazon,Flipkart',
  'Strategic & Top Management': 'CEO,COO,CFO,CTO,director,VP,senior management,C-suite,strategy,leadership',
  'Media Production & Entertainment': 'media,production,video editor,film,animation,VFX,broadcast,content creator,YouTube',
  'Security Services': 'security,guard,surveillance,CCTV,fire safety,physical security,security officer',
  'Sports, Fitness & Personal Care': 'sports,fitness,gym,trainer,yoga,physiotherapy,nutrition,wellness,dietitian',
  'CSR & Social Service': 'CSR,NGO,social work,nonprofit,community development,welfare,volunteer',
  'Aviation & Aerospace': 'aviation,aerospace,pilot,cabin crew,airport,aircraft,ATC,ground staff,airline',
  'Energy & Mining': 'energy,oil,gas,mining,power,renewable,solar,wind,electrical engineer,petroleum',
  'Shipping & Maritime': 'shipping,maritime,sailor,captain,marine,logistics,port,cargo,freight',
};

function getDeptKeywords(dept: string): string {
  return DEPARTMENT_KEYWORDS[dept] || dept;
}

function getRoleKeywords(role: string): string {
  if (!role || role === 'Other') return role;
  
  const keywords = [role];
  
  // Split role into individual words (longer than 3 chars to ignore 'and', 'for', etc)
  const words = role.split(/[\s&/-]+/).filter(w => w.length > 3);
  
  words.forEach(w => {
    keywords.push(w);
    // Add stemmed version for common suffixes to catch typos (e.g. developeer -> develop)
    const lower = w.toLowerCase();
    if (lower.endsWith('er')) {
      keywords.push(w.slice(0, -2)); // Developer -> Develop
    } else if (lower.endsWith('ing')) {
      keywords.push(w.slice(0, -3)); // Engineering -> Engineer
    } else if (lower.endsWith('ive')) {
      keywords.push(w.slice(0, -3)); // Executive -> Execut
    }
  });
  
  // Remove duplicates and join
  return Array.from(new Set(keywords)).join(',');
}

const allStates = getAllStates();

function SidebarSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        className="w-full flex items-center justify-between text-sm font-bold text-slate-700 mb-3"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>
      {open && children}
    </div>
  );
}

export default function EmployerCandidatesPage() {
  const router = useRouter();
  const { employer, isLoading } = useEmployerAuth();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [fetching, setFetching] = useState(true);

  const [search, setSearch] = useState('');
  const [field, setField] = useState('');
  const [role, setRole] = useState('');
  const [locationText, setLocationText] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [salary, setSalary] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showAppliedOnly, setShowAppliedOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    setSendingEmail(true);
    setEmailError('');
    try {
      const res = await fetch('/api/employer/candidates/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: selectedCandidate.email,
          subject: emailSubject,
          message: emailBody,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEmailError(data.error || 'Failed to send email');
      } else {
        setEmailSuccess(true);
        setTimeout(() => {
          setShowEmailModal(false);
          setEmailSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setEmailError('Something went wrong. Please try again.');
    }
    setSendingEmail(false);
  };

  useEffect(() => {
    if (!isLoading && !employer) {
      router.push('/employer/login');
    }
  }, [employer, isLoading, router]);

  // Build location filter from sidebar selections
  useEffect(() => {
    if (selectedCity) setLocationText(selectedCity);
    else if (selectedDistrict) setLocationText(selectedDistrict);
    else if (selectedState) {
      const stateName = allStates.find((s: any) => s.code === selectedState)?.name || '';
      setLocationText(stateName);
    } else {
      setLocationText('');
    }
    setPage(1);
  }, [selectedState, selectedDistrict, selectedCity]);

  const fetchCandidates = useCallback(async () => {
    setFetching(true);
    try {
      const fieldQuery = role && role !== 'Other' ? getRoleKeywords(role) : getDeptKeywords(field);
      const query = new URLSearchParams({ 
        search, 
        field: fieldQuery, 
        location: locationText, 
        salary, 
        page: page.toString() 
      });
      if (showAppliedOnly) query.append('applied', 'true');

      const res = await fetch(`/api/employer/candidates?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
        setTotalCandidates(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    }
    setFetching(false);
  }, [search, field, role, locationText, salary, page, showAppliedOnly]);

  const handleToggleSave = async (id: string, currentlySaved: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setCandidates(cands => cands.map(c => c.id === id ? { ...c, isSaved: !currentlySaved } : c));
      await fetch('/api/employer/candidates/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: id, action: currentlySaved ? 'unsave' : 'save' })
      });
    } catch (err) {
      setCandidates(cands => cands.map(c => c.id === id ? { ...c, isSaved: currentlySaved } : c));
    }
  };

  useEffect(() => {
    if (!employer) return;
    const timer = setTimeout(() => { fetchCandidates(); }, 400);
    return () => clearTimeout(timer);
  }, [fetchCandidates, employer]);

  const clearAllFilters = () => {
    setSearch(''); setField(''); setRole(''); setLocationText(''); setSelectedState('');
    setSelectedDistrict(''); setSelectedCity(''); setSalary(''); setPage(1);
  };

  const hasActiveFilters = search || field || role || locationText || salary;

  const handleExportExcel = () => {
    try {
      const formattedData = candidates.map(c => {
        let skillsArr: string[] = [];
        try { skillsArr = JSON.parse(c.skills); } catch { skillsArr = []; }
        return {
          'Candidate Name': c.name,
          'Email': c.email,
          'Phone': c.phone,
          'Headline': c.headline || '-',
          'Skills': Array.isArray(skillsArr) ? skillsArr.join(', ') : c.skills,
          'Current Company': c.currentCompany || '-',
          'Current Role': c.currentRole || '-',
          'Location': formatLocation(c.location),
          'Preferred Roles / Field': c.preferredRoles || '-',
          'Expected Salary': c.expectedSalary || '-',
          'Registered On': new Date(c.createdAt).toLocaleDateString(),
        };
      });
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates');
      XLSX.writeFile(workbook, `Candidates_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export data');
    }
  };

  if (isLoading || !employer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0077B6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const districts = selectedState ? getDistricts(selectedState) : [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/loooo.jpeg" alt="The jobsync Logo" className="h-9 w-9 object-contain rounded-full border border-gray-200" />
            <div>
              <div className="font-extrabold text-slate-900 text-sm leading-none">The jobsync</div>
              <div className="text-[#03045E] text-[10px] font-semibold mt-0.5 uppercase tracking-wider">Employer Portal</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/employer/dashboard" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#03045E] hover:bg-[#CAF0F8]/20 rounded-lg transition-colors">
              Dashboard
            </Link>
            <span className="px-4 py-2 text-sm font-semibold text-[#03045E] bg-[#CAF0F8]/30 rounded-lg flex items-center gap-1.5">
              <Search size={14} /> Candidates
            </span>
          </nav>
          <div className="w-20 hidden md:block" />
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Candidate Database</h1>
            <p className="text-slate-500 text-sm mt-1">Search and filter to find the perfect fit for your roles.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Filter size={16} /> {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button
              onClick={() => {
                setShowAppliedOnly(!showAppliedOnly);
                setPage(1); // Reset page on toggle
              }}
              className={`flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors text-sm ${showAppliedOnly ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              <Briefcase size={16} className={showAppliedOnly ? "text-indigo-700" : ""} />
              {showAppliedOnly ? "Showing Applied" : "Show Applied"}
            </button>
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors text-sm ${showSavedOnly ? 'bg-[#90E0EF]/30 text-sky-700 border border-sky-200' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              <Bookmark size={16} className={showSavedOnly ? "fill-sky-700" : ""} />
              {showSavedOnly ? "Showing Saved" : "Show Saved"}
            </button>
            <button
              onClick={handleExportExcel}
              disabled={candidates.length === 0}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition-colors text-sm disabled:opacity-50"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Main Layout: Sidebar + Content */}
        <div className="flex gap-6 items-start">

          {/* Sidebar Filters */}
          {sidebarOpen && (
            <aside className="w-72 shrink-0 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                  <Filter size={16} className="text-[#0077B6]" /> Filters
                </h2>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors">
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              <SidebarSection title="Search">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Name, skills, role..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0077B6] bg-slate-50 focus:bg-white transition-all"
                  />
                </div>
              </SidebarSection>

              {/* Department */}
              <SidebarSection title="Department">
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scroll">
                  <button
                    onClick={() => { setField(''); setRole(''); setPage(1); }}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors font-medium ${!field ? 'bg-[#0077B6] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    All Departments
                  </button>
                  {DEPARTMENTS.map(d => (
                    <button
                      key={d}
                      onClick={() => { setField(field === d ? '' : d); setRole(''); setPage(1); }}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${field === d ? 'bg-[#0077B6] text-white font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </SidebarSection>

              {/* Role */}
              {field && DEPARTMENT_ROLES[field] && (
                <SidebarSection title="Role">
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scroll">
                    <button
                      onClick={() => { setRole(''); setPage(1); }}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors font-medium ${!role ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      All Roles
                    </button>
                    {DEPARTMENT_ROLES[field].filter(r => r !== 'Other').map(r => (
                      <button
                        key={r}
                        onClick={() => { setRole(role === r ? '' : r); setPage(1); }}
                        className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${role === r ? 'bg-[#0077B6] text-white font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </SidebarSection>
              )}

              {/* Location - State */}
              <SidebarSection title="State">
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  <button
                    onClick={() => { setSelectedState(''); setSelectedDistrict(''); setSelectedCity(''); }}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors font-medium ${!selectedState ? 'bg-[#0077B6] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    All States
                  </button>
                  {allStates.map((s: any) => (
                    <button
                      key={s.code}
                      onClick={() => { setSelectedState(s.code === selectedState ? '' : s.code); setSelectedDistrict(''); setSelectedCity(''); }}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${selectedState === s.code ? 'bg-[#0077B6] text-white font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </SidebarSection>

              {/* Districts - visible only when state is selected */}
              {selectedState && districts.length > 0 && (
                <SidebarSection title="District">
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    <button
                      onClick={() => { setSelectedDistrict(''); setSelectedCity(''); }}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors font-medium ${!selectedDistrict ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      All Districts
                    </button>
                    {districts.map((d: string) => (
                      <button
                        key={d}
                        onClick={() => { setSelectedDistrict(d === selectedDistrict ? '' : d); setSelectedCity(''); }}
                        className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${selectedDistrict === d ? 'bg-[#0077B6] text-white font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </SidebarSection>
              )}

              {/* City text input for precise locality */}
              {selectedDistrict && (
                <SidebarSection title="City / Locality">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      placeholder="e.g. Anna Nagar"
                      value={selectedCity}
                      onChange={e => setSelectedCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0077B6] bg-slate-50 focus:bg-white transition-all"
                    />
                  </div>
                </SidebarSection>
              )}

              {/* Expected Salary */}
              <SidebarSection title="Expected Salary">
                <div className="space-y-1">
                  <button
                    onClick={() => { setSalary(''); setPage(1); }}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors font-medium ${!salary ? 'bg-[#0077B6] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    Any Salary
                  </button>
                  {SALARY_RANGES.map(s => (
                    <button
                      key={s}
                      onClick={() => { setSalary(salary === s ? '' : s); setPage(1); }}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${salary === s ? 'bg-[#0077B6] text-white font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <DollarSign size={12} className={salary === s ? 'text-white' : 'text-slate-400'} /> {s}
                    </button>
                  ))}
                </div>
              </SidebarSection>
            </aside>
          )}

          {/* Candidates Grid */}
          <div className="flex-1 min-w-0">
            {/* Active Filter Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {search && <span className="px-3 py-1 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold rounded-full flex items-center gap-1.5">Search: {search} <button onClick={() => setSearch('')}><X size={10} /></button></span>}
                {field && <span className="px-3 py-1 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold rounded-full flex items-center gap-1.5">{field} <button onClick={() => {setField(''); setRole('');}}><X size={10} /></button></span>}
                {role && <span className="px-3 py-1 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold rounded-full flex items-center gap-1.5">Role: {role} <button onClick={() => setRole('')}><X size={10} /></button></span>}
                {locationText && <span className="px-3 py-1 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold rounded-full flex items-center gap-1.5"><MapPin size={10} />{locationText} <button onClick={() => { setSelectedState(''); setSelectedDistrict(''); setSelectedCity(''); }}><X size={10} /></button></span>}
                {salary && <span className="px-3 py-1 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold rounded-full flex items-center gap-1.5"><DollarSign size={10} />{salary} <button onClick={() => setSalary('')}><X size={10} /></button></span>}
              </div>
            )}

            {/* Results count */}
            <div className="mb-4 text-sm font-medium text-slate-500">
              Found <strong className="text-slate-900">{totalCandidates}</strong> candidates
            </div>

            {fetching ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Searching candidates...</p>
              </div>
            ) : candidates.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl py-20 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <User size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No candidates found</h3>
                <p className="text-slate-500 max-w-sm">Try adjusting your search filters.</p>
                <button onClick={clearAllFilters} className="mt-4 text-[#03045E] font-semibold hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 ${sidebarOpen ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
                {candidates.filter(c => showSavedOnly ? c.isSaved : true).map((candidate) => {
                  let skillsArr: string[] = [];
                  try { skillsArr = JSON.parse(candidate.skills); } catch { skillsArr = []; }

                  let parsedExp = candidate.experience;
                  if (parsedExp && parsedExp.startsWith('[')) {
                    try {
                      const expArr = JSON.parse(parsedExp);
                      if (Array.isArray(expArr) && expArr.length > 0 && expArr[0].role) {
                        parsedExp = `${expArr[0].role} at ${expArr[0].company || 'Unknown'}`;
                      }
                    } catch { /* keep as is */ }
                  }

                  const locDisplay = formatLocation(candidate.location);

                  return (
                    <div
                      key={candidate.id}
                      onClick={() => setSelectedCandidate(candidate)}
                      className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-sky-300 hover:shadow-md transition-all flex flex-col cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          {candidate.photoUrl ? (
                            <img src={candidate.photoUrl} alt={candidate.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-indigo-100 rounded-full flex items-center justify-center text-sky-700 font-bold text-lg shrink-0">
                              {candidate.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h3 className="font-extrabold text-slate-900 leading-tight group-hover:text-[#0077B6] transition-colors">{candidate.name}</h3>
                            <p className="text-slate-500 text-sm font-medium line-clamp-1">{candidate.headline || candidate.currentRole || 'Candidate'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {(candidate as any).hasApplied && (
                            <span className="text-[10px] font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg flex items-center gap-1 uppercase tracking-wider">
                              <Briefcase size={12} /> Applied
                            </span>
                          )}
                          <button
                            onClick={(e) => handleToggleSave(candidate.id, !!candidate.isSaved, e)}
                            className={`p-2 rounded-lg transition-colors ${candidate.isSaved ? 'bg-pink-50 text-pink-500 hover:bg-pink-100' : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                          >
                            <Bookmark size={18} className={candidate.isSaved ? "fill-pink-500" : ""} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
                        {locDisplay && locDisplay !== '-' && (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <MapPin size={12} className="text-slate-400" /> {locDisplay}
                          </span>
                        )}
                        {candidate.expectedSalary && (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            <DollarSign size={11} /> {candidate.expectedSalary}
                          </span>
                        )}
                        {candidate.currentCompany && (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <Building2 size={12} className="text-slate-400" /> {candidate.currentCompany}
                          </span>
                        )}
                      </div>

                      {candidate.preferredRoles && (
                        <div className="mb-3">
                          <span className="text-xs bg-[#CAF0F8]/40 text-sky-700 border border-sky-100 font-semibold px-2 py-1 rounded-full">
                            {candidate.preferredRoles}
                          </span>
                        </div>
                      )}

                      <div className="mt-auto pt-3 border-t border-slate-100">
                        <div className="flex flex-wrap gap-1.5">
                          {skillsArr.slice(0, 4).map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold rounded-md">
                              {skill}
                            </span>
                          ))}
                          {skillsArr.length > 4 && (
                            <span className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-semibold rounded-md">
                              +{skillsArr.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={20} className="text-slate-600" />
                </button>
                <span className="text-sm font-medium text-slate-600">Page {page} of {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={20} className="text-slate-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (() => {
        const locParsed = parseLocation(selectedCandidate.location);
        const locDisplay = formatLocation(selectedCandidate.location);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white z-10">
                <h2 className="text-lg font-extrabold text-slate-900">Candidate Profile</h2>
                <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="flex items-center gap-4 mb-6">
                  {selectedCandidate.photoUrl ? (
                    <img src={selectedCandidate.photoUrl} alt={selectedCandidate.name} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow" />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-indigo-100 rounded-full flex items-center justify-center text-sky-700 font-extrabold text-2xl border-4 border-white shadow-sm">
                      {selectedCandidate.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">{selectedCandidate.name}</h1>
                    <p className="text-slate-500 font-medium">{selectedCandidate.headline || 'Active Candidate'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Info</div>
                      <div className="text-sm font-medium text-slate-800">{selectedCandidate.email}</div>
                      <div className="text-sm font-medium text-slate-800">{selectedCandidate.phone}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</div>
                      {locParsed.state ? (
                        <div className="text-sm font-medium text-slate-800 space-y-0.5">
                          {locParsed.city && <div>{locParsed.city}</div>}
                          {locParsed.district && <div className="text-slate-500">{locParsed.district}</div>}
                          <div className="text-slate-500">{allStates.find((s: any) => s.code === locParsed.state)?.name || locParsed.state}</div>
                          {locParsed.address && <div className="text-xs text-slate-400">{locParsed.address}</div>}
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-slate-800">{locDisplay}</div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Status</div>
                      <div className="text-sm font-medium text-slate-800">{selectedCandidate.currentRole || '-'} at {selectedCandidate.currentCompany || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Expected Salary</div>
                      <div className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 inline-block">
                        {selectedCandidate.expectedSalary || 'Not specified'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Preferred Department</div>
                      <div className="text-sm font-medium text-slate-800">{selectedCandidate.preferredRoles || 'Not specified'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      let s: string[] = [];
                      try { s = JSON.parse(selectedCandidate.skills); } catch { s = []; }
                      if (s.length === 0) return <span className="text-sm text-slate-500">No skills listed</span>;
                      return s.map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-[#CAF0F8]/30 border border-sky-100 text-sky-700 text-xs font-bold rounded-lg">
                          {skill}
                        </span>
                      ));
                    })()}
                  </div>
                </div>

                {selectedCandidate.languages && (() => {
                  try {
                    const langs = JSON.parse(selectedCandidate.languages);
                    if (!Array.isArray(langs) || langs.length === 0) return null;
                    return (
                      <div className="mt-6">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Languages</div>
                        <div className="flex flex-wrap gap-2">
                          {langs.map((l: any, i: number) => (
                            <span key={i} className="px-3 py-1.5 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold rounded-lg">
                              {l.language} <span className="text-purple-400 font-normal">· {l.proficiency}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  } catch { return null; }
                })()}
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <a
                  href={`https://wa.me/${selectedCandidate.phone.replace(/[\s\-\(\)\+]/g, '').startsWith('91') || selectedCandidate.phone.replace(/[\s\-\(\)\+]/g, '').length !== 10 ? selectedCandidate.phone.replace(/[\s\-\(\)\+]/g, '') : '91' + selectedCandidate.phone.replace(/[\s\-\(\)\+]/g, '')}?text=${encodeURIComponent(`Hi ${selectedCandidate.name},\n\nThis is regarding your profile on The jobsync. We would like to connect with you.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebd59] transition-colors shadow-sm flex items-center gap-2"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.457 3.48 1.328 5L2 22l5.176-1.356c1.47.8 3.11 1.22 4.828 1.22 5.506 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm6.27 13.916c-.258.73-1.49 1.418-2.072 1.488-.58.07-1.162.274-3.708-.772-3.252-1.334-5.328-4.63-5.49-4.846-.16-.216-1.306-1.736-1.306-3.31 0-1.574.82-2.35 1.112-2.66.29-.31.638-.388.852-.388.214 0 .428.002.614.01.2.01.468-.076.732.56.264.638.904 2.2.982 2.356.078.156.13.336.026.544-.104.208-.156.336-.31.518-.156.182-.328.406-.468.544-.156.156-.32.326-.138.638.182.312.808 1.332 1.732 2.156.924.824 1.704 1.078 2.022 1.21.318.13.506.104.692-.104.186-.208.808-.938 1.026-1.26.216-.32.434-.268.732-.156.298.112 1.892.894 2.216 1.056.324.162.54.242.618.374.078.13.078.756-.18 1.486z"/>
                  </svg>
                  WhatsApp
                </a>
                <button
                  onClick={() => {
                    setEmailSubject(`Regarding your profile on The jobsync`);
                    setEmailBody('');
                    setEmailSuccess(false);
                    setEmailError('');
                    setShowEmailModal(true);
                  }}
                  className="px-5 py-2.5 bg-[#03045E] text-white font-bold rounded-xl hover:bg-sky-700 transition-colors shadow-sm"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Email Compose Modal */}
      {showEmailModal && selectedCandidate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
              <h2 className="text-lg font-extrabold text-slate-900">Message to {selectedCandidate.name}</h2>
              <button onClick={() => setShowEmailModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSendEmail} className="p-5 flex flex-col gap-4">
              {emailError && <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-100">{emailError}</div>}
              {emailSuccess && <div className="p-3 bg-green-50 text-green-600 text-sm font-semibold rounded-lg border border-green-100">Message sent successfully!</div>}
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">To</label>
                <input type="text" readOnly value={selectedCandidate.email} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 font-medium" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
                <input 
                  type="text" 
                  required 
                  value={emailSubject} 
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6]" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Message</label>
                <textarea 
                  required
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Hi there, we loved your profile..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="px-5 py-2.5 bg-[#03045E] text-white font-bold rounded-xl hover:bg-sky-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                >
                  {sendingEmail ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

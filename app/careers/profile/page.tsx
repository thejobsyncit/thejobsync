'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { User, Briefcase, GraduationCap, Star, Save, CheckCircle, UploadCloud, FileText, X, Plus, Trash2, Download, ChevronDown, Search, Camera } from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import { motion } from 'framer-motion';
import PrintableEnrollmentForm from './PrintableEnrollmentForm';
import ATSPremiumPlansModal from './ATSPremiumPlansModal';
import { usePortalTheme } from '@/context/PortalThemeContext';
import { toast } from 'react-hot-toast';
import { getAllStates, getDistricts } from 'india-state-district';
import { DEPARTMENTS, SALARY_RANGES } from '@/lib/constants';

const getINPUT = (isDark: boolean) => ({
  width: '100%', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: 12,
  padding: '0.875rem 1rem', fontSize: '0.95rem', outline: 'none',
  boxSizing: 'border-box' as const, color: isDark ? 'white' : '#0f172a', background: isDark ? 'rgba(0,0,0,0.2)' : 'white',
  transition: 'border-color 0.2s'
});
const getLABEL = (isDark: boolean) => ({ fontSize: '0.85rem', fontWeight: 600 as const, color: isDark ? '#94a3b8' : '#475569', display: 'block' as const, marginBottom: 8 });

const DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
  "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur",
  "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
  "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
  "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar"
];

const DEGREES = [
  "B.Tech - Computer Science", "B.Tech - Information Technology", "B.Tech - Electronics", "B.Tech - Mechanical", "B.Tech - Civil",
  "B.E. - Computer Science", "B.E. - Electrical", "B.E. - Electronics", "B.E. - Mechanical", "B.E. - Civil",
  "B.Sc - Computer Science", "B.Sc - Information Technology", "B.Sc - Mathematics", "B.Sc - Physics", "B.Sc - Chemistry",
  "BCA", "BBA", "B.Com", "B.A. - English", "B.A. - Economics", "B.Arch",
  "M.Tech - Computer Science", "M.E. - Computer Science", "MCA", "MBA", "M.Sc - Computer Science", "Ph.D", "Diploma",
  "High School (10th)", "Higher Secondary (12th)"
];

const COLLEGES = [
  "Indian Institute of Technology Madras (IIT Madras)",
  "Indian Institute of Technology Bombay (IIT Bombay)",
  "Indian Institute of Technology Delhi (IIT Delhi)",
  "Indian Institute of Technology Kanpur (IIT Kanpur)",
  "Indian Institute of Technology Kharagpur (IIT KGP)",
  "National Institute of Technology, Tiruchirappalli (NIT Trichy)",
  "Anna University, Chennai",
  "Vellore Institute of Technology (VIT)",
  "SRM Institute of Science and Technology",
  "PSG College of Technology, Coimbatore",
  "Madras Institute of Technology (MIT)",
  "SSN College of Engineering",
  "College of Engineering, Guindy (CEG)",
  "Loyola College, Chennai",
  "Madras Christian College (MCC)",
  "Sathyabama Institute of Science and Technology",
  "Hindustan Institute of Technology and Science",
  "Coimbatore Institute of Technology (CIT)",
  "Kumaraguru College of Technology (KCT)",
  "Sri Krishna College of Engineering and Technology (SKCET)",
  "Thiagarajar College of Engineering, Madurai",
  "Sastra Deemed University, Thanjavur",
  "Amrita Vishwa Vidyapeetham",
  "Karunya Institute of Technology and Sciences",
  "B.S. Abdur Rahman Crescent Institute of Science and Technology",
  "Meenakshi Sundararajan Engineering College",
  "Rajalakshmi Engineering College",
  "Saveetha Engineering College",
  "Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology",
  "Sri Venkateswara College of Engineering (SVCE)",
  "St. Joseph's College of Engineering",
  "RMK Engineering College",
  "Easwari Engineering College",
  "Kongu Engineering College",
  "Bannari Amman Institute of Technology",
  "Mepco Schlenk Engineering College"
];
export default function CandidateProfilePage() {
  const { candidate, updateProfile, isAuthenticated, isLoading } = useCandidateAuth();
  const { isDark } = usePortalTheme();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<any>({
    name: '', email: '', phone: '', headline: '', summary: '',
    locState: '', locDistrict: '', locCity: '', locAddress: '', currentCompany: '', currentRole: '', expectedSalary: '',
    preferredRoles: '', resumeUrl: '', resumeFileName: '', photoUrl: '',
    skillsArr: [],
    educations: [{ degree: '', college: '', year: '', cgpa: '' }],
    experiences: [{ company: '', role: '', from: '', to: '', current: false }],
  });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [showATSModal, setShowATSModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/careers/login');
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!candidate) return;
    let skillsArr: string[] = [];
    try { skillsArr = typeof candidate.skills === 'string' ? JSON.parse(candidate.skills || '[]') : (candidate.skills || []); } catch { }

    let educations = [{ degree: '', college: '', year: '', cgpa: '' }];
    try {
      if ((candidate as any).educationJson) {
        const p = JSON.parse((candidate as any).educationJson);
        if (Array.isArray(p) && p.length) educations = p;
        else if (p) educations[0] = p;
      } else if ((candidate as any).education) {
        const p = JSON.parse((candidate as any).education);
        if (Array.isArray(p) && p.length) educations = p;
        else if (p?.degree) educations[0] = p;
        else educations[0].degree = (candidate as any).education;
      }
    } catch {
      if ((candidate as any).education) educations[0].degree = (candidate as any).education || '';
    }

    let experiences = [{ company: '', role: '', from: '', to: '', current: false }];
    try { if ((candidate as any).experience) { const p = JSON.parse((candidate as any).experience); if (Array.isArray(p) && p.length) experiences = p; } } catch {
      if ((candidate as any).experience) experiences[0].role = (candidate as any).experience;
    }

    let parsedLoc = { state: '', district: '', city: '', address: '' };
    try {
      if (candidate.location && candidate.location.startsWith('{')) {
        const locObj = JSON.parse(candidate.location);
        parsedLoc = { state: locObj.state || '', district: locObj.district || '', city: locObj.city || '', address: locObj.address || '' };
      } else {
        parsedLoc.city = candidate.location || '';
      }
    } catch (e) {
      parsedLoc.city = candidate.location || '';
    }

    setForm({
      name: candidate.name || '',
      email: candidate.email || '',
      phone: candidate.phone || '',
      headline: candidate.headline || '',
      summary: (candidate as any).summary || '',
      locState: parsedLoc.state,
      locDistrict: parsedLoc.district,
      locCity: parsedLoc.city,
      locAddress: parsedLoc.address,
      currentCompany: candidate.currentCompany || '',
      currentRole: candidate.currentRole || '',
      expectedSalary: candidate.expectedSalary || '',
      preferredRoles: (candidate as any).preferredRoles || '',
      resumeUrl: (candidate as any).resumeUrl || '',
      photoUrl: (candidate as any).photoUrl || '',
      resumeFileName: '',
      skillsArr,
      educations,
      experiences,
    });
  }, [candidate]);

  const profilePercent = Math.min(100, Math.round([
    form.name, form.headline, form.summary, (form.locState && form.locCity),
    form.educations?.[0]?.degree, form.educations?.[0]?.college, form.educations?.[0]?.cgpa,
    form.skillsArr?.length > 0,
    form.experiences?.[0]?.company || form.experiences?.[0]?.role,
    form.resumeUrl,
  ].filter(Boolean).length * 10));

  const missingFields: string[] = [];
  if (!form.name) missingFields.push('Full Name');
  if (!form.headline) missingFields.push('Headline');
  if (!form.summary) missingFields.push('Summary');
  if (!form.locState || !form.locCity) missingFields.push('Location (State & City)');
  if (!form.preferredRoles) missingFields.push('Department / Field');
  if (!form.educations?.[0]?.degree || !form.educations?.[0]?.college) missingFields.push('Education Details');
  if (!form.skillsArr || form.skillsArr.length === 0) missingFields.push('Skills');
  if (!form.experiences?.[0]?.company && !form.experiences?.[0]?.role) missingFields.push('Experience Details');
  if (!form.resumeUrl) missingFields.push('Resume');

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || form.skillsArr.includes(s)) return;
    setForm({ ...form, skillsArr: [...form.skillsArr, s] });
    setSkillInput('');
  };

  const addExperience = () => setForm({ ...form, experiences: [...form.experiences, { company: '', role: '', from: '', to: '', current: false }] });
  const removeExperience = (i: number) => setForm({ ...form, experiences: form.experiences.filter((_: any, idx: number) => idx !== i) });
  const updateExp = (i: number, field: string, val: any) => {
    const updated = [...form.experiences];
    updated[i] = { ...updated[i], [field]: val };
    setForm({ ...form, experiences: updated });
  };

  const addEducation = () => setForm({ ...form, educations: [...form.educations, { degree: '', college: '', year: '', cgpa: '' }] });
  const removeEducation = (i: number) => setForm({ ...form, educations: form.educations.filter((_: any, idx: number) => idx !== i) });
  const updateEdu = (i: number, field: string, val: any) => {
    const updated = [...form.educations];
    updated[i] = { ...updated[i], [field]: val };
    setForm({ ...form, educations: updated });
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload/resume', { method: 'POST', body: fd });
      if (res.ok) {
        const { url, name, extractedData } = await res.json();
        let newForm = { ...form, resumeUrl: url, resumeFileName: name || file.name };

        if (extractedData) {
          let updatedFields = [];
          if (extractedData.email && extractedData.email !== form.email) { newForm.email = extractedData.email; updatedFields.push('Email'); }
          if (extractedData.phone && extractedData.phone !== form.phone) { newForm.phone = extractedData.phone; updatedFields.push('Phone'); }
          if (extractedData.skillsArr && extractedData.skillsArr.length > 0) {
            const originalLength = form.skillsArr.length;
            const mergedSkills = new Set([...form.skillsArr, ...extractedData.skillsArr]);
            newForm.skillsArr = Array.from(mergedSkills);
            if (newForm.skillsArr.length > originalLength) updatedFields.push('Skills');
          }

          if (updatedFields.length > 0) {
            toast.success(`Auto-filled: ${updatedFields.join(', ')}`);
          } else {
            toast('Resume uploaded! (No new fields to auto-fill)', { icon: 'ℹ️' });
          }
        }

        setForm(newForm);
      } else {
        alert('Resume upload failed. Please try again.');
      }
    } finally { setUploading(false); }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Photo size must be less than 5MB");
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file");
      return;
    }

    setPhotoUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload/photo', { method: 'POST', body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setForm({ ...form, photoUrl: url });
        toast.success('Photo uploaded successfully!');
      } else {
        alert('Photo upload failed. Please try again.');
      }
    } catch (err) {
      alert('Error uploading photo');
    } finally { setPhotoUploading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        id: candidate?.id,
        name: form.name,
        phone: form.phone,
        headline: form.headline,
        summary: form.summary,
        location: JSON.stringify({ state: form.locState, district: form.locDistrict, city: form.locCity, address: form.locAddress }),
        currentCompany: form.currentCompany,
        currentRole: form.currentRole,
        expectedSalary: form.expectedSalary,
        preferredRoles: form.preferredRoles,
        resumeUrl: form.resumeUrl,
        photoUrl: form.photoUrl,
        skills: JSON.stringify(form.skillsArr),
        education: JSON.stringify(form.educations),
        experience: JSON.stringify(form.experiences),
      };
      const res = await fetch('/api/candidate-auth/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        updateProfile(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally { setSaving(false); }
  };

  if (!candidate) return null;

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? 'white' : '#0f172a', marginBottom: 8, letterSpacing: '-0.5px' }}>My Profile</h1>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '1rem' }}>Complete your profile to get better job recommendations.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {saved && <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ color: '#34d399', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={16} /> Saved!</motion.span>}
          <button onClick={handleSave} disabled={saving} style={{ background: 'linear-gradient(135deg,#0ea5e9,#0077B6)', color: 'white', border: 'none', borderRadius: 12, padding: '0.875rem 1.75rem', fontWeight: 800, fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 15px rgba(14,165,233,0.3)', transition: 'transform 0.2s' }} className="hover:scale-105">
            <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        {/* Left: Form sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Basic Information */}
          <Section title="Basic Information" icon={<User size={20} color="#38bdf8" />}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <div
                  onClick={() => photoRef.current?.click()}
                  style={{ width: 120, height: 140, borderRadius: 16, background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)', border: `2px dashed ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                  className="hover:opacity-80 transition-opacity"
                >
                  {form.photoUrl ? (
                    <img src={form.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <Camera size={28} color="#94a3b8" style={{ marginBottom: 8 }} />
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Add Photo</span>
                    </>
                  )}
                  {photoUploading && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>Uploading...</span>
                    </div>
                  )}
                </div>
                <input type="file" ref={photoRef} onChange={handlePhotoUpload} accept="image/*" style={{ display: 'none' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: isDark ? '#e2e8f0' : '#475569', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Upload your passport size photo.</p>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>Max size 5MB. Formats: JPG, PNG, WEBP. <br />A professional photo helps recruiters identify you easily and makes your profile stand out.</p>
              </div>
            </div>
            <Grid2>
              <Field label="Full Name *">
                <input style={getINPUT(isDark)} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="focus:border-[#0077B6]" />
              </Field>
              <Field label="Email Address">
                <input style={{ ...getINPUT(isDark), background: 'rgba(255,255,255,0.02)', color: '#64748b' }} value={form.email} readOnly />
              </Field>
            </Grid2>
            <div style={{ marginTop: 24, marginBottom: 8, fontSize: '1rem', fontWeight: 700, color: isDark ? 'white' : '#0f172a' }}>Location Details</div>
            <Grid2>
              <Field label="State *">
                <select style={getINPUT(isDark)} value={form.locState} onChange={e => setForm({ ...form, locState: e.target.value, locDistrict: '' })} className="focus:border-[#0077B6] appearance-none">
                  <option value="">Select State</option>
                  {getAllStates().map((s: any) => <option key={s.code} value={s.code}>{s.name}</option>)}
                </select>
              </Field>
              <Field label="District *">
                <select style={getINPUT(isDark)} value={form.locDistrict} onChange={e => setForm({ ...form, locDistrict: e.target.value })} className="focus:border-[#0077B6] appearance-none">
                  <option value="">Select District</option>
                  {form.locState ? getDistricts(form.locState).map((d: string) => <option key={d} value={d}>{d}</option>) : null}
                </select>
              </Field>
            </Grid2>
            <Grid2>
              <Field label="City / Locality *">
                <input style={getINPUT(isDark)} value={form.locCity} onChange={e => setForm({ ...form, locCity: e.target.value })} placeholder="e.g. Anna Nagar" className="focus:border-[#0077B6]" />
              </Field>
              <Field label="Full Address">
                <input style={getINPUT(isDark)} value={form.locAddress} onChange={e => setForm({ ...form, locAddress: e.target.value })} placeholder="Door No, Street Name" className="focus:border-[#0077B6]" />
              </Field>
            </Grid2>
            <Field label="Phone Number *">
              <input style={getINPUT(isDark)} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Your mobile number" className="focus:border-[#0077B6]" />
            </Field>
            <Field label="Professional Headline" full>
              <input style={getINPUT(isDark)} value={form.headline} onChange={e => setForm({ ...form, headline: e.target.value })} placeholder="e.g. Senior React Developer | 5 Years Exp" className="focus:border-[#0077B6]" />
            </Field>
            <Field label="Professional Summary" full>
              <textarea style={{ ...getINPUT(isDark), resize: 'vertical', minHeight: 120, fontFamily: 'inherit', lineHeight: 1.6 }} value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} placeholder="Write a short summary about your skills..." rows={4} className="focus:border-[#0077B6]" />
            </Field>
          </Section>

          {/* Education */}
          <Section title="Education" icon={<GraduationCap size={20} color="#38bdf8" />}>
            {form.educations.map((edu: any, i: number) => (
              <div key={i} style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 16, padding: '1.5rem', position: 'relative', background: isDark ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)', marginBottom: i < form.educations.length - 1 ? '1.5rem' : 0 }}>
                {form.educations.length > 1 && (
                  <button onClick={() => removeEducation(i)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}>
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                )}
                <Grid2>
                  <Field label="Degree / Course *">
                    <SmartSelector value={edu.degree} onChange={val => updateEdu(i, 'degree', val)} isDark={isDark} options={DEGREES} placeholder="Select Degree/Course" searchPlaceholder="Search degree..." />
                  </Field>
                  <Field label="College / University Name *">
                    <SmartSelector value={edu.college} onChange={val => updateEdu(i, 'college', val)} isDark={isDark} options={COLLEGES} placeholder="Select College/University" searchPlaceholder="Search college..." />
                  </Field>
                </Grid2>
                <Grid2>
                  <Field label="CGPA / Percentage">
                    <input style={getINPUT(isDark)} value={edu.cgpa} onChange={e => updateEdu(i, 'cgpa', e.target.value)} placeholder="e.g. 8.5 CGPA" className="focus:border-[#0077B6]" />
                  </Field>
                  <Field label="Year of Passing">
                    <input style={getINPUT(isDark)} value={edu.year} onChange={e => updateEdu(i, 'year', e.target.value)} placeholder="e.g. 2022" type="number" className="focus:border-[#0077B6]" />
                  </Field>
                </Grid2>
              </div>
            ))}
            <button onClick={addEducation} style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px dashed ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`, borderRadius: 12, padding: '1rem', background: 'transparent', color: '#00B4D8', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', width: '100%', justifyContent: 'center', marginTop: '1rem' }} className={isDark ? "hover:bg-white/5" : "hover:bg-black/5"}>
              <Plus size={18} /> Add Another Education
            </button>
          </Section>

          {/* Experience */}
          <Section title="Work Experience" icon={<Briefcase size={20} color="#38bdf8" />}>
            {form.experiences.map((exp: any, i: number) => (
              <div key={i} style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 16, padding: '1.5rem', position: 'relative', background: isDark ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)', marginBottom: i < form.experiences.length - 1 ? '1.5rem' : 0 }}>
                {form.experiences.length > 1 && (
                  <button onClick={() => removeExperience(i)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}>
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                )}
                <Grid2>
                  <Field label="Company Name">
                    <input style={getINPUT(isDark)} value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} placeholder="e.g. Startup Inc." className="focus:border-[#0077B6]" />
                  </Field>
                  <Field label="Job Title / Role">
                    <input style={getINPUT(isDark)} value={exp.role} onChange={e => updateExp(i, 'role', e.target.value)} placeholder="e.g. Software Developer" className="focus:border-[#0077B6]" />
                  </Field>
                </Grid2>
                <Grid2>
                  <Field label="From (Year)">
                    <input style={getINPUT(isDark)} value={exp.from} onChange={e => updateExp(i, 'from', e.target.value)} placeholder="e.g. 2020" className="focus:border-[#0077B6]" />
                  </Field>
                  <Field label="To (Year / Present)">
                    <input style={getINPUT(isDark)} value={exp.to} onChange={e => updateExp(i, 'to', e.target.value)} placeholder="e.g. 2023" disabled={exp.current} className="focus:border-[#0077B6]" />
                  </Field>
                </Grid2>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: isDark ? '#cbd5e1' : '#475569', cursor: 'pointer', marginTop: '1rem' }}>
                  <input type="checkbox" checked={exp.current} onChange={e => { updateExp(i, 'current', e.target.checked); if (e.target.checked) updateExp(i, 'to', 'Present'); }} style={{ width: 16, height: 16 }} />
                  <span>I currently work here</span>
                </label>
              </div>
            ))}
            <button onClick={addExperience} style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px dashed ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`, borderRadius: 12, padding: '1rem', background: 'transparent', color: '#00B4D8', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', width: '100%', justifyContent: 'center', marginTop: '1rem' }} className={isDark ? "hover:bg-white/5" : "hover:bg-black/5"}>
              <Plus size={18} /> Add Another Experience
            </button>

            <div style={{ marginTop: '1rem' }}>
              <Grid2>
                <Field label="Current Company">
                  <input style={getINPUT(isDark)} value={form.currentCompany} onChange={e => setForm({ ...form, currentCompany: e.target.value })} placeholder="Current employer" className="focus:border-[#0077B6]" />
                </Field>
                <Field label="Expected Salary">
                  <select style={getINPUT(isDark)} value={form.expectedSalary} onChange={e => setForm({ ...form, expectedSalary: e.target.value })} className="focus:border-[#0077B6] appearance-none">
                    <option value="">Select Expected Salary</option>
                    {SALARY_RANGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </Grid2>
              <Field label="Department / Preferred Field *" full>
                <select
                  style={getINPUT(isDark)}
                  value={DEPARTMENTS.includes(form.preferredRoles as any) || form.preferredRoles === '' ? form.preferredRoles : 'Other'}
                  onChange={e => {
                    if (e.target.value === 'Other') {
                      setForm({ ...form, preferredRoles: 'Other' });
                    } else {
                      setForm({ ...form, preferredRoles: e.target.value });
                    }
                  }}
                  className="focus:border-[#0077B6] appearance-none"
                >
                  <option value="">Select your Department / Field</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  <option value="Other">Other (Type below)</option>
                </select>
                {(form.preferredRoles === 'Other' || (!DEPARTMENTS.includes(form.preferredRoles as any) && form.preferredRoles !== '')) && (
                  <input
                    style={{ ...getINPUT(isDark), marginTop: 8 }}
                    value={form.preferredRoles === 'Other' ? '' : form.preferredRoles}
                    onChange={e => setForm({ ...form, preferredRoles: e.target.value })}
                    placeholder="Type your department / field here..."
                    className="focus:border-[#0077B6]"
                    autoFocus
                  />
                )}
              </Field>
            </div>
          </Section>

          {/* Skills */}
          <Section title="Skills & Expertise" icon={<Star size={20} color="#38bdf8" />}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Type a skill and press Enter"
                style={{ ...getINPUT(isDark), flex: 1 }} className="focus:border-[#0077B6]" />
              <button onClick={addSkill} style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: isDark ? 'white' : '#0f172a', border: 'none', borderRadius: 12, padding: '0 1.5rem', fontWeight: 700, cursor: 'pointer' }} className={isDark ? "hover:bg-white/20" : "hover:bg-black/10"}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
              {form.skillsArr.map((s: string, i: number) => (
                <span key={i} style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', color: isDark ? '#7dd3fc' : '#03045E', borderRadius: 8, padding: '0.4rem 0.8rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {s}
                  <button onClick={() => setForm({ ...form, skillsArr: form.skillsArr.filter((_: any, j: number) => j !== i) })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#00B4D8', padding: 0, display: 'flex' }}><X size={14} /></button>
                </span>
              ))}
              {form.skillsArr.length === 0 && <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No skills added yet.</p>}
            </div>
          </Section>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: 100 }}>
          {/* Completion Widget */}
          <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 24, padding: '2rem', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: isDark ? 'white' : '#0f172a', marginBottom: '1.5rem' }}>Profile Strength</h3>

            <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 1.5rem' }}>
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * profilePercent) / 100} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#0077B6" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? 'white' : '#0f172a' }}>{profilePercent}%</span>
              </div>
            </div>

            {profilePercent < 100 ? (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.9rem', color: isDark ? '#cbd5e1' : '#64748b', textAlign: 'center', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Complete your profile to increase your chances of being matched.
                </p>
                {missingFields.length > 0 && (
                  <div style={{ background: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2', border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.2)' : '#fecaca'}`, borderRadius: 12, padding: '1rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: isDark ? '#f87171' : '#b91c1c', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle size={14} /> Pending Fields:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: isDark ? '#fca5a5' : '#ef4444', lineHeight: 1.6 }}>
                      {missingFields.slice(0, 5).map(f => <li key={f}>{f}</li>)}
                      {missingFields.length > 5 && <li>+{missingFields.length - 5} more...</li>}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ fontSize: '0.9rem', color: '#34d399', textAlign: 'center', fontWeight: 600 }}>
                Looking good! Your profile is 100% complete.
              </p>
            )}
          </div>

          {/* Resume Upload */}
          <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 24, padding: '2rem', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: isDark ? 'white' : '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileText size={20} color="#38bdf8" /> Resume
            </h3>
            {form.resumeUrl ? (
              <div style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CheckCircle size={20} color="#38bdf8" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isDark ? '#e0f2fe' : '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {form.resumeFileName || 'Resume uploaded'}
                    </div>
                    <a href={form.resumeUrl} download={form.resumeFileName || 'Resume'} style={{ fontSize: '0.8rem', color: isDark ? '#00B4D8' : '#0077B6', textDecoration: 'none', fontWeight: 600 }} className="hover:underline">Download File</a>
                  </div>
                  <button onClick={() => setForm({ ...form, resumeUrl: '', resumeFileName: '' })} style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#94a3b8' }} className={isDark ? "hover:text-white" : "hover:text-black"}>
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : null}
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ width: '100%', border: `2px dashed ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`, borderRadius: 16, padding: '1.5rem', background: isDark ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.03)', cursor: uploading ? 'wait' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, transition: 'all 0.2s' }} className="hover:bg-[#0077B6]/10 hover:border-[#0077B6]/50">
              <UploadCloud size={28} color={uploading ? '#94a3b8' : (isDark ? '#00B4D8' : '#0077B6')} />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: uploading ? '#94a3b8' : (isDark ? 'white' : '#0f172a') }}>
                {uploading ? 'Uploading...' : form.resumeUrl ? 'Replace Resume' : 'Upload Resume'}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>PDF, DOCX up to 5MB</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, paddingTop: '3rem' }}>
        <button
          onClick={() => window.print()}
          style={{
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', color: isDark ? 'white' : '#0f172a', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            padding: '1rem 2rem', borderRadius: 16, fontSize: '1.05rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.2)' : '0 10px 25px rgba(0,0,0,0.05)'
          }}
          className={isDark ? "hover:bg-white/10 hover:-translate-y-1" : "hover:bg-black/5 hover:-translate-y-1"}
        >
          <Download size={20} color="#38bdf8" />
          Save Profile Enrollment Form
        </button>

        <button
          onClick={() => setShowATSModal(true)}
          style={{
            background: 'linear-gradient(135deg, #0077B6, #0077B6)', color: 'white', border: 'none',
            padding: '1rem 2rem', borderRadius: 16, fontSize: '1.05rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 10px 25px rgba(59,130,246,0.3)'
          }}
          className="hover:scale-105"
        >
          <FileText size={20} />
          Create ATS Friendly Resume
        </button>
      </div>

      <PrintableEnrollmentForm candidate={form} />
      <ATSPremiumPlansModal isOpen={showATSModal} onClose={() => setShowATSModal(false)} />

    </DashboardLayout>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const { isDark } = usePortalTheme();
  return (
    <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 24, padding: '2.5rem', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.35rem', fontWeight: 800, color: isDark ? 'white' : '#0f172a', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
        {icon}{title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>{children}</div>
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>{children}</div>;
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  const { isDark } = usePortalTheme();
  return (
    <div style={{ gridColumn: full ? '1/-1' : undefined, minWidth: 0 }}>
      <label style={getLABEL(isDark)}>{label}</label>
      {children}
    </div>
  );
}

function SmartSelector({ value, onChange, isDark, options, placeholder, searchPlaceholder }: { value: string, onChange: (val: string) => void, isDark: boolean, options: string[], placeholder: string, searchPlaceholder: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isOther, setIsOther] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && !options.includes(value)) {
      setIsOther(true);
    }
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter(d => d.toLowerCase().includes(search.toLowerCase()));

  if (isOther) {
    return (
      <div style={{ position: 'relative' }}>
        <input
          style={getINPUT(isDark)}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus
        />
        <button
          type="button"
          onClick={() => { setIsOther(false); onChange(''); }}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#00B4D8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
        >
          Select from list
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', zIndex: isOpen ? 50 : 1 }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{ ...getINPUT(isDark), cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span style={{ color: value ? (isDark ? 'white' : '#0f172a') : '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 16, flex: 1, minWidth: 0, textAlign: 'left' }}>{value || placeholder}</span>
        <ChevronDown size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
      </div>

      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: 4, background: isDark ? '#1e293b' : 'white', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxHeight: 250, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: 8, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={16} color="#94a3b8" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: isDark ? 'white' : '#0f172a', fontSize: '0.9rem' }}
              autoFocus
            />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.map(d => (
              <div
                key={d}
                onClick={() => { onChange(d); setIsOpen(false); setSearch(''); }}
                style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '0.9rem', color: isDark ? '#e2e8f0' : '#334155' }}
                className={isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"}
              >
                {d}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '10px 16px', fontSize: '0.9rem', color: '#94a3b8', textAlign: 'center' }}>No results found</div>
            )}
            <div
              onClick={() => { setIsOther(true); onChange(search); setIsOpen(false); setSearch(''); }}
              style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '0.9rem', color: '#00B4D8', fontWeight: 600, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}
              className={isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"}
            >
              + Other (Type manually)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

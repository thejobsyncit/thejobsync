'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Database, Clock, Briefcase, Mail, Phone, MapPin, GraduationCap, FileText, Eye, UserCheck, X, Download, Edit2, Save, Upload, CheckSquare, Square, Trash2, Check } from 'lucide-react';
import { openResumeSafe, downloadResumeSafe } from '@/lib/resume';
import { read, utils } from "xlsx";

const getRegistrationWhatsAppLink = (name: string, phone: string) => {
  let cleanPhone = phone?.toString().replace(/[^0-9]/g, '') || '';
  if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }
  const msg = `Hi ${name || 'there'},

We came across your profile and believe you could be a great fit for several exciting job opportunities available on GoJobSync.

Whether you're a Fresher or an Experienced Professional, we have openings across multiple companies and industries waiting for candidates like you.

✨ Why apply through GoJobSync?

- Multiple verified job opportunities
- Quick and easy application process
- Track your application status in real time
- Direct access to hiring companies
- Absolutely FREE for job seekers

Don't miss your chance to land your next job.

👉 Apply Now: www.gojobsync.com/careers/register

Complete your profile and start applying to jobs in just a few minutes.

If you have any questions, simply reply to our email—we're happy to help.
*(Note: If you didn't receive our email, please check your spam/junk folder as well!)*

Best Regards,
GoJobSync Recruitment Team
🌐 www.gojobsync.com 
📧 hr@gojobsync.com`;
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
};

const BULK_TEMPLATES = [
  `Hi {name},

We came across your profile and believe you could be a great fit for several exciting job opportunities available on GoJobSync.

Whether you're a Fresher or an Experienced Professional, we have openings across multiple companies and industries waiting for candidates like you.

✨ Why apply through GoJobSync?

- Multiple verified job opportunities
- Quick and easy application process
- Track your application status in real time
- Direct access to hiring companies
- Absolutely FREE for job seekers

Don't miss your chance to land your next job.

👉 Apply Now: www.gojobsync.com/careers/register

Complete your profile and start applying to jobs in just a few minutes.

If you have any questions, simply reply to our email—we're happy to help.
*(Note: If you didn't receive our email, please check your spam/junk folder as well!)*

Best Regards,
GoJobSync Recruitment Team
🌐 www.gojobsync.com 
📧 hr@gojobsync.com`,
  
  `Hello {name},

Your profile caught our attention, and we have several exciting job openings at GoJobSync that match your skills.

From entry-level positions for freshers to senior roles for experienced professionals, we partner with top companies actively hiring right now.

⭐ Benefits of using GoJobSync:
- 100% Free for job seekers
- Verified, high-quality job postings
- Seamless and fast application tracking
- Connect directly with top recruiters

Take the next step in your career journey today!

🚀 Register Here: www.gojobsync.com/careers/register

It only takes a few minutes to complete your profile and start applying. 

Got questions? Just reply to this email, and our team will assist you.
*(Please check your spam/junk folder if you missed our previous emails!)*

Warm Regards,
GoJobSync Hiring Team
🌐 www.gojobsync.com 
📧 hr@gojobsync.com`,

  `Dear {name},

We are reaching out because your background looks like a great match for the latest career opportunities available on GoJobSync.

Our platform connects talented individuals—both fresh graduates and seasoned experts—with companies looking to hire immediately.

🔥 What makes GoJobSync different?
- Instant access to verified employers
- Real-time updates on your applications
- Simple, one-click apply process
- Completely free of charge

Don't let the perfect job slip away.

✅ Create Your Profile: www.gojobsync.com/careers/register

Set up your account in minutes and explore jobs tailored for you.

Need help? Reply to this message and we will get back to you promptly.
*(Make sure to check your spam/junk folder so you don't miss our updates!)*

Best,
GoJobSync Talent Acquisition
🌐 www.gojobsync.com 
📧 hr@gojobsync.com`
];

const SENDER_EMAILS = [
  'hr@gojobsync.com',
  'careers@gojobsync.com',
  'updates@gojobsync.com'
];

export default function FreshDumpPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewResume, setViewResume] = useState<any>(null);
  const [newResumeInput, setNewResumeInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ uploaded: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [mailModal, setMailModal] = useState<any>(null);
  const [sendingMail, setSendingMail] = useState(false);
  const [sendProgress, setSendProgress] = useState({ current: 0, total: 0 });
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  const fetchFreshDump = async () => {
    try {
      let url = '/api/candidates?status=new';
      if (user?.role === 'application_support') {
        url = `/api/candidates?assignedSupportId=${user.id}`;
      }
      url += (url.includes('?') ? '&' : '?') + `t=${Date.now()}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setCandidates(data);
      }
    } catch {
      toast.error('Failed to load fresh dump');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/admin/support-metrics');
      if (res.ok) {
        const data = await res.json();
        const myMetrics = data.find((m: any) => m.id === user?.id);
        if (myMetrics) setMetrics(myMetrics);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFreshDump();
      if (user.role === 'application_support') {
        fetchMetrics();
      }
    }
  }, [user]);

  const handleUpdateResume = async () => {
    if (!viewResume) return;
    const res = await fetch(`/api/candidates/${viewResume.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeUrl: newResumeInput })
    });
    if (res.ok) {
      const updated = await res.json();
      setViewResume({ ...viewResume, resumeUrl: newResumeInput });
      setCandidates(candidates.map(c => c.id === viewResume.id ? { ...c, resumeUrl: newResumeInput } : c));
      setNewResumeInput("");
      toast.success("✅ Resume URL updated successfully!");
    } else {
      toast.error("Failed to update resume URL");
    }
  };

  const handleSelectAll = () => {
    const eligibleCandidates = candidates.filter(c => activeTab === 'completed' ? c.status === 'completed' : c.status !== 'completed');
    if (selectedIds.length === eligibleCandidates.length && eligibleCandidates.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(eligibleCandidates.map(c => c.id));
    }
  };

  const handleSelect100 = () => {
    const eligibleCandidates = candidates.filter(c => activeTab === 'completed' ? c.status === 'completed' : c.status !== 'completed');
    setSelectedIds(eligibleCandidates.slice(0, 100).map(c => c.id));
  };

  const handleSelect200 = () => {
    const eligibleCandidates = candidates.filter(c => activeTab === 'completed' ? c.status === 'completed' : c.status !== 'completed');
    setSelectedIds(eligibleCandidates.slice(0, 200).map(c => c.id));
  };

  const handleSelect500 = () => {
    const eligibleCandidates = candidates.filter(c => activeTab === 'completed' ? c.status === 'completed' : c.status !== 'completed');
    setSelectedIds(eligibleCandidates.slice(0, 500).map(c => c.id));
  };

  const handleSelectCurrentPage = () => {
    const currentPageIds = paginatedCandidates.map((c: any) => c.id);
    const alreadyAllSelected = currentPageIds.every((id: string) => selectedIds.includes(id)) && currentPageIds.length > 0;
    if (alreadyAllSelected) {
      setSelectedIds(selectedIds.filter((id: string) => !currentPageIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedIds, ...currentPageIds]));
      setSelectedIds(merged);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected candidate(s)?`)) return;
    try {
      const res = await fetch("/api/admin/candidates/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds })
      });
      if (res.ok) {
        toast.success(`✅ Deleted ${selectedIds.length} candidate(s)`);
        setSelectedIds([]);
        fetchFreshDump();
        if (user?.role === 'application_support') fetchMetrics();
      } else {
        toast.error("Failed to delete candidates");
      }
    } catch (error: any) {
      toast.error("Error during deletion: " + (error.message || "Network issue"));
      console.error(error);
    }
  };

  const handleDeleteOne = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this candidate?")) return;
    try {
      const res = await fetch("/api/admin/candidates", { 
        method: "DELETE", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ id }) 
      });
      if (res.ok) {
        toast.success("✅ Candidate deleted successfully");
        setSelectedIds(prev => prev.filter(i => i !== id));
        fetchFreshDump();
        if (user?.role === 'application_support') fetchMetrics();
      } else {
        toast.error("Failed to delete candidate");
      }
    } catch (error: any) {
      toast.error("Error during deletion: " + (error.message || "Network issue"));
      console.error(error);
    }
  };

  const handleOpenMailModal = (c: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setMailModal({
      candidateId: c.id,
      name: c.name,
      fromEmail: 'hr@gojobsync.com',
      toEmail: c.email.startsWith('noemail-') ? '' : c.email,
      subject: 'Job Opportunities at GoJobSync - Complete Your Registration',
      message: `Hi ${c.name},

We came across your profile and believe you could be a great fit for several exciting job opportunities available on GoJobSync.

Whether you're a Fresher or an Experienced Professional, we have openings across multiple companies and industries waiting for candidates like you.

✨ Why apply through GoJobSync?

- Multiple verified job opportunities
- Quick and easy application process
- Track your application status in real time
- Direct access to hiring companies
- Absolutely FREE for job seekers

Don't miss your chance to land your next job.

👉 Apply Now: www.gojobsync.com/careers/register

Complete your profile and start applying to jobs in just a few minutes.

If you have any questions, simply reply to this email—we're happy to help.

Best Regards,
GoJobSync Recruitment Team
🌐 www.gojobsync.com 
📧 hr@gojobsync.com`
    });
  };

  const handleOpenBulkMailModal = () => {
    const randomTemplate = BULK_TEMPLATES[Math.floor(Math.random() * BULK_TEMPLATES.length)];
    
    // Auto-cycle sender email
    let lastIndex = 0;
    try {
      lastIndex = parseInt(localStorage.getItem('lastSenderIndex') || '-1');
    } catch(e) {}
    const nextIndex = (lastIndex + 1) % SENDER_EMAILS.length;
    try {
      localStorage.setItem('lastSenderIndex', nextIndex.toString());
    } catch(e) {}

    setMailModal({
      isBulk: true,
      candidateIds: selectedIds,
      fromEmail: SENDER_EMAILS[nextIndex],
      subject: 'Job Opportunities at GoJobSync - Complete Your Registration',
      message: randomTemplate
    });
  };

  const handleSendMail = async () => {
    if (!mailModal.isBulk && !mailModal.toEmail) {
      toast.error('Please provide a valid email address');
      return;
    }

    if (mailModal.isBulk) {
      setSendingMail(true);
      setSendProgress({ current: 0, total: mailModal.candidateIds.length });
      
      let successCount = 0;
      let failCount = 0;
      let failReasons = new Set<string>();
      
      const chunkSize = 3;
      for (let i = 0; i < mailModal.candidateIds.length; i += chunkSize) {
        const chunk = mailModal.candidateIds.slice(i, i + chunkSize);
        
        await Promise.all(chunk.map(async (id: string) => {
          const candidate = candidates.find(c => c.id === id);
          if (!candidate || candidate.email.startsWith('noemail-')) {
             failCount++;
             return;
          }
          
          const payload = {
             candidateId: id,
             fromEmail: mailModal.fromEmail,
             toEmail: candidate.email,
             subject: mailModal.subject,
             message: mailModal.message.replace(/\{name\}/g, candidate.name || 'there')
          };
          
          try {
             const res = await fetch('/api/support/send-registration-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
             });
             if (res.ok) {
                successCount++;
             } else {
                const errData = await res.json().catch(() => ({}));
                failReasons.add(errData.error || `HTTP ${res.status}`);
                failCount++;
             }
          } catch (e: any) {
             failReasons.add(e.message || 'Network error');
             failCount++;
          }
        }));
        
        // Add 1.5 second delay between chunks to prevent AWS SES / SMTP connection limits
        await new Promise(r => setTimeout(r, 1500));
        
        setSendProgress(prev => ({ ...prev, current: Math.min(i + chunkSize, mailModal.candidateIds.length) }));
      }
      
      if (failCount > 0) {
        const reasonsStr = Array.from(failReasons).join(' | ');
        toast.error(`Finished. Sent: ${successCount}, Failed: ${failCount}. Reason: ${reasonsStr}`, { duration: 10000 });
      } else {
        toast.success(`Bulk emails completed! All ${successCount} sent successfully.`);
      }
      setMailModal(null);
      setSendProgress({ current: 0, total: 0 });
      setSelectedIds([]);
      fetchFreshDump();
      fetchMetrics();
      setSendingMail(false);
      return;
    }

    setSendingMail(true);
    try {
      const res = await fetch('/api/support/send-registration-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mailModal)
      });
      
      if (res.ok) {
        toast.success('✅ Email sent and marked as completed!');
        setMailModal(null);
        fetchFreshDump();
        fetchMetrics();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to send email');
      }
    } catch (e) {
      toast.error('Error sending email');
    } finally {
      setSendingMail(false);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><div className="spinner" style={{width: 40, height: 40}} /></div>;

  const filteredCandidates = candidates.filter(c => activeTab === 'completed' ? c.status === 'completed' : c.status !== 'completed');
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);
  const paginatedCandidates = filteredCandidates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Group candidates by Date
  const grouped = paginatedCandidates.reduce((acc: any, c: any) => {
    const d = new Date(c.createdAt);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(c);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const getDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatNA = (val: any) => {
    if (!val || val === "NA" || val === "-" || val === "null" || val === "undefined") {
      return <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[11px] font-bold">NA</span>;
    }
    return val;
  };

  const getEducationString = (c: any) => {
    if (!c.education) return "NA";
    try {
      if (c.education.startsWith('[')) {
        const edus = JSON.parse(c.education);
        if (edus.length && edus[0].degree) return `${edus[0].degree} (${edus[0].college || ''})`;
      }
    } catch {}
    return c.education;
  };

  const getLocationString = (c: any) => {
    if (!c.location) return "NA";
    try {
      if (c.location.startsWith('{')) {
        const loc = JSON.parse(c.location);
        return [loc.city, loc.state].filter(Boolean).join(', ') || c.location;
      }
    } catch {}
    return c.location;
  };

  const handleOpenModal = (c: any) => {
    setViewResume(c);
    setNewResumeInput(c.resumeUrl || "");
    setEditForm({
      name: c.name || "",
      email: c.email || "",
      phone: c.phone || "",
      experience: c.experience || "",
      education: getEducationString(c) || "",
      location: getLocationString(c) || "",
      skills: typeof c.skills === 'string' && c.skills.startsWith('[') ? (() => { try { return JSON.parse(c.skills).join(', '); } catch { return c.skills; } })() : (c.skills || ""),
    });
    setIsEditing(false);
  };

  const handleUpdateProfile = async () => {
    if (!viewResume) return;
    setUpdatingProfile(true);
    try {
      const res = await fetch(`/api/candidates/${viewResume.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          experience: editForm.experience,
          education: editForm.education,
          location: editForm.location,
          skills: editForm.skills,
        })
      });
      if (res.ok) {
        toast.success("✅ Candidate profile updated successfully!");
        setCandidates(candidates.map(c => c.id === viewResume.id ? { ...c, ...editForm } : c));
        setViewResume({ ...viewResume, ...editForm });
        setIsEditing(false);
      } else {
        toast.error("Failed to update candidate profile");
      }
    } catch {
      toast.error("Error updating profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingExcel(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = event.target?.result;
        if (!data) return;
        const workbook = read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        const rows: any[][] = utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        
        let headerRowIndex = 0;
        let maxScore = 0;
        let bestHeaders: string[] = [];

        // 1. Find the most likely header row by scanning the first 15 rows
        for (let i = 0; i < Math.min(15, rows.length); i++) {
          const row = rows[i];
          let score = 0;
          const headers = row.map(cell => String(cell).toLowerCase().replace(/[^a-z0-9]/g, ''));
          
          headers.forEach(norm => {
            if (norm.includes('name') || norm.includes('email') || norm.includes('mail') || 
                norm.includes('phone') || norm.includes('contact') || norm.includes('mobile')) {
              score++;
            }
          });
          
          if (score > maxScore) {
            maxScore = score;
            headerRowIndex = i;
            bestHeaders = headers;
          }
        }

        if (maxScore === 0 && rows.length > 0) {
           bestHeaders = ['name', 'email', 'phone', 'department', 'education', 'location', 'skills', 'experience', 'currentrole', 'resumeurl'];
           headerRowIndex = -1; 
        }

        const candidatesPayload = [];
        for (let i = headerRowIndex + 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.every(cell => cell === undefined || cell === null || String(cell).trim() === '')) {
            continue;
          }

          let name = '', email = '', phone = '', department = '', education = '', location = '', skills = '', experience = '', resumeUrl = '';

          bestHeaders.forEach((norm, colIndex) => {
            const val = row[colIndex];
            if (val === undefined || val === null || val === '') return;
            const strVal = String(val).trim();
            
            if (!name && (norm.includes('name') || norm.includes('candidate') || norm.includes('applicant') || norm.includes('first') || norm.includes('user'))) name = strVal;
            else if (!email && (norm.includes('email') || norm.includes('mail') || norm.includes('id'))) email = strVal;
            else if (!phone && (norm.includes('phone') || norm.includes('contact') || norm.includes('mobile') || norm.includes('cell') || norm.includes('number'))) phone = strVal;
            else if (!department && (norm.includes('department') || norm.includes('role') || norm.includes('designation') || norm.includes('job') || norm.includes('domain') || norm.includes('function') || norm.includes('profile') || norm.includes('title') || norm.includes('specialization') || norm.includes('branch'))) department = strVal;
            else if (!education && (norm.includes('education') || norm.includes('degree') || norm.includes('qualification') || norm.includes('course') || norm.includes('ug') || norm.includes('pg') || norm.includes('grad') || norm.includes('academic') || norm.includes('college') || norm.includes('school') || norm.includes('university') || norm.includes('study'))) education = strVal;
            else if (!location && (norm.includes('location') || norm.includes('city') || norm.includes('place') || norm.includes('address') || norm.includes('state') || norm.includes('country') || norm.includes('region') || norm.includes('town') || norm.includes('area') || norm.includes('zone') || norm.includes('pin'))) location = strVal;
            else if (!skills && (norm.includes('skill') || norm.includes('tech') || norm.includes('tool') || norm.includes('software') || norm.includes('language') || norm.includes('expert'))) skills = strVal;
            else if (!experience && (norm.includes('exp') || norm.includes('year') || norm.includes('work') || norm.includes('history') || norm.includes('employ'))) experience = strVal;
            else if (!resumeUrl && (norm.includes('resume') || norm.includes('cv') || norm.includes('url') || norm.includes('link') || norm.includes('drive'))) resumeUrl = strVal;
          });

          if (!email || !phone || !name) {
             row.forEach((cell, idx) => {
                const str = String(cell || '').trim();
                if (!str) return;
                if (!email && str.includes('@') && str.includes('.')) {
                   email = str;
                } 
                else if (!phone && str.replace(/[^0-9]/g, '').length >= 9 && str.replace(/[^0-9]/g, '').length <= 15) {
                   phone = str;
                }
                else if (!name && str.length > 2 && str.length < 50 && !str.includes('@') && !str.match(/[0-9]{5}/)) {
                   name = str;
                }
             });
          }

          if (name || email || phone || department || education || location || skills || experience) {
            candidatesPayload.push({
              name: name || 'NA',
              email: email || `noemail-${name?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0,15) || 'unknown'}-${department?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0,10) || 'role'}@example.com`,
              phone: phone || 'NA',
              currentRole: department || 'NA',
              education: education || 'NA',
              location: location || 'NA',
              skills: skills ? skills.split(',').map(s => s.trim()) : ['General'],
              experience: experience || 'NA',
              resumeUrl: resumeUrl || null
            });
          }
        }

        const totalRecords = candidatesPayload.length;
        setUploadProgress({ uploaded: 0, total: totalRecords });
        
        const chunkSize = 500;
        let successCount = 0;

        for (let i = 0; i < totalRecords; i += chunkSize) {
          const chunk = candidatesPayload.slice(i, i + chunkSize);
          const res = await fetch("/api/admin/candidates/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              candidates: chunk,
              assignedSupportId: user?.id,
              source: 'self'
            })
          });

          if (res.ok) {
            const resData = await res.json();
            successCount += resData.count;
            setUploadProgress({ uploaded: successCount, total: totalRecords });
          } else {
            const err = await res.json();
            throw new Error(err.error || `Failed at chunk ${i / chunkSize + 1}`);
          }
        }

        toast.success(`✅ Successfully uploaded ${successCount} candidates! Duplicates were skipped.`);
        fetchFreshDump();

      } catch (err: any) {
        console.error(err);
        toast.error("Error reading Excel file: " + err.message);
      } finally {
        setUploadingExcel(false);
        setUploadProgress({ uploaded: 0, total: 0 });
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <div className="animate-fade-in mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[var(--foreground)]">
            <Database size={24} className="text-[#0077B6]" />
            {user?.role === 'application_support' ? 'Assigned Fresh Dumps (Application Support)' : 'Fresh Dump'}
          </h1>
          <p className="text-[var(--muted-foreground)]">
            {user?.role === 'application_support'
              ? `Showing profiles pushed by Super Admin specifically assigned to you (${user.name})`
              : 'Day-to-day new applications waiting for review'}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          {user?.role === 'application_support' && (
            <div className="flex items-center gap-3">
              <input type="file" ref={fileInputRef} accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
              <button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={uploadingExcel}
                className="px-4 py-2 bg-[#0077B6] hover:bg-[#0077B6]/90 text-white rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm transition disabled:opacity-50"
              >
                {uploadingExcel ? <div className="spinner" style={{width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent'}} /> : <Upload size={16} />}
                {uploadingExcel ? `Uploading (${uploadProgress.uploaded}/${uploadProgress.total})...` : 'Upload Excel'}
              </button>
              <div className="px-3 py-2 bg-cyan-50 border border-cyan-200 text-cyan-800 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm">
                <UserCheck size={16} /> Support Workspace: {user.name}
              </div>
            </div>
          )}
          {filteredCandidates.length > 0 && (
            <div className="flex items-center gap-3">
              <button onClick={handleSelectCurrentPage} className="text-sm font-bold text-orange-600 hover:text-orange-800 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-orange-50 border border-transparent hover:border-orange-200">
                <CheckSquare size={16} className="text-orange-500" /> Select This Page ({paginatedCandidates.length})
              </button>
              <button onClick={handleSelect100} className="text-sm font-bold text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 border border-transparent hover:border-gray-200">
                <CheckSquare size={16} className="text-[#0077B6]" /> Select 100
              </button>
              <button onClick={handleSelect200} className="text-sm font-bold text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 border border-transparent hover:border-gray-200">
                <CheckSquare size={16} className="text-[#0077B6]" /> Select 200
              </button>
              <button onClick={handleSelect500} className="text-sm font-bold text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 border border-transparent hover:border-gray-200">
                <CheckSquare size={16} className="text-[#0077B6]" /> Select 500
              </button>
              <button onClick={handleSelectAll} className="text-sm font-bold text-gray-600 hover:text-gray-900 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100">
                {selectedIds.length === filteredCandidates.length && filteredCandidates.length > 0 ? <CheckSquare size={16} className="text-[#0077B6]" /> : <Square size={16} />} Select All
              </button>
              {selectedIds.length > 0 && (
                <button onClick={() => setSelectedIds([])} className="text-sm font-bold text-red-600 hover:text-red-800 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200">
                  <X size={16} /> Unselect All
                </button>
              )}
              {selectedIds.length > 0 && (
                <>
                  <button onClick={handleOpenBulkMailModal} className="px-3 py-1.5 bg-[#0077B6] text-white rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-[#0077B6]/90 transition shadow-sm">
                    <Mail size={14} /> Send Mail to Selected ({selectedIds.length})
                  </button>
                  <button onClick={handleBulkDelete} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-red-100 transition shadow-sm">
                    <Trash2 size={14} /> Delete Selected ({selectedIds.length})
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {user?.role === 'application_support' && metrics && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-xs font-bold uppercase mb-1">Emails Sent Today</span>
            <span className="text-3xl font-black text-[#0077B6]">{metrics.today}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-xs font-bold uppercase mb-1">Emails Sent This Week</span>
            <span className="text-3xl font-black text-emerald-600">{metrics.weekly}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-xs font-bold uppercase mb-1">Emails Sent This Month</span>
            <span className="text-3xl font-black text-indigo-600">{metrics.monthly}</span>
          </div>
        </div>
      )}

      <div className="flex bg-gray-100 p-1 rounded-lg w-fit mb-6">
        <button onClick={() => { setActiveTab('pending'); setSelectedIds([]); setCurrentPage(1); }} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${activeTab === 'pending' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          Pending ({candidates.filter(c => c.status !== 'completed').length})
        </button>
        <button onClick={() => { setActiveTab('completed'); setSelectedIds([]); setCurrentPage(1); }} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${activeTab === 'completed' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          Completed ({candidates.filter(c => c.status === 'completed').length})
        </button>
      </div>

      <div className="animate-fade-in-up space-y-10">
        {sortedDates.length === 0 ? (
          <div className="text-center p-12 card border border-[var(--border)]">
            <Database size={48} className="mx-auto mb-4 text-[var(--muted)] opacity-50" />
            <h3 className="text-lg font-bold">No fresh candidates</h3>
            <p className="text-[var(--muted-foreground)]">
              {user?.role === 'application_support'
                ? "No profiles have been pushed to your Application Support account yet."
                : "All candidates have been reviewed or none have applied recently."}
            </p>
          </div>
        ) : (
          sortedDates.map(dateStr => (
            <div key={dateStr}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[var(--foreground)] border-b border-[var(--border)] pb-2">
                <Clock size={18} className="text-[var(--muted-foreground)]" />
                {getDateLabel(dateStr)}
                <span className="badge badge-primary ml-2">{grouped[dateStr].length}</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[dateStr].map((c: any) => (
                  <div key={c.id} className={`card p-5 border flex flex-col transition-all shadow-sm cursor-pointer ${selectedIds.includes(c.id) ? 'border-[#0077B6] bg-blue-50/10' : 'border-[var(--border)] hover:border-[#0077B6]/30'}`} onClick={() => handleOpenModal(c)}>
                    <div className="flex gap-3 items-center mb-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedIds(prev => prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id]) }}
                        className={`p-1 rounded-lg transition shrink-0 ${selectedIds.includes(c.id) ? 'text-[#0077B6]' : 'text-gray-300 hover:text-gray-500'}`}
                      >
                        {selectedIds.includes(c.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl shrink-0">
                        {c.name[0]?.toUpperCase() || 'C'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-bold text-lg text-[var(--foreground)] truncate">{formatNA(c.name)}</h3>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {c.status === 'completed' && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase bg-green-500 text-white flex items-center gap-1 shadow-sm">
                                <Check size={10} /> Completed
                              </span>
                            )}
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${c.source === 'excel_upload' || c.source === 'self' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                              {c.source === 'excel_upload' || c.source === 'self' ? 'Excel' : 'Online'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)] truncate">{formatNA(c.currentRole || c.appliedFor || 'Candidate')}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <Briefcase size={14} className="shrink-0 text-slate-400" />
                        <span className="truncate">Dept/Role: <strong>{formatNA(c.currentRole || c.requirementTitle || 'General Application')}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <Phone size={14} className="shrink-0 text-slate-400" />
                        <span>Contact: <strong>{formatNA(c.phone)}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <Mail size={14} className="shrink-0 text-slate-400" />
                        <span className="truncate">Mail: <strong>{formatNA(c.email)}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <GraduationCap size={14} className="shrink-0 text-slate-400" />
                        <span className="truncate">Edu: <strong>{formatNA(getEducationString(c))}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <MapPin size={14} className="shrink-0 text-slate-400" />
                        <span className="truncate">Loc: <strong>{formatNA(getLocationString(c))}</strong></span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {c.resumeUrl ? (
                          <button onClick={() => handleOpenModal(c)} className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition">
                            <Eye size={13} /> Resume
                          </button>
                        ) : (
                          <button onClick={() => handleOpenModal(c)} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-bold hover:bg-amber-100">+ Attach</button>
                        )}
                        {c.email && c.email !== 'NA' && (
                          <button onClick={(e) => handleOpenMailModal(c, e)} title={`Send Registration Email to ${c.email}`} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                            <Mail size={13} />
                          </button>
                        )}
                        {c.phone && c.phone !== 'NA' && (
                          <a href={getRegistrationWhatsAppLink(c.name, c.phone)} target="_blank" rel="noreferrer" title={`WhatsApp ${c.phone}`} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition">
                            <Phone size={13} />
                          </a>
                        )}
                        <button onClick={(e) => handleDeleteOne(c.id, e)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition ml-auto" title="Delete Candidate">
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <span className="text-[11px] text-[var(--muted-foreground)] shrink-0">{new Date(c.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 mb-8">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-gray-200">Previous</button>
          <span className="text-sm font-bold text-gray-600">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-gray-200">Next</button>
        </div>
      )}

      {/* Candidate Profile & Resume View/Attach Modal */}
      {viewResume && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setViewResume(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5 sticky top-0 bg-white border-b pb-4">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${viewResume.source === 'excel_upload' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                  {viewResume.source === 'excel_upload' ? 'Excel Upload' : 'Applied Online'}
                </span>
                <h2 className="text-lg font-bold text-gray-800 mt-1">Candidate Dump Profile</h2>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${isEditing ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <Edit2 size={14} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                <button onClick={() => setViewResume(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={20} /></button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6 pb-5 border-b">
              <div className="w-14 h-14 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-xl font-bold">{viewResume.name?.[0]?.toUpperCase() || 'C'}</div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{formatNA(viewResume.name)}</h3>
                <p className="text-sm text-gray-500">{formatNA(viewResume.currentRole || viewResume.appliedFor || 'Candidate')}</p>
              </div>
            </div>

            {/* Quick Contact Bar (Email & WhatsApp) */}
            <div className="flex gap-2.5 mb-5 pb-4 border-b">
              {viewResume.email && viewResume.email !== 'NA' ? (
                <button onClick={(e) => handleOpenMailModal(viewResume, e)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition border border-blue-200 shadow-sm">
                  <Mail size={15} /> Email Candidate
                </button>
              ) : (
                <button disabled className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-400 rounded-lg text-xs font-bold cursor-not-allowed border border-gray-200">
                  <Mail size={15} /> Email (NA)
                </button>
              )}
              {viewResume.phone && viewResume.phone !== 'NA' ? (
                <a href={getRegistrationWhatsAppLink(viewResume.name, viewResume.phone)} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition border border-emerald-200 shadow-sm">
                  <Phone size={15} /> WhatsApp Contact
                </a>
              ) : (
                <button disabled className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-400 rounded-lg text-xs font-bold cursor-not-allowed border border-gray-200">
                  <Phone size={15} /> WhatsApp (NA)
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4 bg-amber-50/40 p-4 rounded-xl border border-amber-200 mb-4">
                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 border-b pb-2"><Edit2 size={15} className="text-amber-600" /> Edit Candidate Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Name</label>
                    <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border rounded-lg text-xs bg-white" placeholder="Candidate Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Contact No</label>
                    <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full p-2 border rounded-lg text-xs bg-white" placeholder="+91..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mail ID</label>
                    <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full p-2 border rounded-lg text-xs bg-white" placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Experience</label>
                    <input type="text" value={editForm.experience} onChange={e => setEditForm({...editForm, experience: e.target.value})} className="w-full p-2 border rounded-lg text-xs bg-white" placeholder="e.g. 2 Years Software Engineer" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Education</label>
                  <input type="text" value={editForm.education} onChange={e => setEditForm({...editForm, education: e.target.value})} className="w-full p-2 border rounded-lg text-xs bg-white" placeholder="e.g. M.Sc Computer Science" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                  <input type="text" value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} className="w-full p-2 border rounded-lg text-xs bg-white" placeholder="e.g. Bangalore, KA" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Skills (comma separated)</label>
                  <input type="text" value={editForm.skills} onChange={e => setEditForm({...editForm, skills: e.target.value})} className="w-full p-2 border rounded-lg text-xs bg-white" placeholder="React, Node.js, Python..." />
                </div>
                <div className="pt-3 border-t flex justify-end gap-2">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300">Cancel</button>
                  <button onClick={handleUpdateProfile} disabled={updatingProfile} className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition shadow-sm disabled:opacity-50">
                    <Save size={14} /> {updatingProfile ? 'Saving...' : 'Save & Update Profile'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500 mb-1">Mail ID</p><p className="text-sm font-medium text-gray-800">{formatNA(viewResume.email)}</p></div>
                  <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500 mb-1">Contact No</p><p className="text-sm font-medium text-gray-800">{formatNA(viewResume.phone)}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500 mb-1">Experience</p><p className="text-sm font-medium text-gray-800">{formatNA(viewResume.experience)}</p></div>
                  <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500 mb-1">Education</p><p className="text-sm font-medium text-gray-800">{formatNA(getEducationString(viewResume))}</p></div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500 mb-1">Location</p><p className="text-sm font-medium text-gray-800">{formatNA(getLocationString(viewResume))}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {(() => { 
                      try { 
                        const parsed = JSON.parse(viewResume.skills); 
                        return Array.isArray(parsed) && parsed.length > 0 ? parsed : [viewResume.skills];
                      } catch { return viewResume.skills ? [viewResume.skills] : ["NA"]; } 
                    })().map((skill: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Resume Section with NA Fallback & Attach Later */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
              <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1"><FileText size={14} /> Resume Attachment</p>
              {viewResume.resumeUrl ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button onClick={(e) => openResumeSafe(viewResume.resumeUrl, e)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                      <FileText size={16} /> Open & View Resume
                    </button>
                    <button onClick={(e) => downloadResumeSafe(viewResume.resumeUrl, `${viewResume.name || 'Candidate'}_Resume.pdf`, e)} className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition shadow-sm" title="Download Resume">
                      <Download size={16} /> Download
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input type="text" placeholder="Update resume URL..." value={newResumeInput} onChange={e => setNewResumeInput(e.target.value)} className="flex-1 p-2 border rounded text-xs" />
                    <button onClick={handleUpdateResume} className="px-3 py-1 bg-slate-800 text-white rounded text-xs font-medium hover:bg-slate-900">Update</button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3">
                  <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold mb-2">Resume: NA</div>
                  <p className="text-xs text-gray-500 mb-3">No resume was attached during Excel upload or application.</p>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Paste Resume URL (e.g., Google Drive link)..." value={newResumeInput} onChange={e => setNewResumeInput(e.target.value)} className="flex-1 p-2 border rounded text-xs bg-white" />
                    <button onClick={handleUpdateResume} disabled={!newResumeInput} className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 disabled:opacity-50">Attach Resume</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Mail Modal */}
      {mailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 animate-fade-in" onClick={() => !sendingMail && setMailModal(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5 border-b pb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Mail size={20} className="text-[#0077B6]" /> {mailModal.isBulk ? `Bulk Send Registration Email (${mailModal.candidateIds.length} profiles)` : 'Send Registration Email'}
              </h2>
              <button onClick={() => setMailModal(null)} disabled={sendingMail} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 disabled:opacity-50"><X size={20} /></button>
            </div>
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">From Email (Sender)</label>
                {mailModal.isBulk ? (
                  <select value={mailModal.fromEmail} onChange={e => setMailModal({...mailModal, fromEmail: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm bg-blue-50/50 focus:bg-white transition font-semibold text-blue-800" disabled={sendingMail}>
                    <option value="hr@gojobsync.com">hr@gojobsync.com (Resend Route 1)</option>
                    <option value="careers@gojobsync.com">careers@gojobsync.com (Resend Route 2)</option>
                    <option value="updates@gojobsync.com">updates@gojobsync.com (Resend Route 3)</option>
                  </select>
                ) : (
                  <input type="email" value={mailModal.fromEmail} onChange={e => setMailModal({...mailModal, fromEmail: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm bg-blue-50/50 focus:bg-white transition" placeholder="Sender's email" disabled={sendingMail} />
                )}
              </div>
              {!mailModal.isBulk ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">To Email</label>
                  <input type="email" value={mailModal.toEmail} onChange={e => setMailModal({...mailModal, toEmail: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm bg-gray-50 focus:bg-white transition" placeholder="Candidate's email" disabled={sendingMail} />
                </div>
              ) : (
                <div className="p-3 bg-blue-50 text-blue-800 text-sm font-medium rounded-lg border border-blue-100">
                  You are sending an email to {mailModal.candidateIds.length} candidates. The system will automatically use each candidate's registered email and insert their name using the <span className="font-bold font-mono">`{"{name}"}`</span> variable.
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                <input type="text" value={mailModal.subject} onChange={e => setMailModal({...mailModal, subject: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm bg-gray-50 focus:bg-white transition" placeholder="Email subject" disabled={sendingMail} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Message {mailModal.isBulk && <span className="text-gray-500 font-normal">(Use `{"{name}"}` as placeholder)</span>}</label>
                <textarea rows={15} value={mailModal.message} onChange={e => setMailModal({...mailModal, message: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm bg-gray-50 focus:bg-white transition font-mono" placeholder="Email content..." disabled={sendingMail}></textarea>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button onClick={() => setMailModal(null)} disabled={sendingMail} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition disabled:opacity-50">Cancel</button>
                <button onClick={handleSendMail} disabled={sendingMail} className="flex items-center gap-2 px-5 py-2 bg-[#0077B6] text-white rounded-lg text-sm font-bold hover:bg-[#0077B6]/90 transition shadow-sm disabled:opacity-50">
                  {sendingMail ? <div className="spinner" style={{width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent'}} /> : <Mail size={16} />}
                  {sendingMail ? (mailModal.isBulk ? `Sending ${sendProgress.current} / ${sendProgress.total}...` : 'Sending...') : 'Send Email'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

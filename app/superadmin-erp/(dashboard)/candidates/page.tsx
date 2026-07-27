"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Trash2, Eye, Plus, X, Upload, FileText, Send, CheckSquare, Square, Filter, Download, UserCheck, ChevronLeft, ChevronRight, Edit2, Save, Mail, Phone } from "lucide-react";
import { read, utils, writeFile } from "xlsx";
import { openResumeSafe, downloadResumeSafe } from "@/lib/resume";

export default function SACandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sourceTab, setSourceTab] = useState<'all' | 'applied' | 'excel_upload'>('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);
  const [viewResume, setViewResume] = useState<any>(null);

  // Forms
  const [form, setForm] = useState({ name: "", email: "", phone: "", skills: "", experience: "", education: "", currentRole: "", location: "", resumeUrl: "" });
  const [newResumeInput, setNewResumeInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", experience: "", education: "", location: "", skills: "" });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ uploaded: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bulk Selection & Push
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [supportUsers, setSupportUsers] = useState<any[]>([]);
  const [selectedSupportId, setSelectedSupportId] = useState("");
  const [pushing, setPushing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  const fetchData = () => {
    setLoading(true);
    fetch("/api/admin/candidates")
      .then(r => r.json())
      .then(d => {
        setCandidates(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchSupportUsers = () => {
    fetch("/api/admin/employees?role=application_support")
      .then(r => r.json())
      .then(d => setSupportUsers(Array.isArray(d) ? d : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
    fetchSupportUsers();
  }, []);

  // Filter candidates by search and sourceTab
  const filtered = candidates.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase()) || 
                          c.email?.toLowerCase().includes(search.toLowerCase()) || 
                          c.phone?.includes(search) ||
                          c.currentRole?.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (sourceTab === 'applied') return c.source !== 'excel_upload';
    if (sourceTab === 'excel_upload') return c.source === 'excel_upload';
    return true;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sourceTab]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedCandidates = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(c => c.id));
    }
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteOne = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this candidate?")) return;
    await fetch("/api/admin/candidates", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchData();
    setSelectedIds(selectedIds.filter(item => item !== id));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected candidates?`)) return;
    const res = await fetch("/api/admin/candidates/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds })
    });
    if (res.ok) {
      setSelectedIds([]);
      fetchData();
    } else {
      alert("Failed to delete selected candidates");
    }
  };

  const handlePushConfirm = async () => {
    if (selectedIds.length === 0 || !selectedSupportId) {
      alert("Please select at least one candidate and an Application Support user");
      return;
    }
    setPushing(true);
    try {
      const res = await fetch("/api/admin/candidates/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateIds: selectedIds, supportUserId: selectedSupportId })
      });
      if (res.ok) {
        const data = await res.json();
        alert(`✅ Successfully pushed ${data.count} candidates to ${data.supportUser?.name || 'Support'}!`);
        setShowPushModal(false);
        setSelectedIds([]);
        setSelectedSupportId("");
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to push candidates");
      }
    } catch (e) {
      console.error(e);
      alert("Error pushing candidates");
    } finally {
      setPushing(false);
    }
  };

  const handleAddCandidate = async () => {
    const res = await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        skills: form.skills ? form.skills.split(",").map(s => s.trim()) : [],
        source: "excel_upload"
      })
    });
    if (res.ok) {
      setShowAddModal(false);
      setForm({ name: "", email: "", phone: "", skills: "", experience: "", education: "", currentRole: "", location: "", resumeUrl: "" });
      fetchData();
    } else {
      const d = await res.json();
      alert(d.error || "Error adding candidate");
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
           bestHeaders = rows[0].map(cell => String(cell).toLowerCase().replace(/[^a-z0-9]/g, ''));
        }

        // 2. Process data rows below the header
        const candidatesPayload = [];
        for (let i = headerRowIndex + 1; i < rows.length; i++) {
          const row = rows[i];
          // Skip completely empty rows
          if (!row || row.every(cell => cell === undefined || cell === null || String(cell).trim() === '')) {
            continue;
          }

          let name = '', email = '', phone = '', department = '', education = '', location = '', skills = '', experience = '', resumeUrl = '';

          bestHeaders.forEach((norm, colIndex) => {
            const val = row[colIndex];
            if (val === undefined || val === null || val === '') return;
            
            if (!name && (norm.includes('name') || norm.includes('candidate') || norm.includes('applicant'))) name = String(val);
            else if (!email && (norm.includes('email') || norm.includes('mail'))) email = String(val);
            else if (!phone && (norm.includes('phone') || norm.includes('contact') || norm.includes('mobile'))) phone = String(val);
            else if (!department && (norm.includes('department') || norm.includes('role') || norm.includes('designation') || norm.includes('job'))) department = String(val);
            else if (!education && (norm.includes('education') || norm.includes('degree') || norm.includes('qualification'))) education = String(val);
            else if (!location && (norm.includes('location') || norm.includes('city') || norm.includes('place') || norm.includes('address'))) location = String(val);
            else if (!skills && (norm.includes('skill') || norm.includes('tech'))) skills = String(val);
            else if (!experience && (norm.includes('exp') || norm.includes('year'))) experience = String(val);
            else if (!resumeUrl && (norm.includes('resume') || norm.includes('cv') || norm.includes('url') || norm.includes('link'))) resumeUrl = String(val);
          });

          // Only push if at least one meaningful field exists
          if (name || email || phone || department || education || location || skills || experience) {
            candidatesPayload.push({
              name: name || 'NA',
              email: email || `noemail-${Math.random().toString(36).substring(7)}@example.com`,
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
            body: JSON.stringify({ candidates: chunk })
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

        alert(`✅ Successfully uploaded ${successCount} candidates from Excel!`);
        setShowExcelModal(false);
        fetchData();

      } catch (err: any) {
        console.error(err);
        alert("Error reading Excel file: " + err.message);
      } finally {
        setUploadingExcel(false);
        setUploadProgress({ uploaded: 0, total: 0 });
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

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
      setNewResumeInput("");
      fetchData();
      alert("✅ Resume URL updated successfully!");
    } else {
      alert("Failed to update resume URL");
    }
  };

  // Format "NA" helper
  const renderField = (val: any) => {
    if (val === undefined || val === null || val === "" || val === "-" || val === "null" || val === "undefined" || val === "Not specified") {
      return <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-semibold">NA</span>;
    }
    return <span className="text-gray-800">{val}</span>;
  };

  const getEducationString = (c: any) => {
    if (!c.education) return null;
    try {
      if (c.education.startsWith('[')) {
        const edus = JSON.parse(c.education);
        if (edus.length && edus[0].degree) return `${edus[0].degree} (${edus[0].college || ''})`;
      }
    } catch {}
    return c.education;
  };

  const getLocationString = (c: any) => {
    if (!c.location) return null;
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
        alert("✅ Candidate profile updated successfully!");
        setCandidates(candidates.map(c => c.id === viewResume.id ? { ...c, ...editForm } : c));
        setViewResume({ ...viewResume, ...editForm });
        setIsEditing(false);
      } else {
        alert("Failed to update candidate profile");
      }
    } catch {
      alert("Error updating profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleDownloadTemplate = () => {
    const sampleData = [
      {
        "Name": "MANIARASI M",
        "Email": "maniarasi39@gmail.com",
        "Phone": "+918300431833",
        "Department": "Computer Science",
        "Education": "M.Sc - Computer Science (Manonmaniyam Sundaranar University)",
        "Location": "Pathamadai, TN",
        "Skills": "React, Node.js, JavaScript, MongoDB",
        "Experience": "2 Years Software Engineer at ABC Tech",
        "Current Role": "Frontend Developer",
        "Resume URL": "https://drive.google.com/file/d/example_resume_link/view"
      },
      {
        "Name": "SUBASH G",
        "Email": "subashgopi0105@gmail.com",
        "Phone": "+919342215834",
        "Department": "Data Science",
        "Education": "M.Sc Data Science (Vellore Institute of Technology (VIT))",
        "Location": "Gudiyattam, TN",
        "Skills": "Python, Machine Learning, Data Analysis, SQL",
        "Experience": "Fresher",
        "Current Role": "Data Analyst Trainee",
        "Resume URL": "https://drive.google.com/file/d/sample_resume_link_2/view"
      },
      {
        "Name": "Priyansh Kushwaha",
        "Email": "priyanshkushwaha88@gmail.com",
        "Phone": "9340767198",
        "Department": "Information Technology",
        "Education": "B.Tech - Computer Science (Gyan Ganga Institute of Technology)",
        "Location": "Bangalore, KA",
        "Skills": "Java, Spring Boot, Microservices, AWS",
        "Experience": "3 Years Backend Developer",
        "Current Role": "Senior Software Engineer",
        "Resume URL": ""
      }
    ];

    const worksheet = utils.json_to_sheet(sampleData);
    worksheet["!cols"] = [
      { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 22 }, { wch: 45 },
      { wch: 20 }, { wch: 35 }, { wch: 30 }, { wch: 25 }, { wch: 45 }
    ];
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Candidate Upload Template");
    writeFile(workbook, "Candidate_Upload_Template.xlsx");
  };

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Candidate Management (ERP)</h1>
          <p className="text-xs text-gray-500">Manage applied candidates, upload Excel dumps, and push profiles to Application Support</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleDownloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-semibold hover:bg-blue-100 shadow-sm transition" title="Download Excel Sample Template">
            <Download size={16} /> Sample Template
          </button>
          <button onClick={() => setShowExcelModal(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm transition">
            <Upload size={16} /> Upload Excel
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800 shadow-sm transition">
            <Plus size={16} /> Add Candidate
          </button>
        </div>
      </div>

      {/* Filter Tabs & Bulk Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border mb-6 gap-4">
        {/* Source Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button onClick={() => { setSourceTab('all'); setSelectedIds([]); }} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${sourceTab === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            All ({candidates.length})
          </button>
          <button onClick={() => { setSourceTab('applied'); setSelectedIds([]); }} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${sourceTab === 'applied' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            Applied ({candidates.filter(c => c.source !== 'excel_upload').length})
          </button>
          <button onClick={() => { setSourceTab('excel_upload'); setSelectedIds([]); }} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${sourceTab === 'excel_upload' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            Excel Uploads ({candidates.filter(c => c.source === 'excel_upload').length})
          </button>
        </div>

        {/* Search & Bulk Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg animate-fade-in">
              <span className="text-xs font-bold text-blue-700">{selectedIds.length} selected</span>
              <button onClick={() => setShowPushModal(true)} className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">
                <Send size={12} /> Push to Support
              </button>
              <button onClick={handleBulkDelete} className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search name, email, phone..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 w-10 text-center">
                  <button onClick={handleSelectAll} className="text-gray-500 hover:text-gray-700 flex items-center justify-center">
                    {filtered.length > 0 && selectedIds.length === filtered.length ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} />}
                  </button>
                </th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Mail ID</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Contact No</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Department</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Education</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Location</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Support</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Resume</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="p-8 text-center text-gray-500">Loading candidates...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10} className="p-8 text-center text-gray-400">No candidates found in this view</td></tr>
              ) : paginatedCandidates.map(c => {
                const isSelected = selectedIds.includes(c.id);
                const supportUserObj = supportUsers.find(u => u.id === c.assignedSupportId) || c.assignedSupport;
                const supportName = supportUserObj?.name || c.assignedSupport?.name || null;
                return (
                  <tr key={c.id} className={`border-b hover:bg-gray-50 transition ${isSelected ? 'bg-blue-50/50' : ''}`} onClick={() => handleOpenModal(c)}>
                    <td className="p-4 text-center" onClick={(e) => handleSelectRow(c.id, e)}>
                      <button className="text-gray-500 hover:text-gray-700 flex items-center justify-center">
                        {isSelected ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} />}
                      </button>
                    </td>
                    <td className="p-4 text-sm font-semibold">{renderField(c.name)}</td>
                    <td className="p-4 text-sm text-gray-600">{renderField(c.email)}</td>
                    <td className="p-4 text-sm text-gray-600">{renderField(c.phone)}</td>
                    <td className="p-4 text-sm font-medium text-slate-700">{renderField(c.currentRole || c.appliedFor)}</td>
                    <td className="p-4 text-sm text-gray-600">{renderField(getEducationString(c))}</td>
                    <td className="p-4 text-sm text-gray-600 whitespace-nowrap">{renderField(getLocationString(c))}</td>
                    <td className="p-4 text-xs">
                      {supportName ? (
                        <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full font-medium flex items-center gap-1 w-max">
                          <UserCheck size={12} /> {supportName}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Not pushed</span>
                      )}
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        {c.resumeUrl ? (
                          <button onClick={() => handleOpenModal(c)} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition">
                            <Eye size={14} /> View
                          </button>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[11px] font-bold">NA</span>
                            <button onClick={() => handleOpenModal(c)} className="text-blue-600 hover:underline text-xs font-semibold">+ Attach</button>
                          </div>
                        )}
                        {c.email && (
                          <a href={`mailto:${c.email}?subject=Regarding Your Job Application at The JobSync`} onClick={(e) => e.stopPropagation()} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition shadow-sm" title={`Email ${c.email}`}>
                            <Mail size={14} />
                          </a>
                        )}
                        {c.phone && (
                          <a href={`https://wa.me/${c.phone.toString().replace(/[^0-9]/g, '')}?text=Hi ${encodeURIComponent(c.name || 'there')}, regarding your application at The JobSync...`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition shadow-sm" title={`WhatsApp ${c.phone}`}>
                            <Phone size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => handleDeleteOne(c.id, e)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete Candidate">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-xl gap-4">
            <span className="text-sm text-gray-600">
              Showing <span className="font-bold text-gray-900">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-bold text-gray-900">{filtered.length}</span> candidates
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm text-gray-700"
                title="Previous Page"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage > 3) {
                      pageNum = currentPage - 3 + i;
                      if (pageNum > totalPages) return null;
                    }
                  }
                  if (pageNum > totalPages || pageNum < 1) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${currentPage === pageNum ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200 bg-white border border-gray-200'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm text-gray-700"
                title="Next Page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Push to Application Support Modal */}
      {showPushModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Send size={18} className="text-blue-600" /> Push Candidates to Support
              </h2>
              <button onClick={() => setShowPushModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              You have selected <strong className="text-blue-600 font-bold">{selectedIds.length} candidate(s)</strong>. Select an Application Support team member to push these profiles to their <strong>Fresh Dump</strong> workspace:
            </p>
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {supportUsers.length === 0 ? (
                <div className="p-4 text-center bg-gray-50 rounded-lg border text-sm text-gray-500">
                  No Application Support accounts found. Go to Employees to create one.
                </div>
              ) : (
                supportUsers.map(su => (
                  <label key={su.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition ${selectedSupportId === su.id ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="supportUser" checked={selectedSupportId === su.id} onChange={() => setSelectedSupportId(su.id)} className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-bold text-gray-800">{su.name}</div>
                        <div className="text-xs text-gray-500">{su.email}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 text-[10px] font-bold rounded-full">Support</span>
                  </label>
                ))
              )}
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t">
              <button onClick={() => setShowPushModal(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handlePushConfirm} disabled={pushing || !selectedSupportId} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                {pushing ? "Pushing..." : "Confirm Push"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Upload Modal */}
      {showExcelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Upload size={18} className="text-emerald-600" /> Upload Excel Dump
              </h2>
              <button onClick={() => setShowExcelModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Upload an Excel sheet (`.xlsx`, `.xls`, `.csv`) containing candidate data. Profiles without specific fields will automatically show as <strong className="text-gray-700">NA</strong>.
            </p>
            <div className="mb-4 flex justify-center">
              <button onClick={handleDownloadTemplate} type="button" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition shadow-sm w-full justify-center">
                <Download size={14} /> Download Sample Excel Template (.xlsx)
              </button>
            </div>
            <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/30 rounded-xl p-6 text-center cursor-pointer hover:bg-emerald-50 transition mb-6" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Click to select file</p>
              <p className="text-xs text-gray-500 mt-1">Supports Excel and CSV formats</p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx,.xls,.csv" className="hidden" />
            </div>
            {uploadingExcel && (
              <div className="flex flex-col items-center justify-center gap-2 text-sm text-emerald-700 font-medium mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  {uploadProgress.total > 0 
                    ? `Processing... (${uploadProgress.uploaded} / ${uploadProgress.total})` 
                    : "Reading and processing file..."}
                </div>
                {uploadProgress.total > 0 && (
                  <div className="w-full bg-emerald-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full transition-all duration-300" 
                      style={{ width: `${(uploadProgress.uploaded / uploadProgress.total) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-end pt-3 border-t">
              <button onClick={() => setShowExcelModal(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Details & Resume Modal */}
      {viewResume && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 sticky top-0 bg-white border-b pb-4">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${viewResume.source === 'excel_upload' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                  {viewResume.source === 'excel_upload' ? 'Excel Upload' : 'Applied Online'}
                </span>
                <h2 className="text-lg font-bold text-gray-800 mt-1">Candidate Profile</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isEditing ? 'bg-amber-100 text-amber-800' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                >
                  <Edit2 size={14} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                <button onClick={() => setViewResume(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={20} /></button>
              </div>
            </div>

            {/* Quick Contact Bar */}
            <div className="flex flex-wrap gap-3 mb-5 p-3 bg-slate-50 rounded-xl border border-slate-200 justify-between items-center">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">Quick Message:</span>
              <div className="flex gap-2">
                {viewResume.email && (
                  <a href={`mailto:${viewResume.email}?subject=Regarding Your Job Application at The JobSync`} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition shadow-sm">
                    <Mail size={14} /> Email Candidate
                  </a>
                )}
                {viewResume.phone && (
                  <a href={`https://wa.me/${viewResume.phone.toString().replace(/[^0-9]/g, '')}?text=Hi ${encodeURIComponent(viewResume.name || 'there')}, regarding your application at The JobSync...`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition shadow-sm">
                    <Phone size={14} /> WhatsApp Message
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6 pb-5 border-b">
              <div className="w-14 h-14 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-xl font-bold">{viewResume.name?.[0]?.toUpperCase() || 'C'}</div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{renderField(viewResume.name)}</h3>
                <p className="text-sm text-gray-500">{renderField(viewResume.currentRole || viewResume.appliedFor)}</p>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200 mb-4">
                <div><label className="text-xs text-gray-500 font-semibold">Name</label><input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full p-2 border rounded text-sm bg-white mt-1" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-semibold">Mail ID</label><input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full p-2 border rounded text-sm bg-white mt-1" /></div>
                  <div><label className="text-xs text-gray-500 font-semibold">Contact No</label><input type="text" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full p-2 border rounded text-sm bg-white mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-semibold">Experience</label><input type="text" value={editForm.experience} onChange={e => setEditForm({ ...editForm, experience: e.target.value })} className="w-full p-2 border rounded text-sm bg-white mt-1" /></div>
                  <div><label className="text-xs text-gray-500 font-semibold">Education</label><input type="text" value={editForm.education} onChange={e => setEditForm({ ...editForm, education: e.target.value })} className="w-full p-2 border rounded text-sm bg-white mt-1" /></div>
                </div>
                <div><label className="text-xs text-gray-500 font-semibold">Location</label><input type="text" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} className="w-full p-2 border rounded text-sm bg-white mt-1" /></div>
                <div><label className="text-xs text-gray-500 font-semibold">Skills (comma separated)</label><input type="text" value={editForm.skills} onChange={e => setEditForm({ ...editForm, skills: e.target.value })} className="w-full p-2 border rounded text-sm bg-white mt-1" /></div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-300">Cancel</button>
                  <button onClick={handleUpdateProfile} disabled={updatingProfile} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm disabled:opacity-50">
                    <Save size={14} /> {updatingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500 mb-1">Mail ID</p><p className="text-sm font-medium text-gray-800">{renderField(viewResume.email)}</p></div>
                  <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500 mb-1">Contact No</p><p className="text-sm font-medium text-gray-800">{renderField(viewResume.phone)}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500 mb-1">Experience</p><p className="text-sm font-medium text-gray-800">{renderField(viewResume.experience)}</p></div>
                  <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500 mb-1">Education</p><p className="text-sm font-medium text-gray-800">{renderField(getEducationString(viewResume))}</p></div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500 mb-1">Location</p><p className="text-sm font-medium text-gray-800">{renderField(getLocationString(viewResume))}</p></div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {(() => { 
                      try { 
                        const parsed = JSON.parse(viewResume.skills); 
                        return Array.isArray(parsed) && parsed.length > 0 ? parsed : [viewResume.skills];
                      } catch { return viewResume.skills ? [viewResume.skills] : []; } 
                    })().map((skill: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 mt-4">
              {/* Resume Section with NA Fallback & Attach Later */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
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
                    <p className="text-xs text-gray-500 mb-3">No resume was attached during online application or Excel upload.</p>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Paste Resume URL (e.g., Google Drive link)..." value={newResumeInput} onChange={e => setNewResumeInput(e.target.value)} className="flex-1 p-2 border rounded text-xs bg-white" />
                      <button onClick={handleUpdateResume} disabled={!newResumeInput} className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 disabled:opacity-50">Attach Resume</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-3"><h2 className="text-lg font-bold">Add Candidate Manually</h2><button onClick={() => setShowAddModal(false)}><X size={20} /></button></div>
            <div className="space-y-3">
              <input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <div className="grid grid-cols-2 gap-3"><input placeholder="Mail ID" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="p-2.5 border rounded-lg text-sm" /><input placeholder="Contact No" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="p-2.5 border rounded-lg text-sm" /></div>
              <input placeholder="Department / Role" value={form.currentRole} onChange={e => setForm({...form, currentRole: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <input placeholder="Skills (comma separated)" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <div className="grid grid-cols-2 gap-3"><input placeholder="Experience" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} className="p-2.5 border rounded-lg text-sm" /><input placeholder="Education" value={form.education} onChange={e => setForm({...form, education: e.target.value})} className="p-2.5 border rounded-lg text-sm" /></div>
              <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <input placeholder="Resume URL (optional)" value={form.resumeUrl} onChange={e => setForm({...form, resumeUrl: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-3 border-t"><button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button><button onClick={handleAddCandidate} className="px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium">Add Candidate</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Database, Clock, Briefcase, Mail, Phone, MapPin, GraduationCap, FileText, Eye, UserCheck, X, Download, Edit2, Save } from 'lucide-react';
import { openResumeSafe, downloadResumeSafe } from '@/lib/resume';

export default function FreshDumpPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewResume, setViewResume] = useState<any>(null);
  const [newResumeInput, setNewResumeInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const fetchFreshDump = async () => {
    try {
      let url = '/api/candidates?status=new';
      if (user?.role === 'application_support') {
        url = `/api/candidates?assignedSupportId=${user.id}`;
      }
      const res = await fetch(url);
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

  useEffect(() => {
    if (user) {
      fetchFreshDump();
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

  if (loading) return <div className="p-10 flex justify-center"><div className="spinner" style={{width: 40, height: 40}} /></div>;

  // Group candidates by Date
  const grouped = candidates.reduce((acc: any, c: any) => {
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
        {user?.role === 'application_support' && (
          <div className="px-3 py-1.5 bg-cyan-50 border border-cyan-200 text-cyan-800 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm">
            <UserCheck size={16} /> Support Workspace: {user.name}
          </div>
        )}
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
                  <div key={c.id} className="card p-5 border border-[var(--border)] flex flex-col hover:border-[#0077B6]/30 transition-all shadow-sm cursor-pointer" onClick={() => handleOpenModal(c)}>
                    <div className="flex gap-4 items-center mb-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl shrink-0">
                        {c.name[0]?.toUpperCase() || 'C'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-bold text-lg text-[var(--foreground)] truncate">{formatNA(c.name)}</h3>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${c.source === 'excel_upload' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                            {c.source === 'excel_upload' ? 'Excel' : 'Online'}
                          </span>
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
                          <a href={`mailto:${c.email}`} target="_blank" rel="noreferrer" title={`Email ${c.email}`} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                            <Mail size={13} />
                          </a>
                        )}
                        {c.phone && c.phone !== 'NA' && (
                          <a href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" title={`WhatsApp ${c.phone}`} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition">
                            <Phone size={13} />
                          </a>
                        )}
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
                <a href={`mailto:${viewResume.email}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition border border-blue-200 shadow-sm">
                  <Mail size={15} /> Email Candidate
                </a>
              ) : (
                <button disabled className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-400 rounded-lg text-xs font-bold cursor-not-allowed border border-gray-200">
                  <Mail size={15} /> Email (NA)
                </button>
              )}
              {viewResume.phone && viewResume.phone !== 'NA' ? (
                <a href={`https://wa.me/${viewResume.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition border border-emerald-200 shadow-sm">
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
    </div>
  );
}

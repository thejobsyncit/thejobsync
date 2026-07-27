"use client";
import { useState, useEffect } from "react";
import { Search, Trash2, Eye, Plus, X, Upload, FileText, Download } from "lucide-react";
import { openResumeSafe, downloadResumeSafe } from "@/lib/resume";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewResume, setViewResume] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", skills: "", experience: "", education: "", location: "", resumeUrl: "" });

  const fetchData = () => { fetch("/api/admin/candidates").then(r => r.json()).then(d => { setCandidates(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch("/api/admin/candidates", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchData();
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/candidates", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    fetchData();
  };

  const handleAdd = async () => {
    const res = await fetch("/api/admin/candidates/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, skills: `["${form.skills.split(",").map((s: string) => s.trim()).join('","')}"]` }),
    });
    if (res.ok) { setShowModal(false); setForm({ name: "", email: "", phone: "", skills: "", experience: "", education: "", location: "", resumeUrl: "" }); fetchData(); }
    else { const d = await res.json(); alert(d.message || "Error"); }
  };

  const filtered = candidates.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Candidates</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            <Plus size={16} /> Add Candidate
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Phone</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Location</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Resume</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">No candidates found</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-medium text-gray-800">{c.name}</td>
                <td className="p-4 text-sm text-gray-600">{c.email}</td>
                <td className="p-4 text-sm text-gray-600">{c.phone}</td>
                <td className="p-4 text-sm text-gray-600">{c.location}</td>
                <td className="p-4">
                  <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)} className="text-xs border rounded-lg p-1.5 bg-white">
                    <option value="new">New</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview_scheduled">Interview</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="p-4">
                  <button onClick={() => setViewResume(c)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                    <Eye size={14} /> View
                  </button>
                </td>
                <td className="p-4">
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Resume Modal */}
      {viewResume && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">Candidate Resume</h2>
              <button onClick={() => setViewResume(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>

            <div className="flex items-center gap-4 mb-6 pb-5 border-b">
              <div className="w-14 h-14 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-xl font-bold">
                {viewResume.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{viewResume.name}</h3>
                <p className="text-sm text-gray-500">{viewResume.currentRole ? `${viewResume.currentRole} at ${viewResume.currentCompany}` : 'Looking for opportunities'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-800">{viewResume.email}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="text-sm font-medium text-gray-800">{viewResume.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Experience</p>
                  <p className="text-sm font-medium text-gray-800">{viewResume.experience}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Education</p>
                  <p className="text-sm font-medium text-gray-800">{viewResume.education}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="text-sm font-medium text-gray-800">{viewResume.location}</p>
              </div>
              {viewResume.expectedSalary && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Expected Salary</p>
                  <p className="text-sm font-medium text-gray-800">{viewResume.expectedSalary}</p>
                </div>
              )}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {(() => { try { return JSON.parse(viewResume.skills); } catch { return [viewResume.skills]; } })().map((skill: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${viewResume.status === 'selected' ? 'bg-green-100 text-green-700' : viewResume.status === 'rejected' ? 'bg-red-100 text-red-700' : viewResume.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                  {viewResume.status}
                </span>
              </div>
            </div>

            {viewResume.resumeUrl && (
              <div className="mt-5 flex gap-2">
                <button onClick={(e) => openResumeSafe(viewResume.resumeUrl, e)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  <FileText size={16} /> Open Resume
                </button>
                <button onClick={(e) => downloadResumeSafe(viewResume.resumeUrl, `${viewResume.name || 'Candidate'}_Resume.pdf`, e)} className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition">
                  <Download size={16} /> Download PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add Candidate</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="p-2.5 border rounded-lg text-sm" />
                <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="p-2.5 border rounded-lg text-sm" />
              </div>
              <input placeholder="Skills (comma separated: React, Node.js)" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Experience (e.g. 3 years)" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} className="p-2.5 border rounded-lg text-sm" />
                <input placeholder="Education" value={form.education} onChange={e => setForm({...form, education: e.target.value})} className="p-2.5 border rounded-lg text-sm" />
              </div>
              <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Resume URL (paste link or upload later)</p>
                <input placeholder="https://drive.google.com/..." value={form.resumeUrl} onChange={e => setForm({...form, resumeUrl: e.target.value})} className="w-full p-2 border rounded-lg text-sm mt-2" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800">Add Candidate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { Search, Download, Eye } from "lucide-react";
import { openResumeSafe, downloadResumeSafe } from "@/lib/resume";

export default function ResumesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/candidates").then(r => r.json()).then(d => { setCandidates(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const filtered = candidates.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.skills?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Resumes</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by name or skill..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <p className="col-span-full text-center text-gray-400 py-8">No resumes found</p>
        ) : filtered.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{c.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{c.email}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'new' ? 'bg-blue-100 text-blue-700' : c.status === 'selected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {c.status}
              </span>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Experience:</span> {c.experience}</p>
              <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Location:</span> {c.location}</p>
              <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Skills:</span> {c.skills}</p>
            </div>
            {c.resumeUrl && (
              <div className="mt-3 flex items-center gap-3 pt-2 border-t border-gray-100">
                <button onClick={(e) => openResumeSafe(c.resumeUrl, e)} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                  <Eye size={13} /> Open
                </button>
                <button onClick={(e) => downloadResumeSafe(c.resumeUrl, `${c.name || 'Candidate'}_Resume.pdf`, e)} className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:underline">
                  <Download size={13} /> Download
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

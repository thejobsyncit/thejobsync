'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { PhoneOff, PhoneForwarded, PhoneCall, ThumbsUp, ThumbsDown, Mail, Phone, FileText, Briefcase, GraduationCap, Building2 } from 'lucide-react';

export default function HRPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignedCandidates = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/candidates?assignedHrId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        // Parse JSON fields
        const parsed = data.map((c: any) => {
          let ed = { degree: c.education || '', college: '', cgpa: '', year: '' };
          let ex = [{ company: '', role: c.experience || '', from: '', to: '' }];
          let sk = [];
          try { 
            if (c.education && c.education.startsWith('[')) ed = JSON.parse(c.education)[0] || ed; 
            else if (c.education && c.education.startsWith('{')) ed = JSON.parse(c.education); 
          } catch {}
          try { if (c.experience && c.experience.startsWith('[')) ex = JSON.parse(c.experience); } catch {}
          try { if (c.skills && c.skills.startsWith('[')) sk = JSON.parse(c.skills); } catch {}
          return { ...c, ed, ex, sk };
        });
        setCandidates(parsed);
      }
    } catch {
      toast.error('Failed to load assigned candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedCandidates();
  }, [user]);

  const handleAction = async (candidateId: string, status: string) => {
    try {
      const res = await fetch(`/api/candidates/${candidateId}/followups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hrId: user?.id, status })
      });
      if (res.ok) {
        toast.success(`Candidate marked as ${status}`);
        fetchAssignedCandidates();
      } else {
        toast.error('Failed to update candidate status');
      }
    } catch {
      toast.error('Error updating candidate');
    }
  };

  const openResume = (url: string | null | undefined, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!url) return;
    
    if (url.startsWith('data:')) {
      try {
        const arr = url.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/pdf';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      } catch (err) {
        console.error('Error opening resume', err);
        window.open(url, '_blank');
      }
    } else {
      window.open(url, '_blank');
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><div className="spinner" style={{width: 40, height: 40}} /></div>;

  return (
    <div>
      <div className="animate-fade-in mb-6">
        <h1 className="text-2xl font-bold">HR Dashboard</h1>
        <p className="text-[var(--muted-foreground)]">Manage and qualify your assigned candidates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
        {candidates.map(c => (
          <div key={c.id} className="card p-5 border border-[var(--border)] relative flex flex-col">
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className="badge badge-neutral text-xs">{c.status}</span>
            </div>

            {/* Header info */}
            <div className="flex gap-4 items-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl shrink-0">
                {c.name[0]}
              </div>
              <div>
                <h3 className="font-bold text-lg text-[var(--foreground)]">{c.name}</h3>
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-1 mb-1">{c.currentRole || 'Candidate'}</p>
                <div className="flex flex-col gap-0.5 text-xs text-[var(--muted-foreground)] font-medium">
                  <span className="flex items-center gap-1.5"><Phone size={12} /> {c.phone}</span>
                  <span className="flex items-center gap-1.5"><Mail size={12} /> {c.email}</span>
                </div>
              </div>
            </div>

            {/* Detailed info */}
            <div className="space-y-3 mb-5 flex-1">
              {c.ed?.degree && (
                <div className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                  <GraduationCap size={16} className="text-[#0077B6] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">{c.ed.degree}</div>
                    {(c.ed.college || c.ed.cgpa) && (
                      <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                        {c.ed.college} {c.ed.college && c.ed.cgpa ? '•' : ''} {c.ed.cgpa ? `${c.ed.cgpa} CGPA` : ''}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {c.ex?.[0] && (c.ex[0].company || c.ex[0].role) && (
                <div className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                  <Briefcase size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">{c.ex[0].role || 'Employee'}</div>
                    <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      {c.ex[0].company || c.currentCompany} 
                      {c.ex[0].from ? ` (${c.ex[0].from} - ${c.ex[0].to || 'Present'})` : ''}
                    </div>
                  </div>
                </div>
              )}

              {/* Skills */}
              {c.sk && c.sk.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {c.sk.slice(0, 4).map((skill: string) => (
                    <span key={skill} className="px-2 py-0.5 bg-[var(--surface-hover)] rounded-md text-xs border border-[var(--border)] text-[var(--muted-foreground)]">
                      {skill}
                    </span>
                  ))}
                  {c.sk.length > 4 && (
                    <span className="px-2 py-0.5 bg-indigo-50 rounded-md text-xs text-[#0077B6] font-medium border border-indigo-100">
                      +{c.sk.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions (Call/Mail/Resume) */}
            <div className="flex gap-2 py-3 border-t border-b border-[var(--border)] mb-4">
              <a href={`tel:${c.phone}`} className="flex-1 btn btn-secondary btn-sm flex items-center justify-center gap-1.5 hover:bg-green-50 hover:text-green-600">
                <Phone size={14} /> Call
              </a>
              <a href={`mailto:${c.email}`} className="flex-1 btn btn-secondary btn-sm flex items-center justify-center gap-1.5 hover:bg-blue-50 hover:text-blue-600">
                <Mail size={14} /> Mail
              </a>
              {c.resumeUrl ? (
                <button onClick={(e) => openResume(c.resumeUrl, e)} className="flex-1 btn btn-secondary btn-sm flex items-center justify-center gap-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100">
                  <FileText size={14} /> Resume
                </button>
              ) : (
                <button disabled className="flex-1 btn btn-secondary btn-sm flex items-center justify-center gap-1.5 opacity-50 cursor-not-allowed">
                  <FileText size={14} /> No Resume
                </button>
              )}
            </div>

            {/* HR Decision Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button onClick={() => handleAction(c.id, 'RNR')} className="btn-secondary btn-sm text-xs px-2 py-1 h-auto min-h-0" title="Ring No Response">
                <PhoneOff size={13} /> RNR
              </button>
              <button onClick={() => handleAction(c.id, 'Switch Off')} className="btn-secondary btn-sm text-xs px-2 py-1 h-auto min-h-0" title="Switch Off">
                <PhoneOff size={13} /> Switch Off
              </button>
              <button onClick={() => handleAction(c.id, 'Call Back')} className="btn-secondary btn-sm text-xs px-2 py-1 h-auto min-h-0" title="Call Back">
                <PhoneForwarded size={13} /> Call Back
              </button>
              <button onClick={() => handleAction(c.id, 'Interested')} className="btn-primary btn-sm bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2 py-1 h-auto min-h-0 w-full mt-1">
                <ThumbsUp size={13} /> Interested (Move to Interview)
              </button>
              <button onClick={() => handleAction(c.id, 'Not Interested')} className="btn-secondary btn-sm text-red-500 hover:bg-red-50 hover:border-red-200 text-xs px-2 py-1 h-auto min-h-0 w-full mt-1">
                <ThumbsDown size={13} /> Not Interested (Reject)
              </button>
            </div>

          </div>
        ))}

        {candidates.length === 0 && !loading && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-[var(--muted)] bg-white rounded-xl border border-[var(--border)] border-dashed">
            <Briefcase size={40} className="mb-4 opacity-20" />
            <p>No candidates assigned to you currently.</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEmployerAuth } from '@/context/EmployerAuthContext';
import {
  Building2, Briefcase, Users, Plus, LogOut,
  MapPin, Clock, X, Check, AlertCircle, Search, User, FileText, Download
} from 'lucide-react';
import { generateInvoicePdf } from '@/lib/generateInvoicePdf';
import { motion, AnimatePresence } from 'framer-motion';
import { DEPARTMENTS } from '@/lib/constants';

interface Job {
  id: string;
  title: string;
  field: string;
  location: string;
  jobType: string;
  salaryRange: string;
  experience: string;
  status: string;
  createdAt: string;
}

const FIELDS = DEPARTMENTS;

const INPUT_CLS = 'w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0077B6] transition-colors bg-white text-slate-900';

export default function EmployerDashboard() {
  const router = useRouter();
  const { employer, isLoading, logout } = useEmployerAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [showPostJob, setShowPostJob] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  const [newJob, setNewJob] = useState({
    title: '', description: '', skills: '', experience: '',
    location: '', salaryRange: '', jobType: 'full-time', field: '', openings: 1,
  });

  useEffect(() => {
    if (!isLoading && !employer) {
      router.push('/employer/login');
    }
  }, [employer, isLoading, router]);

  const fetchJobs = useCallback(async () => {
    setJobsLoading(true);
    try {
      const res = await fetch('/api/employer/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch { /* ignore */ }
    setJobsLoading(false);
  }, []);

  const handleDeleteJob = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this job?')) return;
    setDeletingJobId(id);
    try {
      const res = await fetch('/api/employer/jobs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchJobs();
        if (selectedJob?.id === id) setSelectedJob(null);
      } else {
        alert('Failed to delete job');
      }
    } catch (error) {
      alert('Error deleting job');
    }
    setDeletingJobId(null);
  };

  const handleFillOpening = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Mark 1 opening as filled? If this reaches 0, the job will be closed automatically.')) return;
    try {
      const res = await fetch(`/api/employer/jobs/${id}/fill`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchJobs();
      } else {
        alert('Failed to update openings');
      }
    } catch (error) {
      alert('Error updating openings');
    }
  };

  useEffect(() => {
    if (employer) fetchJobs();
  }, [employer, fetchJobs]);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    setPostError('');
    try {
      const res = await fetch('/api/employer/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newJob,
          skills: newJob.skills.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPostError(data.error || 'Failed to post job');
      } else {
        setPostSuccess(true);
        setNewJob({ title: '', description: '', skills: '', experience: '', location: '', salaryRange: '', jobType: 'full-time', field: '', openings: 1 });
        fetchJobs();
        setTimeout(() => { setShowPostJob(false); setPostSuccess(false); }, 1500);
      }
    } catch {
      setPostError('Network error. Please try again.');
    }
    setPosting(false);
  };

  const handleProfileOpen = async () => {
    setShowProfile(true);
    setInvoicesLoading(true);
    try {
      const res = await fetch('/api/employer/invoices');
      const data = await res.json();
      if (data.invoices) setInvoices(data.invoices);
    } catch (e) {
      console.error(e);
    } finally {
      setInvoicesLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/employer/login');
  };

  if (isLoading || !employer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0077B6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeJobs = jobs.filter((j) => j.status === 'active').length;
  const initials = employer.companyName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/loooo.jpeg" alt="The jobsync Logo" className="h-9 w-9 object-contain rounded-full border border-gray-200" />
            <div>
              <div className="font-extrabold text-slate-900 text-sm leading-none">The jobsync</div>
              <div className="text-[#03045E] text-[10px] font-semibold mt-0.5 uppercase tracking-wider">Employer Portal</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <span className="px-4 py-2 text-sm font-semibold text-[#03045E] bg-[#CAF0F8]/30 rounded-lg">Dashboard</span>
            <Link href="/employer/candidates" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#03045E] hover:bg-[#CAF0F8]/20 rounded-lg transition-colors flex items-center gap-1.5">
              <Search size={14} /> Candidates
            </Link>
            <button onClick={handleProfileOpen} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#03045E] hover:bg-[#CAF0F8]/20 rounded-lg transition-colors flex items-center gap-1.5">
              <User size={14} /> Profile
            </button>
          </nav>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Active Plan Banner */}
        {employer.subscriptions && employer.subscriptions.length > 0 ? (
          <div className="mb-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-5 md:p-6 shadow-lg text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">Active Plan</span>
                <h2 className="text-xl font-bold">{employer.subscriptions[0].planName}</h2>
              </div>
              <p className="text-blue-200 text-sm">
                Expires on {new Date(employer.subscriptions[0].expiresAt).toLocaleDateString()}
              </p>
            </div>
            
            {employer.subscriptions[0].planType === 'job_posting' && (
              <div className="bg-white/10 rounded-xl p-4 md:w-64">
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span>Job Posts Used</span>
                  <span>{employer.subscriptions[0].jobsUsed} / {employer.subscriptions[0].jobsAllowed}</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (employer.subscriptions[0].jobsUsed / employer.subscriptions[0].jobsAllowed) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {employer.subscriptions[0].planType === 'resdex' && (
              <div className="bg-white/10 rounded-xl p-4 md:w-64">
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span>Resume Views</span>
                  <span>{employer.subscriptions[0].resumeViewsUsed} / {employer.subscriptions[0].resumeViewsAllowed}</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (employer.subscriptions[0].resumeViewsUsed / employer.subscriptions[0].resumeViewsAllowed) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={18} className="text-amber-600" />
                <h2 className="text-lg font-bold text-amber-900">No Active Package</h2>
              </div>
              <p className="text-amber-700 text-sm">
                You need an active package to post jobs and search candidates.
              </p>
            </div>
            <Link 
              href="/pricing"
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm text-center"
            >
              Buy a Package
            </Link>
          </div>
        )}

        {/* Welcome */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {employer.contactPerson || employer.companyName} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">{employer.industry} · {employer.address}</p>
          </div>
          <button
            onClick={() => {
              const activeSub = employer.subscriptions?.find((s: any) => s.planType === 'job_posting');
              if (!activeSub) {
                alert('You need to purchase a Job Posting package first.');
                router.push('/pricing');
                return;
              }
              if (activeSub.jobsUsed >= activeSub.jobsAllowed) {
                alert('You have reached your job posting limit for the current package. Please buy a new package.');
                router.push('/pricing');
                return;
              }
              setShowPostJob(true); 
              setPostError(''); 
              setPostSuccess(false);
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:from-sky-600 hover:to-indigo-700 transition-all text-sm"
          >
            <Plus size={16} /> Post a Job
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-[#90E0EF]/30 flex items-center justify-center mb-3">
              <Briefcase size={18} className="text-[#03045E]" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{jobs.length}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Total Jobs Posted</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center mb-3">
              <Check size={18} className="text-green-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{activeJobs}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Active Listings</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center mb-3">
              <Building2 size={18} className="text-[#0077B6]" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{employer.industry.split(' ')[0]}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Industry</div>
          </div>
          <Link href="/employer/candidates" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm group hover:border-purple-300 transition-colors block">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
              <Users size={18} className="text-purple-600" />
            </div>
            <div className="text-xl font-extrabold text-purple-600 group-hover:underline">Search →</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Browse Candidates</div>
          </Link>
        </div>

        {/* Jobs List */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900">Posted Jobs</h2>
            <span className="text-xs font-bold text-slate-400">{jobs.length} total</span>
          </div>

          {jobsLoading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="w-7 h-7 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-16 text-center">
              <Briefcase size={40} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No jobs posted yet</p>
              <p className="text-slate-400 text-sm mt-1">Click &quot;Post a Job&quot; to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <div key={job.id} onClick={() => setSelectedJob(job)} className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4 cursor-pointer group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#03045E] transition-colors">{job.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin size={11} />{job.location}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-500"><Clock size={11} />{job.jobType}</span>
                      <span className="text-xs text-[#03045E] font-medium">{job.field}</span>
                      <span className="text-xs text-slate-400">{job.salaryRange}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-slate-400 whitespace-nowrap mt-1">
                      {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <button 
                      onClick={(e) => handleDeleteJob(job.id, e)}
                      disabled={deletingJobId === job.id}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                      title="Delete Job"
                    >
                      {deletingJobId === job.id ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"/> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedJob(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-extrabold text-slate-900">Job Details</h2>
                <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedJob.title}</h3>
                  <div className="flex gap-2 items-center mt-2 flex-wrap">
                    <span className="px-3 py-1 bg-[#90E0EF]/30 text-sky-700 rounded-full text-xs font-semibold">{selectedJob.field}</span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">{selectedJob.jobType}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedJob.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{selectedJob.status}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Location</div>
                    <div className="text-slate-900 font-medium flex items-center gap-2"><MapPin size={14} className="text-slate-400"/> {selectedJob.location}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Salary Range</div>
                    <div className="text-slate-900 font-medium">{selectedJob.salaryRange}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Openings</div>
                    <div className="text-2xl font-bold text-slate-900 mt-2">{(selectedJob as any).openings || 1}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Experience</div>
                    <div className="text-slate-900 font-medium">{selectedJob.experience}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Posted On</div>
                    <div className="text-slate-900 font-medium">{new Date(selectedJob.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Description</div>
                  <div className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {(selectedJob as any).description || 'No description provided.'}
                  </div>
                </div>

                {((selectedJob as any).skills && typeof (selectedJob as any).skills === 'string' && JSON.parse((selectedJob as any).skills).length > 0) && (
                  <div>
                    <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Skills Required</div>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse((selectedJob as any).skills).map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button onClick={() => setSelectedJob(null)} className="flex-1 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                    Close
                  </button>
                  {selectedJob.status === 'active' && ((selectedJob as any).openings > 0 || (selectedJob as any).openings === undefined) && (
                    <button 
                      onClick={(e) => handleFillOpening(selectedJob.id, e)} 
                      className="flex-1 py-3 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-100 transition-colors"
                    >
                      Mark 1 Opening Filled
                    </button>
                  )}
                  <button 
                    onClick={(e) => handleDeleteJob(selectedJob.id, e)} 
                    disabled={deletingJobId === selectedJob.id}
                    className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    {deletingJobId === selectedJob.id ? 'Deleting...' : 'Delete Job'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Job Modal */}
      <AnimatePresence>
        {showPostJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowPostJob(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-extrabold text-slate-900">Post a New Job</h2>
                <button onClick={() => setShowPostJob(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {postSuccess ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Job Posted!</h3>
                  <p className="text-slate-500">Your job is now live on the careers page.</p>
                </div>
              ) : (
                <form onSubmit={handlePostJob} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Job Title *</label>
                      <input type="text" required placeholder="e.g. Senior React Developer"
                        value={newJob.title} onChange={(e) => setNewJob(p => ({ ...p, title: e.target.value }))}
                        className={INPUT_CLS} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Field / Domain *</label>
                      <select required value={newJob.field} onChange={(e) => setNewJob(p => ({ ...p, field: e.target.value }))}
                        className={INPUT_CLS}>
                        <option value="">Select field</option>
                        {FIELDS.map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Job Description *</label>
                      <textarea required rows={4} placeholder="Describe the role, responsibilities and requirements..."
                        value={newJob.description} onChange={(e) => setNewJob(p => ({ ...p, description: e.target.value }))}
                        className={`${INPUT_CLS} resize-none`} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Number of Openings *</label>
                      <input type="number" min="1" required placeholder="e.g. 5"
                        value={newJob.openings} onChange={(e) => setNewJob(p => ({ ...p, openings: parseInt(e.target.value) || 1 }))}
                        className={INPUT_CLS} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Skills Required (comma-separated)</label>
                    <input type="text" placeholder="React, Node.js, AWS, Python..."
                      value={newJob.skills} onChange={(e) => setNewJob(p => ({ ...p, skills: e.target.value }))}
                      className={INPUT_CLS} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Location *</label>
                      <input type="text" required placeholder="Chennai, Remote..."
                        value={newJob.location} onChange={(e) => setNewJob(p => ({ ...p, location: e.target.value }))}
                        className={INPUT_CLS} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Experience</label>
                      <input type="text" placeholder="2-4 years"
                        value={newJob.experience} onChange={(e) => setNewJob(p => ({ ...p, experience: e.target.value }))}
                        className={INPUT_CLS} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Salary Range</label>
                      <input type="text" placeholder="₹8L - ₹12L"
                        value={newJob.salaryRange} onChange={(e) => setNewJob(p => ({ ...p, salaryRange: e.target.value }))}
                        className={INPUT_CLS} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Job Type</label>
                    <div className="flex gap-2 flex-wrap">
                      {['full-time', 'part-time', 'contract', 'internship'].map((t) => (
                        <button type="button" key={t}
                          onClick={() => setNewJob(p => ({ ...p, jobType: t }))}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                            newJob.jobType === t
                              ? 'bg-[#0077B6] text-white border-[#0077B6]'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'
                          }`}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {postError && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                      <AlertCircle size={16} /> {postError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowPostJob(false)}
                      className="flex-1 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={posting}
                      className="flex-1 py-3 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white font-bold rounded-xl shadow-md hover:from-sky-600 hover:to-indigo-700 transition-all disabled:opacity-60">
                      {posting ? 'Posting...' : 'Post Job →'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile & Invoices Side Panel */}
      <AnimatePresence>
        {showProfile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
              onClick={() => setShowProfile(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Building2 size={24} className="text-[#0077B6]" /> Company Profile
                </h2>
                <button
                  onClick={() => setShowProfile(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md">
                    {initials}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{employer.companyName}</h3>
                  <p className="text-slate-500 mb-6">{employer.industry}</p>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Person</div>
                      <div className="font-semibold text-slate-800">{employer.contactPerson}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</div>
                      <div className="font-semibold text-slate-800">{employer.email}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">GST Number</div>
                      <div className="font-semibold text-slate-800">{employer.gstNumber}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Address</div>
                      <div className="font-semibold text-slate-800">{employer.address}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <FileText size={20} className="text-[#0077B6]" /> Payment History
                  </h4>
                  
                  {invoicesLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-6 h-6 border-2 border-[#0077B6] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : invoices.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-500 font-medium">No payments yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {invoices.map((inv) => (
                        <div key={inv.id} className="p-4 rounded-xl border border-slate-200 hover:border-[#0077B6]/30 transition-colors bg-white shadow-sm flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-800 text-sm mb-0.5">{inv.packageName}</div>
                            <div className="text-xs text-slate-500">{new Date(inv.paidAt).toLocaleDateString()}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="font-bold text-slate-900">₹{inv.totalAmount}</div>
                            <button
                              onClick={() => generateInvoicePdf(inv)}
                              className="p-2 text-[#0077B6] bg-[#0077B6]/10 hover:bg-[#0077B6]/20 rounded-lg transition-colors"
                              title="Download Invoice"
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

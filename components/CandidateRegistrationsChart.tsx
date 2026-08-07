'use client';

import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Loader2, Mail, Phone, MapPin, User, Calendar, ShieldAlert, Download, MessageSquare, CheckSquare, X, Send, CheckCircle, Check } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export default function CandidateRegistrationsChart() {
  const [data, setData] = useState<{ date: string; count: number }[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [profileModal, setProfileModal] = useState<any | null>(null);
  const [bulkAction, setBulkAction] = useState<'email' | 'whatsapp' | null>(null);
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/admin/candidate-registrations')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then(d => {
        setData(d.chartData);
        setCandidates(d.candidates);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const exportToExcel = () => {
    try {
      const exportData = candidates.map(c => ({
        Name: c.name || 'Unknown',
        Email: c.email || '',
        Phone: c.phone || '',
        Location: c.location ? (c.location.startsWith('{') ? JSON.parse(c.location).city || '' : c.location) : '',
        Verified: c.isVerified ? 'Yes' : 'No',
        'Registered On': new Date(c.createdAt).toLocaleDateString()
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Candidates');
      XLSX.writeFile(wb, 'Registered_Candidates.xlsx');
      toast.success('Exported successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export Excel.');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCandidates(candidates.map(c => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCandidates(prev => 
      prev.includes(id) ? prev.filter(candId => candId !== id) : [...prev, id]
    );
  };

  const submitBulkAction = async () => {
    if (!message) return toast.error('Message cannot be empty');
    if (bulkAction === 'email' && !subject) return toast.error('Subject is required');
    
    setSending(true);
    try {
      const selectedData = candidates.filter(c => selectedCandidates.includes(c.id));
      
      if (bulkAction === 'email') {
        const emails = selectedData.map(c => c.email).filter(Boolean);
        const res = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toEmail: emails, subject, message })
        });
        if (!res.ok) throw new Error('Email sending failed');
        toast.success(`Emails sent to ${emails.length} candidates`);
      } else if (bulkAction === 'whatsapp') {
        let sentCount = 0;
        for (const c of selectedData) {
          if (c.phone) {
            const res = await fetch('/api/whatsapp/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phone: c.phone, message })
            });
            if (res.ok) sentCount++;
          }
        }
        toast.success(`WhatsApp messages sent to ${sentCount} candidates`);
      }
      setBulkAction(null);
      setSubject('');
      setMessage('');
      setSelectedCandidates([]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send messages');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200">
        <p className="text-red-500">Error loading chart: {error}</p>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">Candidate Registrations (Last 30 Days)</h2>
          <p className="text-sm text-slate-500">Total new candidates: <span className="font-semibold text-blue-600">{total}</span></p>
        </div>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(val) => {
                  const date = new Date(val);
                  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
                }}
                minTickGap={20}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(val) => new Date(val).toLocaleDateString()}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              Recent Candidate Details
            </h2>
            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              {candidates.length} Registered
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {selectedCandidates.length > 0 && (
              <>
                <button 
                  onClick={() => setBulkAction('email')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg shadow-sm transition-all"
                >
                  <Mail size={16} /> Bulk Email
                </button>
                <button 
                  onClick={() => setBulkAction('whatsapp')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <MessageSquare size={16} /> Bulk WhatsApp
                </button>
              </>
            )}
            <button 
              onClick={exportToExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              <Download size={16} /> Export Excel
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold border-b border-slate-100 w-10">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={candidates.length > 0 && selectedCandidates.length === candidates.length}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-4 font-semibold border-b border-slate-100">Candidate Info</th>
                <th className="p-4 font-semibold border-b border-slate-100">Location</th>
                <th className="p-4 font-semibold border-b border-slate-100">Password Hash</th>
                <th className="p-4 font-semibold border-b border-slate-100">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No candidates registered in the last 30 days.
                  </td>
                </tr>
              ) : (
                candidates.map((c, i) => (
                  <tr 
                    key={c.id || i} 
                    onClick={() => setProfileModal(c)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedCandidates.includes(c.id)}
                        onChange={(e) => toggleSelect(c.id, e as any)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-2">
                        {c.name || 'Unknown'}
                        {c.isVerified && <span className="w-2 h-2 rounded-full bg-green-500" title="Verified"></span>}
                      </div>
                      <div className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                        <Mail size={12} /> {c.email}
                      </div>
                      <div className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                        <Phone size={12} /> {c.phone}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {(() => {
                        if (!c.location) return <span className="text-slate-400 italic">Not specified</span>;
                        try {
                          if (c.location.startsWith('{')) {
                            const loc = JSON.parse(c.location);
                            const parts = [loc.city, loc.district, loc.state].filter(Boolean);
                            return <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-400"/> {parts.join(', ')}</span>;
                          }
                          return <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-400"/> {c.location}</span>;
                        } catch (e) {
                          return <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-400"/> {c.location}</span>;
                        }
                      })()}
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded truncate max-w-[150px]" title="Password Hidden">
                        <ShieldAlert size={12} className="inline mr-1 text-slate-400" />
                        {c.password && c.password.length > 2 
                          ? `${c.password[0]}${'*'.repeat(c.password.length - 2)}${c.password[c.password.length - 1]}`
                          : c.password}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal */}
      {profileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Candidate Profile</h3>
              <button onClick={() => setProfileModal(null)} className="text-slate-500 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[400px]">
              {/* Left Column: Details */}
              <div className="w-full md:w-1/3 p-6 overflow-y-auto border-r border-slate-100 space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-slate-800">{profileModal.name || 'Unknown'}</h4>
                  <p className="text-sm text-slate-500 mt-1">{profileModal.headline || 'No headline provided'}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={16} className="text-slate-400" />
                    <span className="text-sm">{profileModal.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    <span className="text-sm">{profileModal.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={16} className="text-slate-400" />
                    <span className="text-sm">
                      {profileModal.location 
                        ? (profileModal.location.startsWith('{') ? (() => { try { return JSON.parse(profileModal.location).city; } catch { return profileModal.location; } })() : profileModal.location) 
                        : 'Not specified'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 font-semibold mb-2">Status</p>
                  {profileModal.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      <CheckCircle size={14}/> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                      Pending Verification
                    </span>
                  )}
                </div>

                {profileModal.skills && profileModal.skills !== '[]' && (
                  <div>
                    <p className="text-sm text-slate-500 font-semibold mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        try {
                          return JSON.parse(profileModal.skills).map((s: string, idx: number) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium">
                              {s}
                            </span>
                          ));
                        } catch {
                          return <span className="text-sm text-slate-600">{profileModal.skills}</span>;
                        }
                      })()}
                    </div>
                  </div>
                )}
                
                {profileModal.experience && profileModal.experience !== '[]' && (
                  <div>
                    <p className="text-sm text-slate-500 font-semibold mb-2">Experience</p>
                    <div className="space-y-3">
                      {(() => {
                        try {
                          const expList = JSON.parse(profileModal.experience);
                          if (Array.isArray(expList)) {
                            return expList.map((exp, idx) => (
                              <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <p className="font-semibold text-slate-800 text-sm">{exp.role || 'Role'}</p>
                                <p className="text-slate-600 text-xs">{exp.company || 'Company'}</p>
                                {(exp.from || exp.to) && (
                                  <p className="text-slate-400 text-xs mt-1">
                                    {exp.from || ''} {exp.from && exp.to ? '-' : ''} {exp.to || ''}
                                  </p>
                                )}
                              </div>
                            ));
                          }
                          return <p className="text-sm text-slate-700">{profileModal.experience}</p>;
                        } catch {
                          return <p className="text-sm text-slate-700">{profileModal.experience}</p>;
                        }
                      })()}
                    </div>
                  </div>
                )}
                
                {profileModal.education && profileModal.education !== '[]' && (
                  <div>
                    <p className="text-sm text-slate-500 font-semibold mb-2">Education</p>
                    <div className="space-y-3">
                      {(() => {
                        try {
                          const eduList = JSON.parse(profileModal.education);
                          if (Array.isArray(eduList)) {
                            return eduList.map((edu, idx) => (
                              <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <p className="font-semibold text-slate-800 text-sm">{edu.degree || 'Degree'}</p>
                                <p className="text-slate-600 text-xs">{edu.college || 'College'}</p>
                                <div className="flex gap-3 text-slate-400 text-xs mt-1">
                                  {edu.year && <span>Class of {edu.year}</span>}
                                  {edu.cgpa && <span>• CGPA: {edu.cgpa}</span>}
                                </div>
                              </div>
                            ));
                          }
                          return <p className="text-sm text-slate-700">{profileModal.education}</p>;
                        } catch {
                          return <p className="text-sm text-slate-700">{profileModal.education}</p>;
                        }
                      })()}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column: Resume Iframe */}
              <div className="w-full md:w-2/3 bg-slate-100 flex flex-col relative h-[500px] md:h-auto">
                {profileModal.resumeUrl ? (
                  <iframe 
                    src={profileModal.resumeUrl} 
                    className="w-full h-full border-0"
                    title={`${profileModal.name}'s Resume`}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 min-h-[400px]">
                    <User size={48} className="mb-4 text-slate-300" />
                    <p className="font-medium text-slate-500">No Resume Uploaded</p>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Bulk Action Modal */}
      {bulkAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                Send {bulkAction === 'email' ? 'Bulk Email' : 'Bulk WhatsApp'}
              </h3>
              <button onClick={() => {
                setBulkAction(null);
                setSubject('');
                setMessage('');
              }} className="text-slate-500 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 bg-blue-50 text-blue-800 p-2 rounded">
                Sending to <strong>{selectedCandidates.length}</strong> selected candidate(s).
              </p>
              
              {bulkAction === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Message subject..."
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Type your message here..."
                ></textarea>
              </div>
              
              <button 
                onClick={submitBulkAction}
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

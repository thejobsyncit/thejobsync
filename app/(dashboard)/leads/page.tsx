'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Building2, CheckCircle2, TrendingUp, CheckSquare, Clock } from 'lucide-react';
import type { CompanyLead } from '@/lib/types';

export default function LeadsAdminDashboard() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<CompanyLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (leadId: string) => {
    if (!confirm('Mark this lead as Verified? It will be promoted as a confirmed client.')) return;
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'verified' }),
      });
      if (res.ok) fetchLeads();
      else alert('Failed to verify lead');
    } catch { alert('Error verifying lead'); }
  };

  // --- STAFF PERFORMANCE TRACKER LOGIC ---

  // 1. Extract unique staff members from the leads
  const staffMembers = useMemo(() => {
    const staffMap = new Map<string, { id: string, name: string, role: string }>();
    leads.forEach(lead => {
      if (lead.dmsId && lead.dms?.name) {
        staffMap.set(lead.dmsId, { id: lead.dmsId, name: lead.dms.name, role: 'DMS' });
      }
      if (lead.coordinatorId && lead.coordinator?.name) {
        staffMap.set(lead.coordinatorId, { id: lead.coordinatorId, name: lead.coordinator.name, role: 'Coordinator' });
      }
    });
    return Array.from(staffMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [leads]);

  // 2. Calculate stats based on selected staff member
  const stats = useMemo(() => {
    if (selectedStaffId === 'all') return null;
    
    const dmsAdded = leads.filter(l => l.dmsId === selectedStaffId);
    const coordinatorAssigned = leads.filter(l => l.coordinatorId === selectedStaffId);
    
    // Daily Breakdown Logic for DMS (Added)
    const dailyAdded: Record<string, number> = {};
    dmsAdded.forEach(l => {
      const d = new Date(l.createdAt);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      dailyAdded[dateKey] = (dailyAdded[dateKey] || 0) + 1;
    });

    // Daily Breakdown Logic for Coordinator (Attended/Updated)
    const dailyAttended: Record<string, number> = {};
    coordinatorAssigned.filter(l => l.status !== 'fresh').forEach(l => {
      const d = new Date(l.updatedAt); 
      const dateKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      dailyAttended[dateKey] = (dailyAttended[dateKey] || 0) + 1;
    });

    return {
      added: dmsAdded.length,
      attended: coordinatorAssigned.filter(l => l.status !== 'fresh').length,
      pending: coordinatorAssigned.filter(l => l.status === 'fresh').length,
      role: staffMembers.find(s => s.id === selectedStaffId)?.role,
      dailyAdded,
      dailyAttended
    };
  }, [leads, selectedStaffId, staffMembers]);

  // 3. Filter leads for the table below based on selection
  const filteredLeads = useMemo(() => {
    if (selectedStaffId === 'all') return leads;
    return leads.filter(l => l.dmsId === selectedStaffId || l.coordinatorId === selectedStaffId);
  }, [leads, selectedStaffId]);

  // ----------------------------------------

  // Group filtered leads by date
  const groupedLeads = useMemo(() => {
    const groups: Record<string, CompanyLead[]> = {};
    filteredLeads.forEach(lead => {
      const d = new Date(lead.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(lead);
    });
    return groups;
  }, [filteredLeads]);

  const getDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const sortedDateKeys = useMemo(() => Object.keys(groupedLeads).sort((a,b) => new Date(b).getTime() - new Date(a).getTime()), [groupedLeads]);

  if (!user || !['super_admin', 'admin'].includes(user.role)) {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Consolidated Leads (DMS & Coordinator)</h1>
        <p className="text-[var(--muted-foreground)]">Track daily additions, verify updates, and monitor staff performance</p>
      </div>

      {/* --- STAFF PERFORMANCE DASHBOARD --- */}
      <div className="mb-10 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              Staff Performance Tracker
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">Select a DMS or Coordinator to view their activity</p>
          </div>
          <select 
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-[var(--primary)] outline-none min-w-[250px] shadow-sm cursor-pointer"
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
          >
            <option value="all">Everyone (All Leads)</option>
            <optgroup label="Staff Members">
              {staffMembers.map(staff => (
                <option key={staff.id} value={staff.id}>{staff.name} ({staff.role})</option>
              ))}
            </optgroup>
          </select>
        </div>
        
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-[var(--border)] shadow-sm flex flex-col relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 text-blue-50 dark:text-blue-900/20 group-hover:scale-110 transition-transform">
                  <Building2 size={100} />
                </div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Total Leads Added</div>
                <div className="text-4xl font-extrabold text-blue-600 relative z-10">{stats.added}</div>
                <div className="text-xs text-slate-500 mt-auto pt-4 relative z-10">Profiles pushed by this user (DMS)</div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-[var(--border)] shadow-sm flex flex-col relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 text-emerald-50 dark:text-emerald-900/20 group-hover:scale-110 transition-transform">
                  <CheckSquare size={100} />
                </div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Profiles Attended</div>
                <div className="text-4xl font-extrabold text-emerald-600 relative z-10">{stats.attended}</div>
                <div className="text-xs text-slate-500 mt-auto pt-4 relative z-10">Leads contacted/updated (Coordinator)</div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-[var(--border)] shadow-sm flex flex-col relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 text-orange-50 dark:text-orange-900/20 group-hover:scale-110 transition-transform">
                  <Clock size={100} />
                </div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Profiles Pending</div>
                <div className="text-4xl font-extrabold text-orange-500 relative z-10">{stats.pending}</div>
                <div className="text-xs text-slate-500 mt-auto pt-4 relative z-10">Leads not yet touched (Coordinator)</div>
              </div>
            </div>
            
            {/* Daily Breakdown Section */}
            <div className="mt-6 bg-white dark:bg-slate-900 p-5 rounded-xl border border-[var(--border)] shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                📅 Daily Performance Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Leads Added per Day</h4>
                  {stats && Object.keys(stats.dailyAdded).length > 0 ? (
                    <ul className="space-y-2">
                      {Object.entries(stats.dailyAdded)
                        .sort((a,b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                        .map(([date, count]) => (
                        <li key={date} className="flex justify-between items-center text-sm p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{getDateLabel(date)}</span>
                          <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-md text-xs">{count} profiles</span>
                        </li>
                      ))}
                    </ul>
                  ) : <span className="text-sm text-slate-400 italic">No daily data available.</span>}
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Leads Attended per Day</h4>
                  {stats && Object.keys(stats.dailyAttended).length > 0 ? (
                    <ul className="space-y-2">
                      {Object.entries(stats.dailyAttended)
                        .sort((a,b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                        .map(([date, count]) => (
                        <li key={date} className="flex justify-between items-center text-sm p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{getDateLabel(date)}</span>
                          <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-md text-xs">{count} profiles</span>
                        </li>
                      ))}
                    </ul>
                  ) : <span className="text-sm text-slate-400 italic">No daily data available.</span>}
                </div>
              </div>
            </div>
          </>
        )}

        {!stats && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center shadow-sm">
            <p className="text-slate-500 font-medium">Select a staff member from the dropdown above to view their performance stats.</p>
          </div>
        )}
      </div>
      {/* -------------------------------------- */}


      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[var(--primary)]" size={32} /></div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-[var(--border)]">
          <Building2 size={48} className="mx-auto text-[var(--muted-foreground)] mb-4 opacity-50" />
          <h3 className="text-lg font-bold mb-2">No leads found</h3>
          <p className="text-[var(--muted-foreground)]">There are no leads matching the current selection.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {sortedDateKeys.map(dateKey => (
            <div key={dateKey}>
              {/* Date group header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-[#03045E] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                  <span>📅 {getDateLabel(dateKey)}</span>
                </div>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {groupedLeads[dateKey].length} lead{groupedLeads[dateKey].length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-[var(--border)] overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--sidebar-bg)]">
                      <th className="p-4 font-semibold text-sm">Company Name</th>
                      <th className="p-4 font-semibold text-sm">Status</th>
                      <th className="p-4 font-semibold text-sm">Added By (DMS)</th>
                      <th className="p-4 font-semibold text-sm">Handled By (Coordinator)</th>
                      <th className="p-4 font-semibold text-sm">Contact Info</th>
                      <th className="p-4 font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedLeads[dateKey].map(lead => (
                      <tr key={lead.id} className={`border-b border-[var(--border)] last:border-0 transition-colors ${lead.status === 'verified' ? 'bg-emerald-50/30 hover:bg-emerald-50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        <td className="p-4">
                          <div className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                            {lead.companyName}
                            {lead.status === 'verified' && <span className="text-xs text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">✅ Verified</span>}
                          </div>
                          {lead.contactPerson && <div className="text-xs text-[var(--muted-foreground)] mt-1">{lead.contactPerson} ({lead.position})</div>}
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
                            lead.status === 'fresh' ? 'bg-purple-100 text-purple-700' :
                            lead.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                            lead.status === 'interested' || lead.status === 'updated' ? 'bg-green-100 text-green-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>{lead.status.replace('_', ' ')}</span>
                          {lead.remark && <div className="text-xs text-[var(--muted-foreground)] mt-1 truncate max-w-[150px]" title={lead.remark}>{lead.remark}</div>}
                        </td>
                        <td className="p-4 font-medium text-sm text-[var(--primary)]">{lead.dms?.name || 'Unknown'}</td>
                        <td className="p-4 font-medium text-sm text-[var(--primary)]">{lead.coordinator?.name || 'Unassigned'}</td>
                        <td className="p-4 text-[var(--muted-foreground)] text-xs">
                          <div>{lead.phone || '-'}</div>
                          <div>{lead.email || '-'}</div>
                        </td>
                        <td className="p-4">
                          {user?.role === 'super_admin' && lead.status !== 'verified' && (
                            <button
                              onClick={() => handleVerify(lead.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors border border-emerald-200"
                            >
                              <CheckCircle2 size={14} /> Verify
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

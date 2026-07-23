'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PhoneCall, Loader2, CheckCircle2, PhoneOff, PhoneMissed, CalendarClock, XCircle, Trash2 } from 'lucide-react';
import type { CompanyLead } from '@/lib/types';

const STATUS_ACTIONS = [
  { value: 'rnr', label: 'RNR', icon: <PhoneMissed size={16} />, color: 'bg-orange-100 text-orange-700' },
  { value: 'switch_off', label: 'Switch Off', icon: <PhoneOff size={16} />, color: 'bg-red-100 text-red-700' },
  { value: 'call_back', label: 'Call Back', icon: <CalendarClock size={16} />, color: 'bg-blue-100 text-blue-700' },
  { value: 'not_interested', label: 'Not Interested', icon: <XCircle size={16} />, color: 'bg-slate-100 text-slate-700' },
  { value: 'interested', label: 'Interested', icon: <CheckCircle2 size={16} />, color: 'bg-green-100 text-green-700' },
];

export default function CoordinatorDashboard() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<CompanyLead[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [activeLead, setActiveLead] = useState<CompanyLead | null>(null);
  const [formData, setFormData] = useState<Partial<CompanyLead>>({});
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

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

  const handleQuickStatus = async (leadId: string, status: string) => {
    if (status === 'interested') {
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        setActiveLead(lead);
        setFormData({
          companyName: lead.companyName,
          email: lead.email || '',
          phone: lead.phone || '',
          contactPerson: lead.contactPerson || '',
          position: lead.position || '',
          website: lead.website || '',
          address: lead.address || '',
          requirementDetails: lead.requirementDetails || '',
          validityTime: lead.validityTime || '',
          remark: lead.remark || '',
          status: 'interested'
        });
        setShowUpdateForm(true);
      }
      return;
    }

    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;
    try {
      setSubmitting(true);
      const res = await fetch(`/api/leads/${activeLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowUpdateForm(false);
        setActiveLead(null);
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(leadId => leadId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeads(leads.map(l => l.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedLeads.length === 0 || !confirm(`Are you sure you want to delete ${selectedLeads.length} selected leads?`)) return;
    
    try {
      setDeleting(true);
      const res = await fetch('/api/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds: selectedLeads })
      });
      if (res.ok) {
        setSelectedLeads([]);
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (!user || !['super_admin', 'admin', 'coordinator'].includes(user.role)) {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fresh Leads (Coordinator)</h1>
          <p className="text-[var(--muted-foreground)]">Your assigned calling list</p>
        </div>
        
        {leads.length > 0 && (
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-[var(--border)] px-4 py-2 rounded-xl shadow-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={selectedLeads.length === leads.length && leads.length > 0} onChange={handleSelectAll} />
              <span className="text-sm font-semibold">Select All</span>
            </label>
            {selectedLeads.length > 0 && (
              <div className="flex items-center gap-3 border-l pl-4 border-[var(--border)]">
                <span className="text-sm font-semibold text-blue-600">{selectedLeads.length} Selected</span>
                <button onClick={handleDeleteSelected} disabled={deleting} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-red-100 text-red-700 hover:opacity-80 transition-colors">
                  {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showUpdateForm && activeLead && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative my-8 border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Update Interested Client</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Company Name *</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" value={formData.companyName || ''} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Contact Person *</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" value={formData.contactPerson || ''} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Position</label>
                  <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" value={formData.position || ''} onChange={e => setFormData({...formData, position: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Email ID</label>
                  <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Phone No</label>
                  <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Website</label>
                  <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Company Address</label>
                <textarea className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-y" rows={2} value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Requirement Details</label>
                <textarea className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-y" rows={3} value={formData.requirementDetails || ''} onChange={e => setFormData({...formData, requirementDetails: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Validity Time</label>
                  <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" value={formData.validityTime || ''} onChange={e => setFormData({...formData, validityTime: e.target.value})} placeholder="e.g. 3 Months" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Status</label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}>
                    <option value="interested">Interested</option>
                    <option value="updated">Updated (Confirmed)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Remark</label>
                <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" value={formData.remark || ''} onChange={e => setFormData({...formData, remark: e.target.value})} />
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => setShowUpdateForm(false)}>Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-[#03045E] hover:bg-[#172554] text-white flex items-center justify-center gap-2 shadow-lg transition-all min-w-[140px]" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Save Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[var(--primary)]" size={32} /></div>
      ) : leads.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-[var(--border)]">
          <PhoneCall size={48} className="mx-auto text-[var(--muted-foreground)] mb-4 opacity-50" />
          <h3 className="text-lg font-bold mb-2">No fresh leads</h3>
          <p className="text-[var(--muted-foreground)]">You have no assigned company dumps right now.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {leads.map(lead => (
            <div key={lead.id} className={`bg-white dark:bg-slate-900 rounded-xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-colors ${selectedLeads.includes(lead.id) ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-[var(--border)]'}`}>
              <div className="flex items-start gap-4 flex-1">
                <div className="pt-1">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" checked={selectedLeads.includes(lead.id)} onChange={() => handleSelect(lead.id)} />
                </div>
                <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg">{lead.companyName}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                    lead.status === 'fresh' ? 'bg-purple-100 text-purple-700' :
                    lead.status === 'interested' || lead.status === 'updated' ? 'bg-green-100 text-green-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{lead.status.replace('_', ' ')}</span>
                </div>
                <div className="text-sm text-[var(--muted-foreground)] flex items-center gap-4">
                  <span>Phone: {lead.phone || 'N/A'}</span>
                  <span>Email: {lead.email || 'N/A'}</span>
                  {lead.dms?.name && <span>(Added by {lead.dms.name})</span>}
                </div>
                {lead.remark && <div className="text-sm mt-2 font-medium">Remark: {lead.remark}</div>}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {STATUS_ACTIONS.map(action => (
                  <button
                    key={action.value}
                    onClick={() => handleQuickStatus(lead.id, action.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${action.color} hover:opacity-80`}
                  >
                    {action.icon} {action.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

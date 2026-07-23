'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, Building2, Mail, Phone, Calendar, Loader2, Upload, Download, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CompanyLead } from '@/lib/types';
import { read, utils, writeFile } from 'xlsx';

export default function DMSDashboard() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<CompanyLead[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ companyName: '', email: '', phone: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;
    const lowerQuery = searchQuery.toLowerCase();
    return leads.filter(l => 
      l.companyName?.toLowerCase().includes(lowerQuery) || 
      l.email?.toLowerCase().includes(lowerQuery) || 
      l.phone?.toLowerCase().includes(lowerQuery) ||
      l.coordinator?.name?.toLowerCase().includes(lowerQuery)
    );
  }, [leads, searchQuery]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = useMemo(() => {
    return filteredLeads.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filteredLeads, currentPage]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ companyName: '', email: '', phone: '', address: '' });
        setShowForm(false);
        fetchLeads();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add client');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = event.target?.result;
        if (data) {
          const workbook = read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json: any[] = utils.sheet_to_json(worksheet, { defval: '' });

          const leads = json.map(row => {
            let companyName = '';
            let email = '';
            let phone = '';
            let address = '';

            for (const key of Object.keys(row)) {
              const val = row[key];
              if (val === undefined || val === null || val === '') continue;
              
              const normalizedKey = String(key).toLowerCase().replace(/[^a-z0-9]/g, '');
              
              if (!companyName && (normalizedKey.includes('company') || normalizedKey.includes('client') || normalizedKey.includes('organization') || normalizedKey.includes('business') || normalizedKey.includes('firm') || normalizedKey === 'name')) {
                companyName = String(val);
              }
              else if (!email && (normalizedKey.includes('email') || normalizedKey.includes('mail'))) {
                email = String(val);
              }
              else if (!phone && (normalizedKey.includes('phone') || normalizedKey.includes('mobile') || normalizedKey.includes('contact') || normalizedKey.includes('number') || normalizedKey.includes('cell'))) {
                phone = String(val);
              }
              else if (!address && (normalizedKey.includes('address') || normalizedKey.includes('location') || normalizedKey.includes('city') || normalizedKey.includes('hq'))) {
                address = String(val);
              }
            }

            return { companyName: companyName.trim(), email: email.trim(), phone: phone.trim(), address: address.trim() };
          }).filter(lead => lead.companyName !== '');

          if (leads.length === 0) {
            alert('No valid company names found in the file. Ensure you have a "Company Name" column.');
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
          }

          const res = await fetch('/api/leads/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leads })
          });

          if (res.ok) {
            const resultData = await res.json();
            alert(resultData.message || `Successfully uploaded leads!`);
            fetchLeads();
          } else {
            const err = await res.json();
            alert(`Failed to upload: ${err.error}`);
          }
        }
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
      alert('Error reading file');
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const ws = utils.json_to_sheet([{
      'Company Name': 'Acme Corp',
      'Email ID': 'contact@acme.com',
      'Phone No': '9876543210',
      'Address': '123 Business Avenue, Tech City'
    }]);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Leads");
    writeFile(wb, "Leads_Template.xlsx");
  };

  const handleSelect = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(leadId => leadId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeads(filteredLeads.map(l => l.id));
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

  if (!user || !['super_admin', 'admin', 'dms'].includes(user.role)) {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Company Client (DMS)</h1>
          <p className="text-[var(--muted-foreground)] mb-4">Add fresh company dumps to distribute to coordinators</p>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by company, email, phone or coordinator..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
        <div className="flex gap-3">
          {selectedLeads.length > 0 && (
            <button onClick={handleDeleteSelected} disabled={deleting} className="btn bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
              {deleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />} Delete ({selectedLeads.length})
            </button>
          )}
          <button className="btn btn-ghost" onClick={downloadTemplate} title="Download Excel Template">
            <Download size={18} /> Template
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            style={{ display: 'none' }}
          />
          <button 
            className="btn btn-outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            Upload Excel
          </button>
          
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} /> Add Client
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-8 shadow-2xl relative border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Add Client (Fresh Dump)</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Company Name *</label>
                <input required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Email ID</label>
                <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="If none, leave blank or type 'na'" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Phone No</label>
                <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="If none, leave blank or type 'na'" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Address</label>
                <textarea className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-y" rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Company Address (Optional)" />
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-[#03045E] hover:bg-[#172554] text-white flex items-center justify-center gap-2 shadow-lg transition-all min-w-[140px]" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[var(--primary)]" size={32} /></div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-[var(--border)]">
          <Building2 size={48} className="mx-auto text-[var(--muted-foreground)] mb-4 opacity-50" />
          <h3 className="text-lg font-bold mb-2">{searchQuery ? 'No matching clients found' : 'No clients added yet'}</h3>
          <p className="text-[var(--muted-foreground)] mb-6">{searchQuery ? `We couldn't find anything matching "${searchQuery}"` : 'Start adding fresh company dumps to auto-assign them.'}</p>
          {!searchQuery && <button className="btn btn-primary mx-auto" onClick={() => setShowForm(true)}><Plus size={18} /> Add First Client</button>}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--sidebar-bg)]">
                <th className="p-4 w-12"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0} onChange={handleSelectAll} /></th>
                <th className="p-4 font-semibold text-sm">Company Name</th>
                <th className="p-4 font-semibold text-sm">Email</th>
                <th className="p-4 font-semibold text-sm">Phone</th>
                <th className="p-4 font-semibold text-sm">Assigned To</th>
                <th className="p-4 font-semibold text-sm">Added On</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map(lead => (
                <tr key={lead.id} className={`border-b border-[var(--border)] last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selectedLeads.includes(lead.id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                  <td className="p-4"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" checked={selectedLeads.includes(lead.id)} onChange={() => handleSelect(lead.id)} /></td>
                  <td className="p-4">
                    <div className="font-semibold text-[var(--foreground)]">{lead.companyName}</div>
                    <div className="text-xs text-[var(--muted-foreground)] uppercase mt-1">{lead.status.replace('_', ' ')}</div>
                  </td>
                  <td className="p-4 text-[var(--muted-foreground)] text-sm">{lead.email || 'na'}</td>
                  <td className="p-4 text-[var(--muted-foreground)] text-sm">{lead.phone || 'na'}</td>
                  <td className="p-4 text-sm font-medium">{lead.coordinator?.name || 'Unassigned'}</td>
                  <td className="p-4 text-[var(--muted-foreground)] text-sm">{new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[var(--border)] bg-slate-50 dark:bg-slate-800/50 px-4 py-3">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-900 dark:text-white">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-semibold text-slate-900 dark:text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)}</span> of <span className="font-semibold text-slate-900 dark:text-white">{filteredLeads.length}</span> clients
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    if (pageNum > totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${currentPage === pageNum ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

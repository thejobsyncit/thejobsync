'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, Building2, Mail, Phone, Calendar, Loader2, Upload, Download, Trash2 } from 'lucide-react';
import type { CompanyLead } from '@/lib/types';
import { read, utils, writeFile } from 'xlsx';

export default function DMSDashboard() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<CompanyLead[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ companyName: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
        setFormData({ companyName: '', email: '', phone: '' });
        setShowForm(false);
        fetchLeads();
      } else {
        alert('Failed to add client');
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
            }

            return { companyName: companyName.trim(), email: email.trim(), phone: phone.trim() };
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
            alert(`Successfully uploaded ${leads.length} leads! They have been assigned to coordinators.`);
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
      'Phone No': '9876543210'
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

  if (!user || !['super_admin', 'admin', 'dms'].includes(user.role)) {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Company Client (DMS)</h1>
          <p className="text-[var(--muted-foreground)]">Add fresh company dumps to distribute to coordinators</p>
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <h2 className="text-xl font-bold mb-4">Add Client (Fresh Dump)</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Company Name *</label>
                <input required className="form-input" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className="form-label">Email ID</label>
                <input className="form-input" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="If none, leave blank or type 'na'" />
              </div>
              <div>
                <label className="form-label">Phone No</label>
                <input className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="If none, leave blank or type 'na'" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Save Client'}
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
          <Building2 size={48} className="mx-auto text-[var(--muted-foreground)] mb-4 opacity-50" />
          <h3 className="text-lg font-bold mb-2">No clients added yet</h3>
          <p className="text-[var(--muted-foreground)] mb-6">Start adding fresh company dumps to auto-assign them.</p>
          <button className="btn btn-primary mx-auto" onClick={() => setShowForm(true)}><Plus size={18} /> Add First Client</button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--sidebar-bg)]">
                <th className="p-4 w-12"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" checked={selectedLeads.length === leads.length && leads.length > 0} onChange={handleSelectAll} /></th>
                <th className="p-4 font-semibold text-sm">Company Name</th>
                <th className="p-4 font-semibold text-sm">Email</th>
                <th className="p-4 font-semibold text-sm">Phone</th>
                <th className="p-4 font-semibold text-sm">Assigned To</th>
                <th className="p-4 font-semibold text-sm">Added On</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
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
        </div>
      )}
    </div>
  );
}

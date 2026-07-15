'use client';

import { useState, useMemo } from 'react';
import { Building2, Plus, Search, MapPin, Globe, Phone, Mail, MoreVertical, Edit2, Trash2, X } from 'lucide-react';
import { useDataStore } from '@/lib/useDataStore';
import { Client } from '@/lib/types';
import { validateForm, validateRequired, validateEmail, validatePhone } from '@/lib/validation';
import { useAuth } from '@/context/AuthContext';
import { canEditModule } from '@/lib/permissions';

export default function ClientsPage() {
  const { user } = useAuth();
  const isReadOnly = !canEditModule(user?.role, 'clients');

  const { data: clients, loading, error, createItem, updateItem, deleteItem, fetchItems } = useDataStore<Client>({
    endpoint: '/api/clients',
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return clients.filter(c => {
      const matchesSearch = c.companyName.toLowerCase().includes(search.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        c.industry.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingId(client.id);
      setFormData(client);
    } else {
      setEditingId(null);
      setFormData({ status: 'active' });
    }
    setFormErrors({});
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setFormErrors({});
  };

  const handleChange = (field: keyof Client, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const errors = validateForm(formData, {
      companyName: (v) => validateRequired(v, 'Company Name'),
      contactPerson: (v) => validateRequired(v, 'Contact Person'),
      email: (v) => validateEmail(v, 'Email'),
      phone: (v) => validatePhone(v, 'Phone'),
      industry: (v) => validateRequired(v, 'Industry'),
      address: (v) => validateRequired(v, 'Address'),
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    let success = false;

    if (editingId) {
      const updated = await updateItem(editingId, formData);
      if (updated) success = true;
    } else {
      const created = await createItem(formData);
      if (created) success = true;
    }

    setIsSubmitting(false);
    if (success) handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      await deleteItem(id);
      setOpenDropdownId(null);
    }
  };

  return (
    <div onClick={() => setOpenDropdownId(null)}>
      {/* Header */}
      <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Client Management</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Manage your client relationships and</p>
        </div>
        {!isReadOnly && (
          <button
            onClick={() => handleOpenModal()}
            className="btn btn-primary shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Add Client</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="animate-fade-in delay-1" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input className="input" style={{ paddingLeft: '2.5rem' }} placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="tab-list">
          {['all', 'active', 'inactive'].map(s => (
            <button key={s} className={`tab-item ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading / Error / Data */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="empty-state" style={{ minHeight: 200 }}>
          <p style={{ color: 'var(--destructive)', marginBottom: '1rem' }}>{error}</p>
          <button className="btn btn-secondary" onClick={() => fetchItems()}>Try Again</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {filtered.map((client, i) => (
              <div key={client.id} className={`card animate-fade-in-up delay-${Math.min(i + 1, 8)}`} style={{ padding: '1.25rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div className="avatar avatar-lg" style={{ background: `hsl(${client.id.charCodeAt(client.id.length-1) * 50}, 60%, 45%)`, borderRadius: 12 }}>
                      {client.companyName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.125rem' }}>{client.companyName}</h3>
                      <span className={`badge ${client.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                        {client.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Dropdown Menu */}
                  <div style={{ position: 'relative' }}>
                    {!isReadOnly && (
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === client.id ? null : client.id); }}
                          className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {openDropdownId === client.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setOpenDropdownId(null)}
                            />
                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-100 z-20 py-1 overflow-hidden">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleOpenModal(client); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Edit2 size={14} /> Edit
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(client.id); }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={14} style={{ flexShrink: 0 }} /> {client.contactPerson}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={14} style={{ flexShrink: 0 }} /> {client.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={14} style={{ flexShrink: 0 }} /> {client.phone}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} style={{ flexShrink: 0 }} /> {client.address}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={14} style={{ flexShrink: 0 }} /> {client.industry}
                  </div>
                  {client.website && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Globe size={14} style={{ flexShrink: 0 }} /> {client.website}
                    </div>
                  )}
                </div>
                {client.notes && (
                  <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--muted)', fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                    {client.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state" style={{ minHeight: 300 }}>
              <Building2 size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.25rem' }}>No clients found</p>
              <p style={{ fontSize: '0.8125rem' }}>Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Client Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{editingId ? 'Edit Client' : 'Add New Client'}</h2>
              <button className="btn-ghost btn-icon" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Company Name *</label>
                <input className={`input ${formErrors.companyName ? 'error' : ''}`} value={formData.companyName || ''} onChange={e => handleChange('companyName', e.target.value)} placeholder="Enter company name" />
                {formErrors.companyName && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.companyName}</span>}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Contact Person *</label>
                  <input className={`input ${formErrors.contactPerson ? 'error' : ''}`} value={formData.contactPerson || ''} onChange={e => handleChange('contactPerson', e.target.value)} placeholder="Full name" />
                  {formErrors.contactPerson && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.contactPerson}</span>}
                </div>
                <div>
                  <label className="label">Industry *</label>
                  <input className={`input ${formErrors.industry ? 'error' : ''}`} value={formData.industry || ''} onChange={e => handleChange('industry', e.target.value)} placeholder="e.g., IT Services" />
                  {formErrors.industry && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.industry}</span>}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Email *</label>
                  <input className={`input ${formErrors.email ? 'error' : ''}`} type="email" value={formData.email || ''} onChange={e => handleChange('email', e.target.value)} placeholder="email@company.com" />
                  {formErrors.email && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.email}</span>}
                </div>
                <div>
                  <label className="label">Phone *</label>
                  <input className={`input ${formErrors.phone ? 'error' : ''}`} value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} placeholder="+91 98765 XXXXX" />
                  {formErrors.phone && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.phone}</span>}
                </div>
              </div>
              
              <div>
                <label className="label">Address *</label>
                <input className={`input ${formErrors.address ? 'error' : ''}`} value={formData.address || ''} onChange={e => handleChange('address', e.target.value)} placeholder="City, State" />
                {formErrors.address && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.address}</span>}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Website</label>
                  <input className="input" value={formData.website || ''} onChange={e => handleChange('website', e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={formData.status || 'active'} onChange={e => handleChange('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="label">Notes</label>
                <textarea className="textarea" value={formData.notes || ''} onChange={e => handleChange('notes', e.target.value)} placeholder="Additional notes..." />
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Client' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Users({ size, style }: { size: number; style?: React.CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}

'use client';

import { useState, useMemo } from 'react';
import { Briefcase, Plus, Search, MapPin, Clock, Users, MoreVertical, Edit2, Trash2, X } from 'lucide-react';
import { useDataStore } from '@/lib/useDataStore';
import { JobRequirement, Client } from '@/lib/types';
import { validateForm, validateRequired, validateNumber } from '@/lib/validation';
import { useAuth } from '@/context/AuthContext';
import { canEditModule } from '@/lib/permissions';

const PRIORITY_COLORS = { low: '#22c55e', medium: '#0077B6', high: '#f97316', urgent: '#ef4444' };
const STATUS_COLORS: Record<string, string> = {
  open: '#22c55e',
  in_progress: '#0077B6',
  on_hold: '#eab308',
  closed: '#6b7280',
  cancelled: '#ef4444',
};

export default function RequirementsPage() {
  const { user } = useAuth();
  const isReadOnly = !canEditModule(user?.role, 'requirements');

  const { data: requirements, loading, error, createItem, updateItem, deleteItem, fetchItems } = useDataStore<JobRequirement>({
    endpoint: '/api/requirements',
  });
  const { data: clients } = useDataStore<Client>({ endpoint: '/api/clients' });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<JobRequirement & { skillsInput: string }>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Detail view modal
  const [viewingReq, setViewingReq] = useState<JobRequirement | null>(null);

  const filtered = useMemo(() => {
    return requirements.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
        (r.clientName && r.clientName.toLowerCase().includes(search.toLowerCase())) ||
        (r.skills && r.skills.some(s => s.toLowerCase().includes(search.toLowerCase())));
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requirements, search, statusFilter]);

  const handleOpenModal = (req?: JobRequirement) => {
    if (req) {
      setEditingId(req.id);
      setFormData({
        ...req,
        skillsInput: req.skills?.join(', ') || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        status: 'open',
        priority: 'medium',
        positions: 1,
        skillsInput: '',
      });
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

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const errors = validateForm(formData, {
      title: (v) => validateRequired(v, 'Job Title'),
      clientId: (v) => validateRequired(v, 'Client'),
      description: (v) => validateRequired(v, 'Description'),
      experience: (v) => validateRequired(v, 'Experience'),
      location: (v) => validateRequired(v, 'Location'),
      positions: (v) => validateNumber(v, 'Positions', 1),
      deadline: (v) => validateRequired(v, 'Deadline'),
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    let success = false;

    // Process skills array
    const skills = formData.skillsInput
      ? formData.skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const submitData = {
      ...formData,
      skills,
    };
    delete submitData.skillsInput;

    if (editingId) {
      const updated = await updateItem(editingId, submitData);
      if (updated) success = true;
    } else {
      const created = await createItem(submitData);
      if (created) success = true;
    }

    setIsSubmitting(false);
    if (success) handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this requirement?')) {
      await deleteItem(id);
      setOpenDropdownId(null);
    }
  };

  return (
    <div onClick={() => setOpenDropdownId(null)}>
      <div className="crm-page-header animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Job Requirements</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Track and manage all open positions</p>
        </div>
        {!isReadOnly && (
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={16} /> New Requirement
          </button>
        )}
      </div>

      <div className="crm-filter-bar animate-fade-in delay-1" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input className="input" style={{ paddingLeft: '2.5rem' }} placeholder="Search by title, client, or skill..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="tab-list">
          {['all', 'open', 'in_progress', 'closed'].map(s => (
            <button key={s} className={`tab-item ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s === 'all' ? 'All' : s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map((req, i) => (
              <div
                key={req.id}
                className={`card animate-fade-in-up delay-${Math.min(i + 1, 8)}`}
                style={{ padding: '1.25rem', cursor: 'pointer' }}
                onClick={() => setViewingReq(req)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{req.title}</h3>
                      <span className="badge" style={{
                        background: `${STATUS_COLORS[req.status] || '#666'}15`,
                        color: STATUS_COLORS[req.status] || '#666',
                      }}>{req.status.replace('_', ' ')}</span>
                      <span className="badge" style={{
                        background: `${PRIORITY_COLORS[req.priority as keyof typeof PRIORITY_COLORS] || '#666'}15`,
                        color: PRIORITY_COLORS[req.priority as keyof typeof PRIORITY_COLORS] || '#666',
                      }}>{req.priority}</span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>{req.clientName}</p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-hover)' }}>{req.salaryRange}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{req.experience}</div>
                    </div>
                    
                    {/* Dropdown Menu */}
                    {!isReadOnly && (
                      <div style={{ position: 'relative' }}>
                        <button 
                          className="btn-ghost btn-icon" 
                          onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === req.id ? null : req.id); }}
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openDropdownId === req.id && (
                          <div className="dropdown-menu" style={{ position: 'absolute', right: 0, top: '100%', zIndex: 10, minWidth: '150px' }}>
                            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleOpenModal(req); }}>
                              <Edit2 size={14} /> Edit Requirement
                            </button>
                            <button className="dropdown-item text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(req.id); }}>
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                  {req.description.length > 120 ? req.description.slice(0, 120) + '...' : req.description}
                </p>

                {req.skills && req.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.875rem' }}>
                    {req.skills.map(skill => (
                      <span key={skill} style={{
                        padding: '0.2rem 0.5rem', background: 'var(--surface-hover)',
                        borderRadius: 'var(--radius-full)', fontSize: '0.6875rem',
                        color: 'var(--muted-foreground)', border: '1px solid var(--border)',
                      }}>{skill}</span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={12} /> {req.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={12} /> {req.filledPositions}/{req.positions} filled</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {new Date(req.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div>
                    <div className="progress-bar" style={{ width: 100, height: 5 }}>
                      <div className="progress-fill" style={{ width: `${(req.filledPositions / req.positions) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state" style={{ minHeight: 300 }}>
              <Briefcase size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.25rem' }}>No requirements found</p>
              <p style={{ fontSize: '0.8125rem' }}>Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{editingId ? 'Edit Job Requirement' : 'New Job Requirement'}</h2>
              <button className="btn-ghost btn-icon" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Job Title *</label>
                <input className={`input ${formErrors.title ? 'error' : ''}`} value={formData.title || ''} onChange={e => handleChange('title', e.target.value)} placeholder="e.g., Senior React Developer" />
                {formErrors.title && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.title}</span>}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Client *</label>
                  <select className={`input select ${formErrors.clientId ? 'error' : ''}`} value={formData.clientId || ''} onChange={e => handleChange('clientId', e.target.value)}>
                    <option value="">Select client...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.companyName}</option>
                    ))}
                  </select>
                  {formErrors.clientId && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.clientId}</span>}
                </div>
                <div>
                  <label className="label">Priority</label>
                  <select className="input select" value={formData.priority || 'medium'} onChange={e => handleChange('priority', e.target.value)}>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="label">Description *</label>
                <textarea className={`textarea ${formErrors.description ? 'error' : ''}`} value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} placeholder="Job description..." rows={4} />
                {formErrors.description && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.description}</span>}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Positions *</label>
                  <input className={`input ${formErrors.positions ? 'error' : ''}`} type="number" min="1" value={formData.positions || ''} onChange={e => handleChange('positions', e.target.value)} placeholder="3" />
                  {formErrors.positions && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.positions}</span>}
                </div>
                <div>
                  <label className="label">Experience *</label>
                  <input className={`input ${formErrors.experience ? 'error' : ''}`} value={formData.experience || ''} onChange={e => handleChange('experience', e.target.value)} placeholder="3-5 years" />
                  {formErrors.experience && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.experience}</span>}
                </div>
                <div>
                  <label className="label">Location *</label>
                  <input className={`input ${formErrors.location ? 'error' : ''}`} value={formData.location || ''} onChange={e => handleChange('location', e.target.value)} placeholder="Bangalore" />
                  {formErrors.location && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.location}</span>}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Salary Range</label>
                  <input className="input" value={formData.salaryRange || ''} onChange={e => handleChange('salaryRange', e.target.value)} placeholder="₹12-18 LPA" />
                </div>
                <div>
                  <label className="label">Deadline *</label>
                  <input className={`input ${formErrors.deadline ? 'error' : ''}`} type="date" value={formData.deadline || ''} onChange={e => handleChange('deadline', e.target.value)} />
                  {formErrors.deadline && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.deadline}</span>}
                </div>
              </div>
              
              <div>
                <label className="label">Skills (comma separated)</label>
                <input className="input" value={formData.skillsInput || ''} onChange={e => handleChange('skillsInput', e.target.value)} placeholder="React, TypeScript, Node.js" />
              </div>
              
              {editingId && (
                <div>
                  <label className="label">Status</label>
                  <select className="input select" value={formData.status || 'open'} onChange={e => handleChange('status', e.target.value)}>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="closed">Closed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Requirement' : 'Create Requirement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {viewingReq && (
        <div className="modal-overlay" onClick={() => setViewingReq(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{viewingReq.title}</h2>
                  <span className="badge" style={{ background: `${STATUS_COLORS[viewingReq.status] || '#666'}15`, color: STATUS_COLORS[viewingReq.status] || '#666' }}>
                    {viewingReq.status.replace('_', ' ')}
                  </span>
                  <span className="badge" style={{ background: `${PRIORITY_COLORS[viewingReq.priority as keyof typeof PRIORITY_COLORS] || '#666'}15`, color: PRIORITY_COLORS[viewingReq.priority as keyof typeof PRIORITY_COLORS] || '#666' }}>
                    {viewingReq.priority}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{viewingReq.clientName}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                {!isReadOnly && (
                  <button className="btn btn-secondary btn-sm" onClick={() => { setViewingReq(null); handleOpenModal(viewingReq); }}>
                    <Edit2 size={14} /> Edit
                  </button>
                )}
                <button className="btn-ghost btn-icon" onClick={() => setViewingReq(null)}><X size={20} /></button>
              </div>
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--surface-hover)', borderRadius: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Positions</div>
                <div style={{ fontWeight: 600 }}>{viewingReq.filledPositions}/{viewingReq.positions} filled</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Experience</div>
                <div style={{ fontWeight: 600 }}>{viewingReq.experience}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Location</div>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {viewingReq.location}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Salary</div>
                <div style={{ fontWeight: 600, color: 'var(--primary-hover)' }}>{viewingReq.salaryRange || 'Not specified'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Deadline</div>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {new Date(viewingReq.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Job Description</div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--foreground)', whiteSpace: 'pre-wrap' }}>{viewingReq.description}</p>
            </div>

            {/* Skills */}
            {viewingReq.skills && viewingReq.skills.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>Required Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {viewingReq.skills.map(skill => (
                    <span key={skill} style={{ padding: '0.25rem 0.75rem', background: 'var(--primary-glow)', color: 'var(--primary-hover)', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 500, border: '1px solid var(--primary-border, #bae6fd)' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Progress bar */}
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                <span>Positions Filled</span>
                <span style={{ fontWeight: 600 }}>{viewingReq.filledPositions}/{viewingReq.positions}</span>
              </div>
              <div className="progress-bar" style={{ height: 8 }}>
                <div className="progress-fill" style={{ width: `${Math.min((viewingReq.filledPositions / viewingReq.positions) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

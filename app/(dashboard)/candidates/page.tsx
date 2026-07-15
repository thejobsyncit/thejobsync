'use client';

import { useState, useMemo } from 'react';
import { Users, Plus, Search, MapPin, Briefcase, GraduationCap, Mail, Phone, FileText, MoreVertical, Edit2, Trash2, X } from 'lucide-react';
import { useDataStore } from '@/lib/useDataStore';
import { Candidate, JobRequirement } from '@/lib/types';
import { validateForm, validateRequired, validateEmail, validatePhone } from '@/lib/validation';
import { useAuth } from '@/context/AuthContext';
import { canEditModule } from '@/lib/permissions';

const STATUS_COLORS: Record<string, string> = {
  new: '#0077B6',
  shortlisted: '#00B4D8',
  interview_scheduled: '#f59e0b',
  interviewed: '#00B4D8',
  selected: '#22c55e',
  offered: '#10b981',
  offer_accepted: '#059669',
  joined: '#14b8a6',
  rejected: '#ef4444',
};

export default function CandidatesPage() {
  const { user } = useAuth();
  const isReadOnly = !canEditModule(user?.role, 'candidates');

  const { data: candidates, loading, error, createItem, updateItem, deleteItem, fetchItems } = useDataStore<Candidate>({
    endpoint: '/api/candidates',
  });

  const { data: requirements } = useDataStore<JobRequirement>({ endpoint: '/api/requirements' });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Candidate & { skillsInput: string }>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.skills && c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [candidates, search, statusFilter]);

  const handleOpenModal = (cand?: Candidate) => {
    if (cand) {
      setEditingId(cand.id);
      setFormData({
        ...cand,
        skillsInput: cand.skills?.join(', ') || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        status: 'new',
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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const errors = validateForm(formData, {
      name: (v) => validateRequired(v, 'Name'),
      email: (v) => validateEmail(v, 'Email'),
      phone: (v) => validatePhone(v, 'Phone'),
      experience: (v) => validateRequired(v, 'Experience'),
      education: (v) => validateRequired(v, 'Education'),
      location: (v) => validateRequired(v, 'Location'),
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    let success = false;

    // Process skills
    const skills = formData.skillsInput
      ? formData.skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const submitData = { ...formData, skills };
    delete submitData.skillsInput;
    if (!submitData.appliedFor) submitData.appliedFor = undefined; // Fix empty string to undefined

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
    if (confirm('Are you sure you want to delete this candidate?')) {
      await deleteItem(id);
      setOpenDropdownId(null);
    }
  };

  return (
    <div onClick={() => setOpenDropdownId(null)}>
      <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Candidate Management</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Browse and manage candidate profiles</p>
        </div>
        {!isReadOnly && (
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={16} /> Add Candidate
          </button>
        )}
      </div>

      <div className="animate-fade-in delay-1" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input className="input" style={{ paddingLeft: '2.5rem' }} placeholder="Search by name, skill, or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="tab-list" style={{ flexWrap: 'wrap' }}>
          {['all', 'new', 'shortlisted', 'interview_scheduled', 'selected', 'offered', 'joined'].map(s => (
            <button key={s} className={`tab-item ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s === 'all' ? 'All' : s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}><div className="spinner"></div></div>
      ) : error ? (
        <div className="empty-state" style={{ minHeight: 200 }}>
          <p style={{ color: 'var(--destructive)', marginBottom: '1rem' }}>{error}</p>
          <button className="btn btn-secondary" onClick={() => fetchItems()}>Try Again</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {filtered.map((candidate, i) => (
              <div key={candidate.id} className={`card animate-fade-in-up delay-${Math.min(i + 1, 8)}`} style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '0.875rem', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '0.875rem', flex: 1 }}>
                    <div className="avatar avatar-xl" style={{
                      background: `hsl(${candidate.name.charCodeAt(0) * 15}, 55%, 45%)`,
                      borderRadius: 14,
                    }}>
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{candidate.name}</h3>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginBottom: '0.375rem' }}>
                        {candidate.currentRole || 'Candidate'} {candidate.currentCompany ? `at ${candidate.currentCompany}` : ''}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={12} /> {candidate.phone}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={12} /> {candidate.email}</span>
                      </div>
                      <span className="badge" style={{
                        background: `${STATUS_COLORS[candidate.status] || '#6b7280'}15`,
                        color: STATUS_COLORS[candidate.status] || '#94a3b8',
                      }}>
                        {candidate.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {!isReadOnly && (
                    <div style={{ position: 'relative' }}>
                      <button
                        className="btn-ghost btn-icon"
                        onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === candidate.id ? null : candidate.id); }}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openDropdownId === candidate.id && (
                        <div className="dropdown-menu" style={{ position: 'absolute', right: 0, top: '100%', zIndex: 10, minWidth: '150px' }}>
                          <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleOpenModal(candidate); }}>
                            <Edit2 size={14} /> Edit
                          </button>
                          <button className="dropdown-item text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(candidate.id); }}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={13} /> {candidate.experience} experience</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GraduationCap size={13} /> 
                    {(() => {
                      let ed = candidate.education;
                      try {
                        if (ed && ed.startsWith('[')) ed = JSON.parse(ed)[0]?.degree || ed;
                        else if (ed && ed.startsWith('{')) ed = JSON.parse(ed).degree || ed;
                      } catch {}
                      return ed.length > 40 ? ed.slice(0, 40) + '...' : ed;
                    })()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={13} /> {candidate.location}</div>
                  {candidate.expectedSalary && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-hover)', fontWeight: 500 }}>
                      💰 {candidate.expectedSalary}
                    </div>
                  )}
                  {candidate.requirementTitle && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)' }}>
                      Applied for: <strong>{candidate.requirementTitle}</strong>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.875rem' }}>
                  {candidate.skills?.slice(0, 4).map(skill => (
                    <span key={skill} style={{
                      padding: '0.15rem 0.5rem', background: 'var(--surface-hover)',
                      borderRadius: 'var(--radius-full)', fontSize: '0.6875rem',
                      color: 'var(--muted-foreground)', border: '1px solid var(--border)',
                    }}>{skill}</span>
                  ))}
                  {candidate.skills && candidate.skills.length > 4 && (
                    <span style={{
                      padding: '0.15rem 0.5rem', background: 'var(--primary-glow)',
                      borderRadius: 'var(--radius-full)', fontSize: '0.6875rem',
                      color: 'var(--primary-hover)',
                    }}>+{candidate.skills.length - 4}</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                  <a href={`mailto:${candidate.email}`} className="btn btn-secondary btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none' }}><Mail size={13} /> Email</a>
                  <a href={`tel:${candidate.phone}`} className="btn btn-secondary btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none' }}><Phone size={13} /> Call</a>
                  {candidate.resumeUrl ? (
                    <a href={candidate.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none' }}><FileText size={13} /> Resume</a>
                  ) : (
                    <button className="btn btn-secondary btn-sm" disabled style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: 0.5, cursor: 'not-allowed' }}><FileText size={13} /> No Resume</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state" style={{ minHeight: 300 }}>
              <Users size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>No candidates found</p>
              <p style={{ fontSize: '0.8125rem' }}>Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{editingId ? 'Edit Candidate' : 'Add New Candidate'}</h2>
              <button className="btn-ghost btn-icon" onClick={handleCloseModal}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Full Name *</label>
                <input className={`input ${formErrors.name ? 'error' : ''}`} value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} placeholder="Enter full name" />
                {formErrors.name && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.name}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Email *</label>
                  <input type="email" className={`input ${formErrors.email ? 'error' : ''}`} value={formData.email || ''} onChange={e => handleChange('email', e.target.value)} placeholder="email@example.com" />
                  {formErrors.email && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.email}</span>}
                </div>
                <div>
                  <label className="label">Phone *</label>
                  <input className={`input ${formErrors.phone ? 'error' : ''}`} value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} placeholder="+91 XXXXXXXXXX" />
                  {formErrors.phone && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.phone}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Experience *</label>
                  <input className={`input ${formErrors.experience ? 'error' : ''}`} value={formData.experience || ''} onChange={e => handleChange('experience', e.target.value)} placeholder="e.g., 5 years" />
                  {formErrors.experience && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.experience}</span>}
                </div>
                <div>
                  <label className="label">Location *</label>
                  <input className={`input ${formErrors.location ? 'error' : ''}`} value={formData.location || ''} onChange={e => handleChange('location', e.target.value)} placeholder="Bangalore" />
                  {formErrors.location && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.location}</span>}
                </div>
              </div>

              <div>
                <label className="label">Education *</label>
                <input className={`input ${formErrors.education ? 'error' : ''}`} value={formData.education || ''} onChange={e => handleChange('education', e.target.value)} placeholder="B.Tech CS, IIT Madras" />
                {formErrors.education && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.education}</span>}
              </div>

              <div>
                <label className="label">Skills (comma separated)</label>
                <input className="input" value={formData.skillsInput || ''} onChange={e => handleChange('skillsInput', e.target.value)} placeholder="React, TypeScript, Node.js" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Current Company</label>
                  <input className="input" value={formData.currentCompany || ''} onChange={e => handleChange('currentCompany', e.target.value)} placeholder="Company name" />
                </div>
                <div>
                  <label className="label">Current Role</label>
                  <input className="input" value={formData.currentRole || ''} onChange={e => handleChange('currentRole', e.target.value)} placeholder="e.g., Frontend Developer" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Expected Salary</label>
                  <input className="input" value={formData.expectedSalary || ''} onChange={e => handleChange('expectedSalary', e.target.value)} placeholder="₹20 LPA" />
                </div>
                <div>
                  <label className="label">Applied For</label>
                  <select className="input select" value={formData.appliedFor || ''} onChange={e => handleChange('appliedFor', e.target.value)}>
                    <option value="">-- None --</option>
                    {requirements.map(req => (
                      <option key={req.id} value={req.id}>{req.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {editingId && (
                <div>
                  <label className="label">Status</label>
                  <select className="input select" value={formData.status || 'new'} onChange={e => handleChange('status', e.target.value)}>
                    <option value="new">New</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview_scheduled">Interview Scheduled</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="selected">Selected</option>
                    <option value="offered">Offered</option>
                    <option value="joined">Joined</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Candidate' : 'Add Candidate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

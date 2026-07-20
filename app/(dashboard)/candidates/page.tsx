'use client';

import { useState, useMemo } from 'react';
import { Users, Plus, Search, MapPin, Briefcase, GraduationCap, Mail, Phone, FileText, MoreVertical, Edit2, Trash2, X } from 'lucide-react';
import { useDataStore } from '@/lib/useDataStore';
import { Candidate, JobRequirement } from '@/lib/types';
import { validateForm, validateRequired, validateEmail, validatePhone } from '@/lib/validation';
import { useAuth } from '@/context/AuthContext';
import { canEditModule } from '@/lib/permissions';

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

function formatExperience(exp: string | null): string {
  if (!exp) return 'No experience';
  try {
    if (exp.startsWith('[')) {
      const parsed = JSON.parse(exp);
      if (parsed.length > 0 && parsed[0].role) {
        const r = `${parsed[0].role} at ${parsed[0].company}`;
        return r.length > 40 ? r.slice(0, 40) + '...' : r;
      }
    }
  } catch {}
  return exp.length > 40 ? exp.slice(0, 40) + '...' : exp;
}

function formatLocation(loc: string | null): string {
  if (!loc) return '-';
  try {
    if (loc.startsWith('{')) {
      const p = JSON.parse(loc);
      return [p.city, p.district, p.state].filter(Boolean).join(', ') || '-';
    }
  } catch {}
  return loc.length > 35 ? loc.slice(0, 35) + '...' : loc;
}

function formatRole(role: string | null, company: string | null): string {
  if (!role) return 'Candidate';
  // If role looks like JSON, extract from it
  try {
    if (role.startsWith('[')) {
      const parsed = JSON.parse(role);
      if (parsed.length > 0 && parsed[0].role) role = parsed[0].role;
    } else if (role.startsWith('{')) {
      const parsed = JSON.parse(role);
      if (parsed.role) role = parsed.role;
    }
  } catch {}
  const full = company ? `${role} at ${company}` : role;
  if (!full) return 'Candidate';
  return full.length > 35 ? full.slice(0, 35) + '...' : full;
}

function getWhatsAppLink(phone: string, name: string, status: string, requirementTitle?: string | null): string {
  let cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
  
  let msg = `Hi ${name},\n\nThis is regarding your job application for "${requirementTitle || 'our open position'}" on The jobsync.\n\n`;
  if (status === 'shortlisted') {
    msg += `We are happy to inform you that your profile has been shortlisted! 🚀 Our team will contact you soon for the interview details.`;
  } else if (status === 'interview_scheduled') {
    msg += `Your interview has been scheduled! 📅 We will share the date and time shortly.`;
  } else if (status === 'selected') {
    msg += `Congratulations! You have been selected! 🎉 Our HR team will connect with you soon regarding the offer letter.`;
  } else {
    msg += `We would like to connect with you regarding your application. Let us know when you are free to discuss.`;
  }
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
}

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

  // Detail view modal
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);

  // Email Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCandidate, setEmailCandidate] = useState<Candidate | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCandidate) return;
    setSendingEmail(true);
    setEmailError('');
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: emailCandidate.email,
          subject: emailSubject,
          message: emailBody,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEmailError(data.error || 'Failed to send email');
      } else {
        setEmailSuccess(true);
        setTimeout(() => {
          setShowEmailModal(false);
          setEmailSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setEmailError('Something went wrong. Please try again.');
    }
    setSendingEmail(false);
  };

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
              <div
                key={candidate.id}
                className={`card animate-fade-in-up delay-${Math.min(i + 1, 8)}`}
                style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setViewingCandidate(candidate)}
              >
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
                      <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginBottom: '0.375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                        {formatRole(candidate.currentRole ?? null, candidate.currentCompany ?? null)}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
                          <Phone size={12} style={{ flexShrink: 0 }} /> 
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidate.phone}</span>
                          <a 
                            href={getWhatsAppLink(candidate.phone, candidate.name, candidate.status, candidate.requirementTitle)} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ display: 'inline-flex', alignItems: 'center', color: '#25D366', marginLeft: 'auto', padding: '2px', borderRadius: '4px' }}
                            title="Send WhatsApp Message"
                            onClick={e => e.stopPropagation()}
                          >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                              <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.457 3.48 1.328 5L2 22l5.176-1.356c1.47.8 3.11 1.22 4.828 1.22 5.506 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm6.27 13.916c-.258.73-1.49 1.418-2.072 1.488-.58.07-1.162.274-3.708-.772-3.252-1.334-5.328-4.63-5.49-4.846-.16-.216-1.306-1.736-1.306-3.31 0-1.574.82-2.35 1.112-2.66.29-.31.638-.388.852-.388.214 0 .428.002.614.01.2.01.468-.076.732.56.264.638.904 2.2.982 2.356.078.156.13.336.026.544-.104.208-.156.336-.31.518-.156.182-.328.406-.468.544-.156.156-.32.326-.138.638.182.312.808 1.332 1.732 2.156.924.824 1.704 1.078 2.022 1.21.318.13.506.104.692-.104.186-.208.808-.938 1.026-1.26.216-.32.434-.268.732-.156.298.112 1.892.894 2.216 1.056.324.162.54.242.618.374.078.13.078.756-.18 1.486z"/>
                            </svg>
                          </a>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={12} style={{ flexShrink: 0 }} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{candidate.email}</span></span>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={13} /> {formatExperience(candidate.experience)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GraduationCap size={13} /> 
                    {(() => {
                      let ed = candidate.education;
                      try {
                        if (ed && ed.startsWith('[')) ed = JSON.parse(ed)[0]?.degree || ed;
                        else if (ed && ed.startsWith('{')) ed = JSON.parse(ed).degree || ed;
                      } catch {}
                      return ed && ed.length > 40 ? ed.slice(0, 40) + '...' : (ed || '-');
                    })()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={13} /> {formatLocation(candidate.location)}</div>
                  {candidate.expectedSalary && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-hover)', fontWeight: 500 }}>
                      💰 {candidate.expectedSalary}
                    </div>
                  )}
                  {candidate.requirementTitle && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)' }}>
                      Applied for: <strong style={{ textTransform: 'capitalize' }}>{candidate.requirementTitle}</strong>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.875rem', overflow: 'hidden', maxHeight: '2.5rem' }}>
                  {candidate.skills?.slice(0, 3).map(skill => (
                    <span key={skill} style={{
                      padding: '0.15rem 0.5rem', background: 'var(--surface-hover)',
                      borderRadius: 'var(--radius-full)', fontSize: '0.6875rem',
                      color: 'var(--muted-foreground)', border: '1px solid var(--border)',
                      whiteSpace: 'nowrap', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{skill}</span>
                  ))}
                  {candidate.skills && candidate.skills.length > 3 && (
                    <span style={{
                      padding: '0.15rem 0.5rem', background: 'var(--primary-glow)',
                      borderRadius: 'var(--radius-full)', fontSize: '0.6875rem',
                      color: 'var(--primary-hover)', whiteSpace: 'nowrap',
                    }}>+{candidate.skills.length - 3}</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEmailCandidate(candidate);
                      setEmailSubject(`Update regarding your application at The jobsync`);
                      setEmailBody('');
                      setEmailSuccess(false);
                      setEmailError('');
                      setShowEmailModal(true);
                    }}
                    className="btn btn-secondary btn-sm" 
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none', cursor: 'pointer' }}
                  >
                    <Mail size={13} /> Email
                  </button>
                  <a href={`tel:${candidate.phone}`} className="btn btn-secondary btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none' }}><Phone size={13} /> Call</a>
                  {candidate.resumeUrl ? (
                    <button onClick={(e) => openResume(candidate.resumeUrl, e)} className="btn btn-primary btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none', border: 'none' }}><FileText size={13} /> Resume</button>
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

      {/* Email Compose Modal */}
      {showEmailModal && emailCandidate && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)} style={{ zIndex: 100 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Message to {emailCandidate.name}</h2>
              <button className="btn-ghost btn-icon" onClick={() => setShowEmailModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {emailError && <div style={{ padding: '0.75rem', background: 'var(--destructive-light)', color: 'var(--destructive)', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>{emailError}</div>}
              {emailSuccess && <div style={{ padding: '0.75rem', background: '#dcfce7', color: '#166534', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Message sent successfully!</div>}
              
              <div className="form-group">
                <label className="form-label">To</label>
                <input type="text" readOnly value={emailCandidate.email} className="input" style={{ background: 'var(--surface-hover)', color: 'var(--muted-foreground)' }} />
              </div>
              
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input 
                  type="text" 
                  required 
                  value={emailSubject} 
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="input" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea 
                  required
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Type your message here..."
                  className="input"
                  style={{ resize: 'none' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEmailModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={sendingEmail} className="btn btn-primary" style={{ minWidth: '120px' }}>
                  {sendingEmail ? <div className="spinner" style={{ width: 16, height: 16 }}></div> : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Detail View Modal */}
      {viewingCandidate && (
        <div className="modal-overlay" onClick={() => setViewingCandidate(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="avatar avatar-xl" style={{ background: `hsl(${viewingCandidate.name.charCodeAt(0) * 15}, 55%, 45%)`, borderRadius: 14, flexShrink: 0 }}>
                  {viewingCandidate.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{viewingCandidate.name}</h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.375rem' }}>
                    {viewingCandidate.currentRole || 'Candidate'}{viewingCandidate.currentCompany ? ` at ${viewingCandidate.currentCompany}` : ''}
                  </p>
                  <span className="badge" style={{ background: `${STATUS_COLORS[viewingCandidate.status] || '#6b7280'}15`, color: STATUS_COLORS[viewingCandidate.status] || '#94a3b8' }}>
                    {viewingCandidate.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                {!isReadOnly && (
                  <button className="btn btn-secondary btn-sm" onClick={() => { setViewingCandidate(null); handleOpenModal(viewingCandidate); }}>
                    <Edit2 size={14} /> Edit
                  </button>
                )}
                <button className="btn-ghost btn-icon" onClick={() => setViewingCandidate(null)}><X size={20} /></button>
              </div>
            </div>

            {/* Contact & Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--surface-hover)', borderRadius: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Phone</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{viewingCandidate.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Email</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', wordBreak: 'break-all' }}>{viewingCandidate.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Experience</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{formatExperience(viewingCandidate.experience)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Education</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {(() => { let ed = viewingCandidate.education; try { if (ed?.startsWith('[')) ed = JSON.parse(ed)[0]?.degree || ed; else if (ed?.startsWith('{')) ed = JSON.parse(ed).degree || ed; } catch {} return ed || '-'; })()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Location</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{formatLocation(viewingCandidate.location)}</div>
              </div>
              {viewingCandidate.expectedSalary && (
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Expected Salary</div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary-hover)' }}>{viewingCandidate.expectedSalary}</div>
                </div>
              )}
            </div>

            {/* Applied for */}
            {viewingCandidate.requirementTitle && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Applied For</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, textTransform: 'capitalize' }}>{viewingCandidate.requirementTitle}</div>
              </div>
            )}

            {/* Skills */}
            {viewingCandidate.skills && viewingCandidate.skills.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {viewingCandidate.skills.map((skill: string) => (
                    <span key={skill} style={{ padding: '0.25rem 0.75rem', background: 'var(--primary-glow)', color: 'var(--primary-hover)', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 500 }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                style={{ flex: '1 1 120px' }}
                onClick={() => {
                  setViewingCandidate(null);
                  setEmailCandidate(viewingCandidate);
                  setEmailSubject(`Update regarding your application at The jobsync`);
                  setEmailBody('');
                  setEmailSuccess(false);
                  setEmailError('');
                  setShowEmailModal(true);
                }}
              >
                <Mail size={15} /> Send Message
              </button>
              <a 
                href={getWhatsAppLink(viewingCandidate.phone, viewingCandidate.name, viewingCandidate.status, viewingCandidate.requirementTitle)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ flex: '1 1 120px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none', background: '#25D366', color: 'white', borderColor: '#25D366' }}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.457 3.48 1.328 5L2 22l5.176-1.356c1.47.8 3.11 1.22 4.828 1.22 5.506 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm6.27 13.916c-.258.73-1.49 1.418-2.072 1.488-.58.07-1.162.274-3.708-.772-3.252-1.334-5.328-4.63-5.49-4.846-.16-.216-1.306-1.736-1.306-3.31 0-1.574.82-2.35 1.112-2.66.29-.31.638-.388.852-.388.214 0 .428.002.614.01.2.01.468-.076.732.56.264.638.904 2.2.982 2.356.078.156.13.336.026.544-.104.208-.156.336-.31.518-.156.182-.328.406-.468.544-.156.156-.32.326-.138.638.182.312.808 1.332 1.732 2.156.924.824 1.704 1.078 2.022 1.21.318.13.506.104.692-.104.186-.208.808-.938 1.026-1.26.216-.32.434-.268.732-.156.298.112 1.892.894 2.216 1.056.324.162.54.242.618.374.078.13.078.756-.18 1.486z"/>
                </svg>
                WhatsApp
              </a>
              <a href={`tel:${viewingCandidate.phone}`} className="btn btn-secondary" style={{ flex: '1 1 100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none' }}>
                <Phone size={15} /> Call
              </a>
              {viewingCandidate.resumeUrl ? (
                <button onClick={(e) => openResume(viewingCandidate.resumeUrl, e)} className="btn btn-secondary" style={{ flex: '1 1 100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none', border: '1px solid var(--border)' }}>
                  <FileText size={15} /> Resume
                </button>
              ) : (
                <button className="btn btn-secondary" disabled style={{ flex: '1 1 100px', opacity: 0.5 }}>
                  <FileText size={15} /> No Resume
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

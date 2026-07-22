'use client';

import { useState, useMemo } from 'react';
import { Calendar, Plus, Search, Clock, User, Star, MessageSquare, Video, Phone as PhoneIcon, Users, MoreVertical, Edit2, Trash2, X } from 'lucide-react';
import { useDataStore } from '@/lib/useDataStore';
import { Interview, Candidate, JobRequirement, User as AppUser } from '@/lib/types';
import { validateForm, validateRequired, validateNumber } from '@/lib/validation';
import { useAuth } from '@/context/AuthContext';
import { canEditModule } from '@/lib/permissions';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  technical: <span style={{ fontSize: '0.75rem' }}>💻</span>,
  hr: <span style={{ fontSize: '0.75rem' }}>🤝</span>,
  phone: <PhoneIcon size={12} />,
  video: <Video size={12} />,
  in_person: <Users size={12} />,
};

const STATUS_COLORS: Record<string, string> = {
  scheduled: '#f59e0b',
  completed: '#22c55e',
  cancelled: '#ef4444',
};

export default function InterviewsPage() {
  const { user } = useAuth();
  const isReadOnly = !canEditModule(user?.role, 'interviews');

  const { data: interviews, loading, error, createItem, updateItem, deleteItem, fetchItems } = useDataStore<Interview>({
    endpoint: '/api/interviews',
  });
  
  const { data: candidates } = useDataStore<Candidate>({ endpoint: '/api/candidates' });
  const { data: requirements } = useDataStore<JobRequirement>({ endpoint: '/api/requirements' });
  const { data: users } = useDataStore<AppUser>({ endpoint: '/api/users' });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Interview>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return interviews.filter(i => {
      const matchesSearch = (i.candidateName && i.candidateName.toLowerCase().includes(search.toLowerCase())) ||
        (i.requirementTitle && i.requirementTitle.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [interviews, search, statusFilter]);

  const renderStars = (rating: number) => (
    <div style={{ display: 'flex', gap: '0.125rem' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={14} fill={s <= rating ? '#eab308' : 'transparent'} color={s <= rating ? '#eab308' : 'var(--border-light)'} />
      ))}
    </div>
  );

  const handleOpenModal = (interview?: Interview) => {
    if (interview) {
      setEditingId(interview.id);
      // Format datetime string for input type="datetime-local"
      const dateObj = new Date(interview.scheduledAt);
      const localDatetime = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      
      setFormData({
        ...interview,
        scheduledAt: localDatetime,
      });
    } else {
      setEditingId(null);
      setFormData({
        type: 'technical',
        duration: 60,
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
      candidateId: (v) => editingId ? null : validateRequired(v, 'Candidate'),
      requirementId: (v) => editingId ? null : validateRequired(v, 'Requirement'),
      interviewerId: (v) => editingId ? null : validateRequired(v, 'Interviewer'),
      scheduledAt: (v) => validateRequired(v, 'Date & Time'),
      duration: (v) => validateNumber(v, 'Duration', 15),
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    let success = false;

    const submitData = { ...formData };
    // Convert local datetime string to ISO
    if (submitData.scheduledAt) {
      submitData.scheduledAt = new Date(submitData.scheduledAt).toISOString();
    }

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
    if (confirm('Are you sure you want to delete this interview?')) {
      await deleteItem(id);
      setOpenDropdownId(null);
    }
  };

  return (
    <div onClick={() => setOpenDropdownId(null)}>
      <div className="crm-page-header animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Interview Management</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Schedule and track all interviews</p>
        </div>
        {!isReadOnly && (
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={16} /> Schedule Interview
          </button>
        )}
      </div>

      <div className="crm-filter-bar animate-fade-in delay-1" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input className="input" style={{ paddingLeft: '2.5rem' }} placeholder="Search interviews..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="tab-list">
          {['all', 'scheduled', 'completed', 'cancelled'].map(s => (
            <button key={s} className={`tab-item ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map((interview, i) => (
              <div key={interview.id} className={`card animate-fade-in-up delay-${Math.min(i + 1, 8)}`} style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                    <div className="avatar avatar-lg" style={{
                      background: `hsl(${(interview.candidateName || 'U').charCodeAt(0) * 15}, 55%, 45%)`,
                      borderRadius: 12,
                    }}>
                      {(interview.candidateName || 'U').split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{interview.candidateName}</h3>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginBottom: '0.375rem' }}>
                        {interview.requirementTitle}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="badge" style={{
                          background: `${STATUS_COLORS[interview.status] || '#6b7280'}15`,
                          color: STATUS_COLORS[interview.status] || '#94a3b8',
                        }}>{interview.status}</span>
                        <span className="badge badge-info">{TYPE_ICONS[interview.type]} {interview.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                        <Calendar size={14} />
                        {new Date(interview.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--muted-foreground)', justifyContent: 'flex-end' }}>
                        <Clock size={13} />
                        {new Date(interview.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        <span>• {interview.duration} min</span>
                      </div>
                    </div>
                    
                    {!isReadOnly && (
                      <div style={{ position: 'relative' }}>
                        <button 
                          className="btn-ghost btn-icon" 
                          onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === interview.id ? null : interview.id); }}
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openDropdownId === interview.id && (
                          <div className="dropdown-menu" style={{ position: 'absolute', right: 0, top: '100%', zIndex: 10, minWidth: '150px' }}>
                            <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleOpenModal(interview); }}>
                              <Edit2 size={14} /> {interview.status === 'scheduled' ? 'Update & Feedback' : 'Edit'}
                            </button>
                            <button className="dropdown-item text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(interview.id); }}>
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                  <User size={13} /> Interviewer: <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{interview.interviewerName}</span>
                </div>

                {interview.feedback && (
                  <div style={{
                    marginTop: '0.75rem', padding: '0.75rem',
                    background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)',
                    fontSize: '0.8125rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                      <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <MessageSquare size={13} /> Feedback
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {interview.rating ? renderStars(interview.rating) : null}
                        {interview.recommendation && (
                          <span className={`badge ${interview.recommendation === 'select' ? 'badge-success' : interview.recommendation === 'reject' ? 'badge-danger' : 'badge-warning'}`}>
                            {interview.recommendation}
                          </span>
                        )}
                      </div>
                    </div>
                    <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.5 }}>{interview.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state" style={{ minHeight: 300 }}>
              <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>No interviews found</p>
              <p style={{ fontSize: '0.8125rem' }}>Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{editingId ? 'Edit / Add Feedback' : 'Schedule Interview'}</h2>
              <button className="btn-ghost btn-icon" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!editingId && (
                <>
                  <div>
                    <label className="label">Candidate *</label>
                    <select className={`input select ${formErrors.candidateId ? 'error' : ''}`} value={formData.candidateId || ''} onChange={e => handleChange('candidateId', e.target.value)}>
                      <option value="">Select candidate...</option>
                      {candidates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {formErrors.candidateId && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.candidateId}</span>}
                  </div>
                  <div>
                    <label className="label">Requirement *</label>
                    <select className={`input select ${formErrors.requirementId ? 'error' : ''}`} value={formData.requirementId || ''} onChange={e => handleChange('requirementId', e.target.value)}>
                      <option value="">Select requirement...</option>
                      {requirements.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                    </select>
                    {formErrors.requirementId && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.requirementId}</span>}
                  </div>
                  <div>
                    <label className="label">Interviewer *</label>
                    <select className={`input select ${formErrors.interviewerId ? 'error' : ''}`} value={formData.interviewerId || ''} onChange={e => handleChange('interviewerId', e.target.value)}>
                      <option value="">Select interviewer...</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                    </select>
                    {formErrors.interviewerId && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.interviewerId}</span>}
                  </div>
                </>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Date & Time *</label>
                  <input className={`input ${formErrors.scheduledAt ? 'error' : ''}`} type="datetime-local" value={formData.scheduledAt || ''} onChange={e => handleChange('scheduledAt', e.target.value)} />
                  {formErrors.scheduledAt && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.scheduledAt}</span>}
                </div>
                <div>
                  <label className="label">Duration (min) *</label>
                  <input className={`input ${formErrors.duration ? 'error' : ''}`} type="number" min="15" value={formData.duration || ''} onChange={e => handleChange('duration', Number(e.target.value))} />
                  {formErrors.duration && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.duration}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Type</label>
                  <select className="input select" value={formData.type || 'technical'} onChange={e => handleChange('type', e.target.value)}>
                    <option value="technical">Technical</option>
                    <option value="hr">HR</option>
                    <option value="phone">Phone</option>
                    <option value="video">Video</option>
                    <option value="in_person">In Person</option>
                  </select>
                </div>
                {editingId && (
                  <div>
                    <label className="label">Status</label>
                    <select className="input select" value={formData.status || 'scheduled'} onChange={e => handleChange('status', e.target.value)}>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
              </div>

              {editingId && (
                <>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem' }}>Interview Feedback</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div>
                        <label className="label">Rating (1-5)</label>
                        <input className="input" type="number" min="1" max="5" value={formData.rating || ''} onChange={e => handleChange('rating', Number(e.target.value))} />
                      </div>
                      <div>
                        <label className="label">Recommendation</label>
                        <select className="input select" value={formData.recommendation || ''} onChange={e => handleChange('recommendation', e.target.value)}>
                          <option value="">None</option>
                          <option value="select">Select</option>
                          <option value="hold">Hold</option>
                          <option value="reject">Reject</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="label">Feedback Comments</label>
                      <textarea className="textarea" rows={3} value={formData.feedback || ''} onChange={e => handleChange('feedback', e.target.value)} placeholder="Technical strengths, communication, etc." />
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Interview' : 'Schedule Interview'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

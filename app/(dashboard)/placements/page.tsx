'use client';

import { useState, useMemo } from 'react';
import { Award, Search, Building2, Calendar, DollarSign, CheckCircle, Plus, MoreVertical, Edit2, Trash2, X } from 'lucide-react';
import { useDataStore } from '@/lib/useDataStore';
import { Placement, Candidate, JobRequirement, Client } from '@/lib/types';
import { validateForm, validateRequired, validateNumber } from '@/lib/validation';
import { useAuth } from '@/context/AuthContext';
import { canEditModule } from '@/lib/permissions';

const PIPELINE_STEPS = ['offer_sent', 'offer_accepted', 'joining_confirmed', 'joined'];
const PIPELINE_LABELS: Record<string, string> = { offer_sent: 'Offer Sent', offer_accepted: 'Offer Accepted', joining_confirmed: 'Joining Confirmed', joined: 'Joined' };

const STATUS_COLORS: Record<string, string> = {
  offer_sent: '#0077B6',
  offer_accepted: '#00B4D8',
  joining_confirmed: '#f59e0b',
  joined: '#22c55e',
};

export default function PlacementsPage() {
  const { user } = useAuth();
  const isReadOnly = !canEditModule(user?.role, 'placements');

  const { data: placements, loading, error, createItem, updateItem, deleteItem, fetchItems } = useDataStore<Placement>({
    endpoint: '/api/placements',
  });

  const { data: candidates } = useDataStore<Candidate>({ endpoint: '/api/candidates?status=selected' });
  const { data: requirements } = useDataStore<JobRequirement>({ endpoint: '/api/requirements' });
  const { data: clients } = useDataStore<Client>({ endpoint: '/api/clients' });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Placement>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return placements.filter(p => {
      const matchesSearch = (p.candidateName && p.candidateName.toLowerCase().includes(search.toLowerCase())) ||
        (p.clientName && p.clientName.toLowerCase().includes(search.toLowerCase())) ||
        (p.position && p.position.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [placements, search, statusFilter]);

  const getStepIndex = (status: string) => PIPELINE_STEPS.indexOf(status);

  const handleOpenModal = (placement?: Placement) => {
    if (placement) {
      setEditingId(placement.id);

      let localDate = '';
      if (placement.joiningDate) {
        const d = new Date(placement.joiningDate);
        localDate = d.toISOString().split('T')[0];
      }

      setFormData({
        ...placement,
        joiningDate: localDate as any, // Type hack for date string vs Date object in form
      });
    } else {
      setEditingId(null);
      setFormData({
        status: 'offer_sent',
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
      candidateId: (v) => editingId ? null : validateRequired(v, 'Candidate'),
      requirementId: (v) => editingId ? null : validateRequired(v, 'Requirement'),
      clientId: (v) => editingId ? null : validateRequired(v, 'Client'),
      position: (v) => validateRequired(v, 'Position'),
      salary: (v) => validateRequired(v, 'Salary'),
      joiningDate: (v) => validateRequired(v, 'Joining Date'),
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    let success = false;

    const submitData = { ...formData };
    if (submitData.joiningDate && typeof submitData.joiningDate === 'string') {
      submitData.joiningDate = new Date(submitData.joiningDate).toISOString();
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
    if (confirm('Are you sure you want to delete this placement?')) {
      await deleteItem(id);
      setOpenDropdownId(null);
    }
  };

  return (
    <div onClick={() => setOpenDropdownId(null)}>
      <div className="crm-page-header animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Placement Management</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Track offers, confirmations, and placements</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', marginRight: '1rem' }}>
            <div className="stat-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ color: '#22c55e', fontWeight: 700, fontSize: '1.25rem' }}>{placements.filter(p => p.status === 'joined').length}</div>
              <span style={{ color: 'var(--muted-foreground)' }}>Joined</span>
            </div>
            <div className="stat-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ color: '#f97316', fontWeight: 700, fontSize: '1.25rem' }}>{placements.filter(p => p.status !== 'joined').length}</div>
              <span style={{ color: 'var(--muted-foreground)' }}>In Pipeline</span>
            </div>
          </div>
          {!isReadOnly && (
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <Plus size={16} /> New Placement
            </button>
          )}
        </div>
      </div>

      <div className="crm-filter-bar animate-fade-in delay-1" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input className="input" style={{ paddingLeft: '2.5rem' }} placeholder="Search placements..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="tab-list">
          {['all', ...PIPELINE_STEPS].map(s => (
            <button key={s} className={`tab-item ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s === 'all' ? 'All' : PIPELINE_LABELS[s] || s}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((placement, i) => {
              const stepIdx = getStepIndex(placement.status);
              return (
                <div key={placement.id} className={`card animate-fade-in-up delay-${Math.min(i + 1, 8)}`} style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                      <div className="avatar avatar-xl" style={{
                        background: `hsl(${(placement.candidateName || 'U').charCodeAt(0) * 15}, 55%, 45%)`,
                        borderRadius: 14,
                      }}>
                        {(placement.candidateName || 'U').split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, marginBottom: '0.25rem' }}>{placement.candidateName}</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--primary-hover)', fontWeight: 500 }}>{placement.position}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span className="badge" style={{
                        background: `${STATUS_COLORS[placement.status] || '#6b7280'}15`,
                        color: STATUS_COLORS[placement.status] || '#94a3b8',
                        padding: '0.375rem 0.75rem',
                        fontSize: '0.8125rem',
                      }}>
                        {PIPELINE_LABELS[placement.status]}
                      </span>

                      {!isReadOnly && (
                        <div style={{ position: 'relative' }}>
                          <button
                            className="btn-ghost btn-icon"
                            onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === placement.id ? null : placement.id); }}
                          >
                            <MoreVertical size={16} />
                          </button>
                          {openDropdownId === placement.id && (
                            <div className="dropdown-menu" style={{ position: 'absolute', right: 0, top: '100%', zIndex: 10, minWidth: '150px' }}>
                              <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleOpenModal(placement); }}>
                                <Edit2 size={14} /> Update Status
                              </button>
                              <button className="dropdown-item text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(placement.id); }}>
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginBottom: '1.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Building2 size={14} /> {placement.clientName}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><DollarSign size={14} /> {placement.salary}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Calendar size={14} /> Joining: {new Date(placement.joiningDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  {/* Pipeline Steps */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {PIPELINE_STEPS.map((step, si) => (
                      <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', flex: 1,
                        }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: si <= stepIdx ? 'var(--gradient-primary)' : 'var(--surface-hover)',
                            border: si <= stepIdx ? 'none' : '1px solid var(--border)',
                            color: si <= stepIdx ? 'white' : 'var(--muted)',
                            fontSize: '0.75rem', fontWeight: 600,
                            transition: 'all 0.3s ease',
                          }}>
                            {si <= stepIdx ? <CheckCircle size={14} /> : si + 1}
                          </div>
                          <span style={{
                            fontSize: '0.6875rem',
                            color: si <= stepIdx ? 'var(--foreground)' : 'var(--muted)',
                            fontWeight: si === stepIdx ? 600 : 400,
                            textAlign: 'center',
                          }}>
                            {PIPELINE_LABELS[step]}
                          </span>
                        </div>
                        {si < PIPELINE_STEPS.length - 1 && (
                          <div style={{
                            height: 2, flex: '0 0 20px',
                            background: si < stepIdx ? 'var(--primary)' : 'var(--border)',
                            transition: 'background 0.3s ease',
                            marginBottom: '1.25rem',
                          }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {placement.notes && (
                    <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem' }}>
                      <p style={{ color: 'var(--muted-foreground)' }}><strong>Notes:</strong> {placement.notes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state" style={{ minHeight: 300 }}>
              <Award size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>No placements found</p>
              <p style={{ fontSize: '0.8125rem' }}>Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{editingId ? 'Update Placement' : 'New Placement'}</h2>
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="label">Client *</label>
                      <select className={`input select ${formErrors.clientId ? 'error' : ''}`} value={formData.clientId || ''} onChange={e => handleChange('clientId', e.target.value)}>
                        <option value="">Select client...</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                      </select>
                      {formErrors.clientId && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.clientId}</span>}
                    </div>
                    <div>
                      <label className="label">Requirement *</label>
                      <select className={`input select ${formErrors.requirementId ? 'error' : ''}`} value={formData.requirementId || ''} onChange={e => handleChange('requirementId', e.target.value)}>
                        <option value="">Select requirement...</option>
                        {requirements.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                      </select>
                      {formErrors.requirementId && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.requirementId}</span>}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="label">Position Title *</label>
                <input className={`input ${formErrors.position ? 'error' : ''}`} value={formData.position || ''} onChange={e => handleChange('position', e.target.value)} placeholder="e.g., Senior React Developer" />
                {formErrors.position && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.position}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Salary / CTC *</label>
                  <input className={`input ${formErrors.salary ? 'error' : ''}`} value={formData.salary || ''} onChange={e => handleChange('salary', e.target.value)} placeholder="₹15,000,000 LPA" />
                  {formErrors.salary && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.salary}</span>}
                </div>
                <div>
                  <label className="label">Joining Date *</label>
                  <input className={`input ${formErrors.joiningDate ? 'error' : ''}`} type="date" value={(formData.joiningDate as any) || ''} onChange={e => handleChange('joiningDate', e.target.value)} />
                  {formErrors.joiningDate && <span style={{ color: 'var(--destructive)', fontSize: '0.75rem' }}>{formErrors.joiningDate}</span>}
                </div>
              </div>

              {editingId && (
                <div>
                  <label className="label">Status</label>
                  <select className="input select" value={formData.status || 'offer_sent'} onChange={e => handleChange('status', e.target.value)}>
                    <option value="offer_sent">Offer Sent</option>
                    <option value="offer_accepted">Offer Accepted</option>
                    <option value="joining_confirmed">Joining Confirmed</option>
                    <option value="joined">Joined</option>
                  </select>
                </div>
              )}

              <div>
                <label className="label">Notes</label>
                <textarea className="textarea" rows={3} value={formData.notes || ''} onChange={e => handleChange('notes', e.target.value)} placeholder="Any special conditions or remarks..." />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Placement' : 'Record Placement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

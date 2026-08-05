'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LifeBuoy, Calendar, Plus, Send, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HelpdeskPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tickets' | 'leave'>('tickets');
  
  useEffect(() => {
    const saved = localStorage.getItem('helpdesk_tab');
    if (saved) setActiveTab(saved as any);
  }, []);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    localStorage.setItem('helpdesk_tab', tab);
  };

  // Ticket State
  const [tickets, setTickets] = useState<any[]>([]);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({ assignedRole: 'super_admin', subject: '', message: '' });
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Leave State
  const [leaves, setLeaves] = useState<any[]>([]);
  const [isApplyingLeave, setIsApplyingLeave] = useState(false);
  const [newLeave, setNewLeave] = useState({ startDate: '', endDate: '', reason: '' });

  const fetchData = async () => {
    if (!user) return;
    try {
      const ticketRes = await fetch(`/api/tickets?userId=${user.id}&role=${user.role}`);
      if (ticketRes.ok) setTickets(await ticketRes.json());
      
      const leaveRes = await fetch(`/api/leave?userId=${user.id}&role=${user.role}`);
      if (leaveRes.ok) setLeaves(await leaveRes.json());
    } catch (error) {
      console.error('Failed to fetch helpdesk data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTicket, creatorId: user.id })
      });
      if (res.ok) {
        toast.success('Ticket created successfully');
        setIsCreatingTicket(false);
        setNewTicket({ assignedRole: 'super_admin', subject: '', message: '' });
        fetchData();
      } else {
        toast.error('Failed to create ticket');
      }
    } catch (error) {
      toast.error('Error creating ticket');
    }
  };

  const handleReplyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedTicket) return;
    try {
      const res = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reply', senderId: user.id, message: replyMessage })
      });
      if (res.ok) {
        setReplyMessage('');
        fetchData();
        const updatedTicket = await res.json();
        setSelectedTicket(updatedTicket);
      } else {
        toast.error('Failed to send reply');
      }
    } catch (error) {
      toast.error('Error sending reply');
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsApplyingLeave(true);
    try {
      const res = await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newLeave, userId: user.id })
      });
      if (res.ok) {
        toast.success('Leave applied successfully');
        setNewLeave({ startDate: '', endDate: '', reason: '' });
        fetchData();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to apply leave');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error applying leave');
    } finally {
      setIsApplyingLeave(false);
    }
  };

  return (
    <div>
      <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LifeBuoy size={22} style={{ color: '#0077B6' }} /> Helpdesk & Leave Portal
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Raise IT/Admin tickets and apply for leaves</p>
      </div>

      <div className="tab-list animate-fade-in" style={{ marginBottom: '1.5rem' }}>
        <button className={`tab-item ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => handleTabChange('tickets')}>
          <LifeBuoy size={16} /> Support Tickets
        </button>
        <button className={`tab-item ${activeTab === 'leave' ? 'active' : ''}`} onClick={() => handleTabChange('leave')}>
          <Calendar size={16} /> My Leaves
        </button>
      </div>

      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          <div className="lg:col-span-1 flex flex-col gap-4">
            <button className="btn-primary w-full" onClick={() => { setIsCreatingTicket(true); setSelectedTicket(null); }}>
              <Plus size={18} /> New Ticket
            </button>
            <div className="card p-0 overflow-hidden" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
              {tickets.length === 0 ? (
                <div className="p-5 text-center text-[var(--muted-foreground)]">No tickets found</div>
              ) : (
                tickets.map(ticket => (
                  <div 
                    key={ticket.id} 
                    onClick={() => { setSelectedTicket(ticket); setIsCreatingTicket(false); }}
                    style={{ 
                      padding: '1rem', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                      background: selectedTicket?.id === ticket.id ? 'var(--background)' : 'transparent'
                    }}
                    className="hover:bg-[var(--background)] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm truncate pr-2">{ticket.subject}</span>
                      <span className={`text-[0.7rem] px-2 py-0.5 rounded-full ${ticket.status === 'open' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="text-[0.75rem] text-[var(--muted-foreground)] flex justify-between">
                      <span>{ticket.creatorId === user?.id ? 'Me' : ticket.creator.name} &rarr; {ticket.assignedRole}</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {isCreatingTicket ? (
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-4">Create New Ticket</h3>
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Send To *</label>
                    <select className="form-input" required value={newTicket.assignedRole} onChange={e => setNewTicket({...newTicket, assignedRole: e.target.value})}>
                      <option value="super_admin">Super Admin</option>
                      <option value="admin">Admin</option>
                      <option value="it_admin">IT Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <input type="text" className="form-input" required value={newTicket.subject} onChange={e => setNewTicket({...newTicket, subject: e.target.value})} placeholder="Brief description of the issue" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea className="form-input min-h-[150px]" required value={newTicket.message} onChange={e => setNewTicket({...newTicket, message: e.target.value})} placeholder="Provide detailed information..." />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" className="btn-secondary" onClick={() => setIsCreatingTicket(false)}>Cancel</button>
                    <button type="submit" className="btn-primary">Submit Ticket</button>
                  </div>
                </form>
              </div>
            ) : selectedTicket ? (
              <div className="card flex flex-col p-0 h-full max-h-[calc(100vh-200px)]">
                <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--background)]">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedTicket.subject}</h3>
                    <div className="text-[0.8rem] text-[var(--muted-foreground)]">Ticket #{selectedTicket.id.substring(0, 8)} • Created by {selectedTicket.creatorId === user?.id ? 'You' : selectedTicket.creator.name}</div>
                  </div>
                  <span className={`badge ${selectedTicket.status === 'open' ? 'badge-info' : 'badge-success'}`}>{selectedTicket.status}</span>
                </div>
                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
                  {selectedTicket.messages?.map((msg: any) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex flex-col max-w-[80%] ${isMe ? 'self-end' : 'self-start'}`}>
                        <div className="text-[0.7rem] text-[var(--muted-foreground)] mb-1 px-1">
                          {isMe ? 'You' : msg.sender.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className={`p-3 rounded-2xl ${isMe ? 'bg-[#0077B6] text-white rounded-tr-none' : 'bg-[var(--background)] border border-[var(--border)] rounded-tl-none'}`}>
                          {msg.message}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedTicket.status === 'open' && (
                  <form onSubmit={handleReplyTicket} className="p-4 border-t border-[var(--border)] flex gap-2">
                    <input type="text" required value={replyMessage} onChange={e => setReplyMessage(e.target.value)} placeholder="Type a reply..." className="form-input flex-1" />
                    <button type="submit" className="btn-primary p-3 rounded-xl"><Send size={18} /></button>
                  </form>
                )}
              </div>
            ) : (
              <div className="card p-10 flex flex-col items-center justify-center text-[var(--muted-foreground)] h-full">
                <LifeBuoy size={48} className="mb-4 opacity-20" />
                <p>Select a ticket to view details or create a new one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'leave' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          <div className="lg:col-span-1">
            <div className="card p-5">
              <h3 className="font-semibold text-lg mb-4">Apply for Leave</h3>
              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input type="date" className="form-input" required min={new Date().toISOString().split('T')[0]} value={newLeave.startDate} onChange={e => setNewLeave({...newLeave, startDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date *</label>
                  <input type="date" className="form-input" required min={newLeave.startDate || new Date().toISOString().split('T')[0]} value={newLeave.endDate} onChange={e => setNewLeave({...newLeave, endDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Reason *</label>
                  <textarea className="form-input" required value={newLeave.reason} onChange={e => setNewLeave({...newLeave, reason: e.target.value})} placeholder="State the reason for leave..." rows={3} />
                </div>
                <button type="submit" className="btn-primary w-full" disabled={isApplyingLeave}>
                  {isApplyingLeave ? 'Submitting...' : 'Submit Leave Request'}
                </button>
              </form>
            </div>
          </div>
          
          <div className="lg:col-span-2 card p-5">
            <h3 className="font-semibold text-lg mb-4">My Leave History</h3>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    {user?.role === 'super_admin' && <th>Employee</th>}
                    <th>Duration</th>
                    <th>Reason</th>
                    <th>Applied On</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map(leave => (
                    <tr key={leave.id}>
                      {user?.role === 'super_admin' && (
                        <td>
                          <div className="font-medium">{leave.user?.name || 'Unknown'}</div>
                          <div className="text-[0.75rem] text-[var(--muted-foreground)] capitalize">{leave.user?.role?.replace('_', ' ') || ''}</div>
                        </td>
                      )}
                      <td className="whitespace-nowrap font-medium">
                        {leave.startDate} <span className="text-[var(--muted-foreground)] mx-1">to</span> {leave.endDate}
                      </td>
                      <td className="max-w-[200px] truncate" title={leave.reason}>{leave.reason}</td>
                      <td className="text-[var(--muted-foreground)]">{new Date(leave.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${
                          leave.status === 'approved' ? 'badge-success' : 
                          leave.status === 'rejected' ? 'badge-error' : 'badge-warning'
                        }`}>
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {leaves.length === 0 && (
                    <tr><td colSpan={user?.role === 'super_admin' ? 5 : 4} className="text-center py-6 text-[var(--muted-foreground)]">No leave requests found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

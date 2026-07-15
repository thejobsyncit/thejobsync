'use client';

import { Crown, Building2, Users, Shield, Settings, BarChart3, Globe, Key, Database, FileText, Plus, RefreshCw, Clock, CheckCircle, Trash2, Calendar } from 'lucide-react';
import { ROLE_LABELS, ROLE_COLORS, UserRole } from '@/lib/types';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import EmployeeAttendanceModal from './EmployeeAttendanceModal';

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'attendance' | 'leaves' | 'company' | 'master'>('overview');
  
  useEffect(() => {
    const saved = localStorage.getItem('super_admin_tab');
    if (saved) setActiveTab(saved as any);
  }, []);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    localStorage.setItem('super_admin_tab', tab);
  };

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Employee Management State
  const [employees, setEmployees] = useState<any[]>([]);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'hr' as UserRole, phone: '' });
  const [selectedEmployeeForAttendance, setSelectedEmployeeForAttendance] = useState<any>(null);

  // Attendance State
  const [pendingAttendances, setPendingAttendances] = useState<any[]>([]);

  // Leaves State
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) setStats((await res.json()).stats);
    } catch (error) {
      toast.error('Failed to load system stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) setEmployees(await res.json());
    } catch (error) {
      toast.error('Failed to load employees');
    }
  };

  const fetchPendingAttendances = async () => {
    try {
      const res = await fetch('/api/attendance?pending=true');
      if (res.ok) setPendingAttendances(await res.json());
    } catch (error) {
      toast.error('Failed to load attendance records');
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const res = await fetch('/api/leave?role=super_admin');
      if (res.ok) setLeaveRequests(await res.json());
    } catch (error) {
      toast.error('Failed to load leave requests');
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') fetchStats();
    if (activeTab === 'employees') fetchEmployees();
    if (activeTab === 'attendance') fetchPendingAttendances();
    if (activeTab === 'leaves') fetchLeaveRequests();
  }, [activeTab]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingUser(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        toast.success('Employee account created successfully');
        setNewUser({ name: '', email: '', password: '', role: 'hr', phone: '' });
        fetchEmployees();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to create user');
      }
    } catch (error) {
      toast.error('Error creating user');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Employee deleted successfully');
        fetchEmployees();
      } else {
        toast.error('Failed to delete employee');
      }
    } catch (error) {
      toast.error('Error deleting employee');
    }
  };

  const handleApproveAttendance = async (id: string) => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: true })
      });
      if (res.ok) {
        toast.success('Late login approved!');
        fetchPendingAttendances();
      } else {
        toast.error('Failed to approve');
      }
    } catch (error) {
      toast.error('Error approving');
    }
  };

  const handleUpdateLeaveStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/leave/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Leave request ${status}`);
        fetchLeaveRequests();
      } else {
        toast.error('Failed to update leave request');
      }
    } catch (error) {
      toast.error('Error updating leave request');
    }
  };

  return (
    <div>
      <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Crown size={22} style={{ color: '#eab308' }} /> Super Admin Console
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Full system access and configuration</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Candidates', value: loading ? '...' : stats?.totalCandidates, icon: <Users size={18} />, color: '#0077B6' },
          { label: 'Active Clients', value: loading ? '...' : stats?.totalClients, icon: <Building2 size={18} />, color: '#22c55e' },
          { label: 'Total Placements', value: loading ? '...' : stats?.placements, icon: <BarChart3 size={18} />, color: '#f97316' },
          { label: 'Open Requirements', value: loading ? '...' : stats?.activeRequirements, icon: <Globe size={18} />, color: '#0077B6' },
        ].map((s, i) => (
          <div key={s.label} className={`stat-card animate-fade-in-up delay-${i + 1}`}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: '0.75rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tab-list animate-fade-in delay-3" style={{ marginBottom: '1.25rem', width: 'fit-content' }}>
        {['overview', 'employees', 'attendance', 'leaves', 'company', 'master'].map(tab => (
          <button key={tab} className={`tab-item ${activeTab === tab ? 'active' : ''}`} onClick={() => handleTabChange(tab as typeof activeTab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'master' ? 'Data' : ''}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div className="card animate-fade-in-up delay-1" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Manage Employees', icon: <Users size={16} />, color: '#0077B6', onClick: () => setActiveTab('employees') },
                { label: 'Permission Matrix', icon: <Key size={16} />, color: '#22c55e', onClick: () => {} },
                { label: 'Company Settings', icon: <Settings size={16} />, color: '#f97316', onClick: () => setActiveTab('company') },
                { label: 'Database Management', icon: <Database size={16} />, color: '#0077B6', onClick: () => {} },
              ].map(action => (
                <button key={action.label} onClick={action.onClick} className="btn btn-secondary" style={{ justifyContent: 'flex-start', width: '100%' }}>
                  <span style={{ color: action.color }}>{action.icon}</span> {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'employees' && (
        <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Employee Directory</h3>
              <button onClick={fetchEmployees} className="btn-secondary btn-sm"><RefreshCw size={14}/> Refresh</button>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td className="font-medium cursor-pointer text-[#0077B6] hover:underline" onClick={() => setSelectedEmployeeForAttendance(emp)}>
                        {emp.name}
                      </td>
                      <td>
                        <span className="badge" style={{ background: `${ROLE_COLORS[emp.role as UserRole]}15`, color: ROLE_COLORS[emp.role as UserRole] }}>
                          {ROLE_LABELS[emp.role as UserRole]}
                        </span>
                      </td>
                      <td className="text-sm text-[var(--muted-foreground)]">{emp.email}</td>
                      <td>
                        <span className={`badge ${emp.isActive ? 'badge-success' : 'badge-error'}`}>
                          {emp.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleDeleteEmployee(emp.id)} className="btn-ghost text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && <tr><td colSpan={5} className="text-center py-4 text-[var(--muted)]">Loading employees...</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-5 h-fit">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Plus size={18}/> Add New Employee</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" className="form-input" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input type="email" className="form-input" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input type="text" className="form-input" required minLength={6} value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Role *</label>
                <select className="form-input" required value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}>
                  <option value="hr">HR Professional</option>
                  <option value="interviewer">Interviewer</option>
                  <option value="placement_coordinator">Placement Coordinator</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-input" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={isCreatingUser}>
                {isCreatingUser ? 'Creating...' : 'Create Employee Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="card p-5 animate-fade-in-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2"><Clock size={18} /> Late Login Approvals</h3>
            <button onClick={fetchPendingAttendances} className="btn-secondary btn-sm"><RefreshCw size={14}/> Refresh</button>
          </div>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Login Attempt</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingAttendances.map(record => (
                  <tr key={record.id}>
                    <td>
                      <div className="font-medium">{record.user.name}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{ROLE_LABELS[record.user.role as UserRole]}</div>
                    </td>
                    <td>{record.date}</td>
                    <td className="text-red-500 font-medium">
                      {new Date(record.loginTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td><span className="badge badge-warning">Pending Approval</span></td>
                    <td>
                      <button onClick={() => handleApproveAttendance(record.id)} className="btn-primary btn-sm bg-emerald-600 hover:bg-emerald-700">
                        <CheckCircle size={14} /> Approve Access
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingAttendances.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-[var(--muted)]">No pending approvals! Everyone logged in on time today.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'leaves' && (
        <div className="card p-5 animate-fade-in-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2"><Calendar size={18} /> Leave Approvals</h3>
            <button onClick={fetchLeaveRequests} className="btn-secondary btn-sm"><RefreshCw size={14}/> Refresh</button>
          </div>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map(leave => (
                  <tr key={leave.id}>
                    <td>
                      <div className="font-medium">{leave.user?.name || 'Unknown'}</div>
                      <div className="text-[0.75rem] text-[var(--muted-foreground)] capitalize">{leave.user?.role?.replace('_', ' ')}</div>
                    </td>
                    <td className="whitespace-nowrap">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="max-w-[250px] truncate" title={leave.reason}>{leave.reason}</td>
                    <td>
                      <span className={`badge ${
                        leave.status === 'approved' ? 'badge-success' : 
                        leave.status === 'rejected' ? 'badge-error' : 'badge-warning'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      {leave.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateLeaveStatus(leave.id, 'approved')} className="btn-primary btn-sm bg-green-500 hover:bg-green-600 border-none">Approve</button>
                          <button onClick={() => handleUpdateLeaveStatus(leave.id, 'rejected')} className="btn-secondary btn-sm text-red-500 hover:bg-red-500/10 border-red-200">Reject</button>
                        </div>
                      ) : (
                        <span className="text-[0.75rem] text-[var(--muted-foreground)]">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
                {leaveRequests.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-6 text-[var(--muted-foreground)]">No leave requests found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'company' && (
        <div className="card animate-fade-in-up" style={{ padding: '1.5rem', maxWidth: 600 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Company Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div><label className="label">Company Name</label><input className="input" defaultValue="Enterprise HRMS Solutions" /></div>
            <div><label className="label">Company Email</label><input className="input" defaultValue="admin@hrms.com" /></div>
            <div><label className="label">Phone</label><input className="input" defaultValue="+91 80 1234 5678" /></div>
            <div><label className="label">Address</label><textarea className="textarea" defaultValue="Tech Park, Bangalore" /></div>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>Save Changes</button>
          </div>
        </div>
      )}

      {activeTab === 'master' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {['Industries', 'Skills', 'Locations', 'Education Levels', 'Interview Types', 'Document Types'].map((item, i) => (
            <div key={item} className={`card animate-fade-in-up delay-${i + 1}`} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontWeight: 600 }}>{item}</h4>
                <button className="btn btn-ghost btn-sm"><Settings size={14} /></button>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginTop: '0.375rem' }}>
                Manage {item.toLowerCase()} master data
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedEmployeeForAttendance && (
        <EmployeeAttendanceModal 
          employee={selectedEmployeeForAttendance} 
          onClose={() => setSelectedEmployeeForAttendance(null)} 
        />
      )}
    </div>
  );
}

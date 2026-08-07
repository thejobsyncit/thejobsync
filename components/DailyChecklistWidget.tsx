'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  X, 
  Plus, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  ListTodo,
  User,
  Users
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

type Priority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  text: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  creator?: {
    name: string;
    role: string;
  };
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AVAILABLE_ROLES = [
  { value: 'self', label: 'Assign to Self' },
  { value: 'application_support', label: 'Application Support' },
  { value: 'developer', label: 'Developer' },
  { value: 'tester', label: 'Tester' },
  { value: 'hr', label: 'HR' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'interviewer', label: 'Interviewer' },
  { value: 'admin', label: 'Admin' },
  { value: 'it_admin', label: 'IT Admin' },
];

export default function DailyChecklistWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  
  // Delegation states
  const [selectedRole, setSelectedRole] = useState('self');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (user?.id && isOpen) {
      fetchTasks();
    }
  }, [user?.id, isOpen]);

  useEffect(() => {
    if (selectedRole !== 'self') {
      fetchTeamMembers(selectedRole);
    } else {
      setTeamMembers([]);
      setSelectedUserId('');
    }
  }, [selectedRole]);

  const fetchTasks = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/tasks?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.error('Failed to fetch tasks', e);
    }
  };

  const fetchTeamMembers = async (role: string) => {
    try {
      const res = await fetch(`/api/users/by-role?role=${role}`);
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data);
        if (data.length > 0) {
          setSelectedUserId(data[0].id);
        } else {
          setSelectedUserId('');
        }
      }
    } catch (e) {
      console.error('Failed to fetch team members', e);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim() || !user?.id) return;

    if (selectedRole !== 'self' && !selectedUserId) {
      toast.error('Please select a team member');
      return;
    }

    setIsAdding(true);
    const assigneeId = selectedRole === 'self' ? user.id : selectedUserId;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newTaskText.trim(),
          priority,
          creatorId: user.id,
          assigneeId
        })
      });

      if (res.ok) {
        const newTask = await res.json();
        
        // If assigned to self, add to list. If assigned to someone else, just show success.
        if (assigneeId === user.id) {
          setTasks(prev => [newTask, ...prev]);
          toast.success('Task added to your list');
        } else {
          toast.success('Task pushed to team member');
        }
        
        setNewTaskText('');
        setPriority('medium');
        setSelectedRole('self');
      } else {
        toast.error('Failed to create task');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !currentStatus } : t
    ));

    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      });
    } catch (error) {
      // Revert on error
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, completed: currentStatus } : t
      ));
    }
  };

  const deleteTask = async (id: string) => {
    // Optimistic update
    const previousTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    } catch (error) {
      setTasks(previousTasks);
      toast.error('Failed to delete task');
    }
  };

  const clearCompleted = async () => {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) return;

    // Optimistic
    setTasks(prev => prev.filter(t => !t.completed));
    
    for (const t of completedTasks) {
      await fetch(`/api/tasks/${t.id}`, { method: 'DELETE' }).catch(console.error);
    }
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[360px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            <div className="bg-[#03045E] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTodo size={20} className="text-[#00B4D8]" />
                <h3 className="font-bold text-sm tracking-wide">Daily Follow-up Tasks</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={addTask} className="p-4 border-b border-slate-100 bg-slate-50 space-y-3">
              <input
                type="text"
                placeholder="What needs to be done today?"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6]"
              />
              
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0077B6] cursor-pointer bg-white"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                  
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0077B6] cursor-pointer bg-white"
                  >
                    {AVAILABLE_ROLES.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>

                {selectedRole !== 'self' && (
                  <div className="flex gap-2">
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0077B6] cursor-pointer bg-blue-50 text-blue-800"
                    >
                      {teamMembers.length === 0 ? (
                        <option value="">No members found</option>
                      ) : (
                        teamMembers.map(member => (
                          <option key={member.id} value={member.id}>{member.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!newTaskText.trim() || isAdding || (selectedRole !== 'self' && !selectedUserId)}
                className="w-full flex items-center justify-center gap-1 bg-[#0077B6] text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-[#023E8A] transition-colors disabled:opacity-50 mt-1"
              >
                <Plus size={14} /> {selectedRole === 'self' ? 'Add Task' : 'Push Task'}
              </button>
            </form>

            <div className="flex-1 overflow-y-auto p-2 min-h-[200px]" style={{ maxHeight: '300px' }}>
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <CheckSquare size={32} className="mb-2 opacity-50" />
                  <p className="text-sm font-medium">No tasks for today!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {tasks.map(task => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`flex items-start gap-3 p-3 rounded-xl border ${task.completed ? 'bg-slate-50 border-transparent' : 'bg-white border-slate-100 shadow-sm'} group`}
                      >
                        <button
                          onClick={() => toggleTask(task.id, task.completed)}
                          className={`mt-0.5 flex-shrink-0 transition-colors ${task.completed ? 'text-green-500' : 'text-slate-300 hover:text-[#00B4D8]'}`}
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'} break-words`}>
                            {task.text}
                          </p>
                          <div className="flex items-center flex-wrap gap-2 mt-1.5">
                            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${task.completed ? 'opacity-50' : ''} ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            {task.creator && task.creator.name !== user?.name && (
                              <span className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                <User size={10} /> from {task.creator.name}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                          title="Delete task"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {tasks.length > 0 && (
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {tasks.filter(t => !t.completed).length} remaining
                </span>
                <div className="flex gap-2">
                  {tasks.some(t => t.completed) && (
                    <button onClick={clearCompleted} className="text-slate-500 hover:text-slate-700 font-medium">
                      Clear Done
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#0077B6] text-white shadow-lg flex items-center justify-center hover:bg-[#023E8A] transition-colors relative"
      >
        <ListTodo size={24} />
        {tasks.filter(t => !t.completed).length > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold">
            {tasks.filter(t => !t.completed).length}
          </span>
        )}
      </motion.button>
    </div>
  );
}

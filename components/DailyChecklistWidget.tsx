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
  ListTodo
} from 'lucide-react';

type Priority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  text: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
}

export default function DailyChecklistWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('gojobsync_daily_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse tasks', e);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('gojobsync_daily_tasks', JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      text: newTaskText.trim(),
      priority,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to delete all daily tasks?')) {
      setTasks([]);
    }
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[340px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
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

            {/* Input Form */}
            <form onSubmit={addTask} className="p-4 border-b border-slate-100 bg-slate-50 space-y-3">
              <input
                type="text"
                placeholder="What needs to be done today?"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6]"
              />
              <div className="flex items-center gap-2">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="flex-1 px-2 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0077B6] cursor-pointer"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <button
                  type="submit"
                  disabled={!newTaskText.trim()}
                  className="flex items-center justify-center gap-1 bg-[#0077B6] text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-[#023E8A] transition-colors disabled:opacity-50"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </form>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-2" style={{ maxHeight: '350px' }}>
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
                          onClick={() => toggleTask(task.id)}
                          className={`mt-0.5 flex-shrink-0 transition-colors ${task.completed ? 'text-green-500' : 'text-slate-300 hover:text-[#00B4D8]'}`}
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'} break-words`}>
                            {task.text}
                          </p>
                          <span className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${task.completed ? 'opacity-50' : ''} ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
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

            {/* Footer */}
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
                  <button onClick={clearAll} className="text-red-500 hover:text-red-700 font-medium">
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
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

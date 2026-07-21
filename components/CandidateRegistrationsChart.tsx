'use client';

import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Loader2, Mail, Phone, MapPin, User, Calendar, ShieldAlert } from 'lucide-react';

export default function CandidateRegistrationsChart() {
  const [data, setData] = useState<{ date: string; count: number }[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/candidate-registrations')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then(d => {
        setData(d.chartData);
        setCandidates(d.candidates);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200">
        <p className="text-red-500">Error loading chart: {error}</p>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">Candidate Registrations (Last 30 Days)</h2>
          <p className="text-sm text-slate-500">Total new candidates: <span className="font-semibold text-blue-600">{total}</span></p>
        </div>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(val) => {
                  const date = new Date(val);
                  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
                }}
                minTickGap={20}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(val) => new Date(val).toLocaleDateString()}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <User size={18} className="text-blue-500" />
            Recent Candidate Details
          </h2>
          <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            {candidates.length} Registered
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold border-b border-slate-100">Candidate Info</th>
                <th className="p-4 font-semibold border-b border-slate-100">Location</th>
                <th className="p-4 font-semibold border-b border-slate-100">Password Hash</th>
                <th className="p-4 font-semibold border-b border-slate-100">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No candidates registered in the last 30 days.
                  </td>
                </tr>
              ) : (
                candidates.map((c, i) => (
                  <tr key={c.id || i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-2">
                        {c.name || 'Unknown'}
                        {c.isVerified && <span className="w-2 h-2 rounded-full bg-green-500" title="Verified"></span>}
                      </div>
                      <div className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                        <Mail size={12} /> {c.email}
                      </div>
                      <div className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                        <Phone size={12} /> {c.phone}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {c.location ? (
                        <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-400"/> {c.location}</span>
                      ) : (
                        <span className="text-slate-400 italic">Not specified</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded truncate max-w-[150px]" title={c.password}>
                        <ShieldAlert size={12} className="inline mr-1 text-slate-400" />
                        {c.password}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { Users, Briefcase, Building, DollarSign, Package, FileText } from "lucide-react";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [supportMetrics, setSupportMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then(r => r.json()),
      fetch("/api/admin/support-metrics").then(r => r.json())
    ]).then(([statsData, metricsData]) => {
      setStats(statsData);
      setSupportMetrics(metricsData || []);
    }).catch(e => console.error(e)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0f172a] text-white p-6 rounded-xl shadow-sm relative overflow-hidden">
          <div className="absolute top-3 right-3 opacity-20"><DollarSign className="w-12 h-12" /></div>
          <p className="text-sm font-medium opacity-80 mb-1">Total Users</p>
          <span className="text-3xl font-bold">{stats?.totalUsers || 0}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4"><div className="bg-blue-100 p-3 rounded-lg"><Users className="w-6 h-6 text-blue-600" /></div></div>
          <span className="text-3xl font-bold text-gray-800">{stats?.totalCandidates || 0}</span>
          <p className="text-sm text-gray-500 mt-1">Total Candidates</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4"><div className="bg-indigo-100 p-3 rounded-lg"><Building className="w-6 h-6 text-[#0077B6]" /></div></div>
          <span className="text-3xl font-bold text-gray-800">{stats?.totalCompanies || 0}</span>
          <p className="text-sm text-gray-500 mt-1">Companies</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4"><div className="bg-emerald-100 p-3 rounded-lg"><Briefcase className="w-6 h-6 text-emerald-600" /></div></div>
          <span className="text-3xl font-bold text-gray-800">{stats?.totalJobs || 0}</span>
          <p className="text-sm text-gray-500 mt-1">Total Jobs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2"><Package size={18} /> Packages</h2>
          <p className="text-3xl font-bold text-gray-800">{stats?.totalPackages || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Active pricing packages</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2"><FileText size={18} /> Invoices</h2>
          <p className="text-3xl font-bold text-gray-800">{stats?.totalInvoices || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Total invoices generated</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users size={18} className="text-[#0077B6]" /> Application Support Performance
          </h2>
          <p className="text-sm text-gray-500 mt-1">Registration emails sent and candidates completed by support staff.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b">
                <th className="p-4 font-semibold">Support Agent</th>
                <th className="p-4 font-semibold">Today</th>
                <th className="p-4 font-semibold">This Week</th>
                <th className="p-4 font-semibold">This Month</th>
                <th className="p-4 font-semibold">Total Completed</th>
              </tr>
            </thead>
            <tbody>
              {supportMetrics.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-500">No application support metrics available.</td></tr>
              ) : (
                supportMetrics.map((m, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.email}</p>
                    </td>
                    <td className="p-4 font-bold text-[#0077B6]">{m.today}</td>
                    <td className="p-4 font-bold text-emerald-600">{m.weekly}</td>
                    <td className="p-4 font-bold text-indigo-600">{m.monthly}</td>
                    <td className="p-4 font-bold text-gray-700">{m.total}</td>
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

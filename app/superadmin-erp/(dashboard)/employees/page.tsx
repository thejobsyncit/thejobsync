"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "admin", department: "" });

  const fetchData = () => { fetch("/api/admin/employees").then(r => r.json()).then(d => { setEmployees(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditId(null); setForm({ name: "", email: "", password: "", phone: "", role: "admin", department: "" }); setShowModal(true); };
  const openEdit = (e: any) => { setEditId(e.id); setForm({ name: e.name, email: e.email, password: "", phone: e.phone, role: e.role, department: e.department || "" }); setShowModal(true); };

  const handleSave = async () => {
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, name: form.name, phone: form.phone, role: form.role, department: form.department, ...(form.password ? { password: form.password } : {}) } : form;
    const res = await fetch("/api/admin/employees", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) { const d = await res.json(); alert(d.message); return; }
    setShowModal(false); fetchData();
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete this employee?")) return; await fetch("/api/admin/employees", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); fetchData(); };

  const roleColors: Record<string, string> = { super_admin: "bg-purple-100 text-purple-700", admin: "bg-blue-100 text-blue-700", recruiter: "bg-green-100 text-green-700", hr: "bg-pink-100 text-pink-700", interviewer: "bg-orange-100 text-orange-700", application_support: "bg-cyan-100 text-cyan-700" };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800"><Plus size={16} /> Add Employee</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b"><tr><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Name</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Email</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Role</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody>
            {employees.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-400">No employees yet</td></tr> : employees.map(e => (
              <tr key={e.id} className="border-b hover:bg-gray-50">
                <td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-xs font-bold">{e.name?.[0]?.toUpperCase()}</div><div><div className="text-sm font-medium text-gray-800">{e.name}</div><div className="text-xs text-gray-400">{e.phone}</div></div></div></td>
                <td className="p-4 text-sm text-gray-600">{e.email}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[e.role] || 'bg-gray-100 text-gray-700'}`}>{e.role}</span></td>
                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${e.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{e.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="p-4"><div className="flex gap-2"><button onClick={() => openEdit(e)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button><button onClick={() => handleDelete(e.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">{editId ? "Edit" : "Add"} Employee</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <div className="space-y-3">
              <input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              {!editId && <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />}
              <input placeholder={editId ? "New Password (leave blank to keep)" : "Password"} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm">
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
                <option value="recruiter">Recruiter</option>
                <option value="hr">HR</option>
                <option value="interviewer">Interviewer</option>
                <option value="application_support">Application Support</option>
              </select>
              <input placeholder="Department (optional)" value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
            </div>
            <div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button><button onClick={handleSave} className="px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium">Save</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

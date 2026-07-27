"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Building2, User, CheckCircle2 } from "lucide-react";

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    packageType: "company",
    price: 0,
    duration: 30,
    jobPosts: 5,
    resumeViews: 50,
    candidateViews: 0,
    features: "",
  });

  const fetchData = () => {
    fetch("/api/admin/packages")
      .then(r => r.json())
      .then(d => { setPackages(Array.isArray(d) ? d : []); setLoading(false); });
  };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm({ name: "", packageType: "company", price: 0, duration: 30, jobPosts: 5, resumeViews: 50, candidateViews: 0, features: "" });
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditId(p.id);
    let featuresStr = "";
    try {
      const parsed = JSON.parse(p.features || "[]");
      featuresStr = Array.isArray(parsed) ? parsed.join("\n") : "";
    } catch { featuresStr = ""; }
    setForm({
      name: p.name,
      packageType: p.packageType || "company",
      price: p.price,
      duration: p.duration,
      jobPosts: p.jobPosts,
      resumeViews: p.resumeViews,
      candidateViews: p.candidateViews || 0,
      features: featuresStr,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const featuresArr = form.features
      .split("\n")
      .map(f => f.trim())
      .filter(Boolean);
    const payload = {
      ...form,
      features: JSON.stringify(featuresArr),
      price: Number(form.price),
      duration: Number(form.duration),
      jobPosts: Number(form.jobPosts),
      resumeViews: Number(form.resumeViews),
      candidateViews: Number(form.candidateViews),
      ...(editId ? { id: editId } : {}),
    };
    const method = editId ? "PUT" : "POST";
    await fetch("/api/admin/packages", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setShowModal(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this package?")) return;
    await fetch("/api/admin/packages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const toggleActive = async (p: any) => {
    await fetch("/api/admin/packages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, isActive: !p.isActive }),
    });
    fetchData();
  };

  const companyPackages = packages.filter(p => p.packageType === "company");
  const candidatePackages = packages.filter(p => p.packageType === "candidate");

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const PackageCard = ({ p }: { p: any }) => {
    let features: string[] = [];
    try { features = JSON.parse(p.features || "[]"); } catch { features = []; }
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{p.name}</h3>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${p.packageType === "company" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
              {p.packageType === "company" ? <Building2 size={10} /> : <User size={10} />}
              {p.packageType === "company" ? "Company" : "Candidate"}
            </span>
          </div>
          <span
            onClick={() => toggleActive(p)}
            className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer select-none ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            title="Click to toggle"
          >
            {p.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <p className="text-3xl font-bold text-[#0f172a]">
          ₹{p.price}<span className="text-sm font-normal text-gray-500">/{p.duration} days</span>
        </p>

        <div className="space-y-1.5 text-sm text-gray-600 border-t pt-3">
          {p.packageType === "company" ? (
            <>
              <p className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> {p.jobPosts} Job Posts</p>
              <p className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> {p.resumeViews} Resume Views</p>
            </>
          ) : (
            <p className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> {p.candidateViews} Company Contacts</p>
          )}
          {features.map((f, i) => (
            <p key={i} className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> {f}</p>
          ))}
        </div>

        <div className="flex gap-2 mt-auto pt-2">
          <button onClick={() => openEdit(p)} className="flex-1 py-2 text-center border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 flex items-center justify-center gap-1">
            <Edit size={13} /> Edit
          </button>
          <button onClick={() => handleDelete(p.id)} className="py-2 px-3 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Packages</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800">
          <Plus size={16} /> Add Package
        </button>
      </div>

      {/* Company Packages */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={18} className="text-blue-600" />
          <h2 className="text-lg font-bold text-gray-700">Company Packages</h2>
          <span className="text-xs text-gray-400">({companyPackages.length})</span>
        </div>
        {companyPackages.length === 0 ? (
          <p className="text-gray-400 text-sm py-4">No company packages yet. Click "Add Package" to create one.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyPackages.map(p => <PackageCard key={p.id} p={p} />)}
          </div>
        )}
      </div>

      {/* Candidate Packages */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-purple-600" />
          <h2 className="text-lg font-bold text-gray-700">Candidate Packages</h2>
          <span className="text-xs text-gray-400">({candidatePackages.length})</span>
        </div>
        {candidatePackages.length === 0 ? (
          <p className="text-gray-400 text-sm py-4">No candidate packages yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidatePackages.map(p => <PackageCard key={p.id} p={p} />)}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 border-b pb-3">
              <h2 className="text-lg font-bold">{editId ? "Edit" : "Add"} Package</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Package Name</label>
                <input
                  placeholder="e.g. Trail Pack, Standard, Pro"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 border rounded-lg text-sm"
                />
              </div>

              {/* Package Type */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Package Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, packageType: "company" })}
                    className={`flex items-center gap-2 p-3 border-2 rounded-xl text-sm font-semibold transition-colors ${form.packageType === "company" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                  >
                    <Building2 size={18} /> Company
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, packageType: "candidate" })}
                    className={`flex items-center gap-2 p-3 border-2 rounded-xl text-sm font-semibold transition-colors ${form.packageType === "candidate" ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                  >
                    <User size={18} /> Candidate
                  </button>
                </div>
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Price (₹)</label>
                  <input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="w-full p-2.5 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Duration (days)</label>
                  <input type="number" min="1" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} className="w-full p-2.5 border rounded-lg text-sm" />
                </div>
              </div>

              {/* Company-specific limits */}
              {form.packageType === "company" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Job Posts Allowed</label>
                    <input type="number" min="0" value={form.jobPosts} onChange={e => setForm({ ...form, jobPosts: Number(e.target.value) })} className="w-full p-2.5 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Resume Views Allowed</label>
                    <input type="number" min="0" value={form.resumeViews} onChange={e => setForm({ ...form, resumeViews: Number(e.target.value) })} className="w-full p-2.5 border rounded-lg text-sm" />
                  </div>
                </div>
              )}

              {/* Candidate-specific limits */}
              {form.packageType === "candidate" && (
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Company Contacts Allowed</label>
                  <input type="number" min="0" value={form.candidateViews} onChange={e => setForm({ ...form, candidateViews: Number(e.target.value) })} className="w-full p-2.5 border rounded-lg text-sm" />
                </div>
              )}

              {/* Custom Features */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Features / Bullet Points
                  <span className="font-normal ml-1 text-gray-400">(one per line)</span>
                </label>
                <textarea
                  placeholder={"e.g.\nDetailed job description\nSEO boost & branding\nValid 30 days"}
                  value={form.features}
                  onChange={e => setForm({ ...form, features: e.target.value })}
                  rows={5}
                  className="w-full p-2.5 border rounded-lg text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-3 border-t">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-semibold hover:bg-slate-800">
                {editId ? "Update Package" : "Create Package"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

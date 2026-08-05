"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "", excerpt: "", author: "", status: "draft", coverImage: "" });

  const fetchData = () => { fetch("/api/admin/blog").then(r => r.json()).then(d => { setPosts(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditId(null); setForm({ title: "", content: "", excerpt: "", author: "", status: "draft", coverImage: "" }); setShowModal(true); };
  const openEdit = (p: any) => { setEditId(p.id); setForm({ title: p.title, content: p.content, excerpt: p.excerpt || "", author: p.author, status: p.status, coverImage: p.coverImage || "" }); setShowModal(true); };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;
    await fetch("/api/admin/blog", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowModal(false); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch("/api/admin/blog", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchData();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blog Posts</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800"><Plus size={16} /> New Post</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.length === 0 ? (
          <p className="col-span-full text-center text-gray-400 py-8">No blog posts yet</p>
        ) : posts.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-800 text-sm">{p.title}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{p.excerpt || p.content}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-400">By {p.author}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={14} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{editId ? "Edit Post" : "New Post"}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <input placeholder="Author" value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <input placeholder="Excerpt (short summary)" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Cover Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2.5 border rounded-lg text-sm bg-gray-50 cursor-pointer" />
                {form.coverImage && (
                  <div className="mt-2 relative inline-block">
                    <img src={form.coverImage} alt="Cover Preview" className="h-24 w-auto object-cover rounded border" />
                    <button type="button" onClick={() => setForm({...form, coverImage: ""})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm"><X size={14}/></button>
                  </div>
                )}
              </div>
              <textarea placeholder="Content..." rows={6} value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm resize-none" />
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium">{editId ? "Update" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

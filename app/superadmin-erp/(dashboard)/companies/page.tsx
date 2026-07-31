"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, Search, X, Eye, Upload, FileText, CheckSquare, Square, ChevronLeft, ChevronRight, Mail, Send, Loader2 } from "lucide-react";
import { read, utils } from "xlsx";

const getCompanyWhatsAppLink = (name: string, phone: string) => {
  let cleanPhone = phone?.toString().replace(/[^0-9]/g, '') || '';
  if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }
  const msg = `Hi ${name || 'there'},

Are you looking to hire top talent quickly and effortlessly? 

We invite you to join GoJobSync, the fastest-growing job portal connecting companies with pre-verified candidates across multiple industries. 

By registering on our employer portal, you can post unlimited job vacancies and get direct access to thousands of active job seekers—completely hassle-free.

👉 Register & Post Jobs Now: www.gojobsync.com/employer/register

Let us know if you'd like a quick demo or assistance setting up your account.

Best Regards,
GoJobSync Team
🌐 www.gojobsync.com`;
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
};

export default function SACompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Tabs & Pagination
  const [sourceTab, setSourceTab] = useState<'all' | 'posted' | 'excel_upload'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Forms
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ companyName: "", contactPerson: "", email: "", phone: "", address: "", industry: "", website: "", status: "active" });
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ uploaded: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mail Modal
  const [mailModal, setMailModal] = useState<any>(null);
  const [sendingMail, setSendingMail] = useState(false);
  const [bulkMailProgress, setBulkMailProgress] = useState<{ total: number; sent: number; failed: number } | null>(null);

  const fetchData = () => { 
    setLoading(true);
    fetch("/api/admin/companies").then(r => r.json()).then(d => { 
      setCompanies(Array.isArray(d) ? d : []); 
      setLoading(false); 
    }).catch(() => setLoading(false)); 
  };
  
  useEffect(() => { fetchData(); }, []);

  // Filtering
  const filtered = companies.filter(c => {
    const matchesSearch = c.companyName?.toLowerCase().includes(search.toLowerCase()) || 
                          c.email?.toLowerCase().includes(search.toLowerCase()) || 
                          c.phone?.includes(search);
    if (!matchesSearch) return false;
    
    if (sourceTab === 'posted') return c.source !== 'excel_upload';
    if (sourceTab === 'excel_upload') return c.source === 'excel_upload';
    if (sourceTab === 'all') return c.source === 'excel_upload';
    return true;
  });

  const isExcelView = sourceTab === 'all' || sourceTab === 'excel_upload';

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sourceTab]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedCompanies = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Actions
  const openAdd = () => { setEditId(null); setForm({ companyName: "", contactPerson: "", email: "", phone: "", address: "", industry: "", website: "", status: "active" }); setShowModal(true); };
  const openEdit = (c: any) => { setEditId(c.id); setForm({ companyName: c.companyName, contactPerson: c.contactPerson, email: c.email, phone: c.phone, address: c.address, industry: c.industry, website: c.website || "", status: c.status }); setShowModal(true); };

  const handleSave = async () => {
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : { ...form, source: "posted" };
    await fetch("/api/admin/companies", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowModal(false); 
    fetchData();
  };

  const handleDeleteOne = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this company?")) return;
    await fetch("/api/admin/companies", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchData();
    setSelectedIds(selectedIds.filter(item => item !== id));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected companies?`)) return;
    const res = await fetch("/api/admin/companies/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds })
    });
    if (res.ok) {
      setSelectedIds([]);
      fetchData();
    } else {
      alert("Failed to delete selected companies");
    }
  };

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(c => c.id));
    }
  };

  const handleSelectCurrentPage = () => {
    const currentPageIds = paginatedCompanies.map((c: any) => c.id);
    const alreadyAllSelected = currentPageIds.every((id: string) => selectedIds.includes(id)) && currentPageIds.length > 0;
    if (alreadyAllSelected) {
      setSelectedIds(selectedIds.filter((id: string) => !currentPageIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedIds, ...currentPageIds]));
      setSelectedIds(merged);
    }
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Excel Upload Logic
  const downloadSampleTemplate = () => {
    const headers = ['Company Name', 'Contact Person', 'Email', 'Phone', 'Address', 'Industry', 'Website'];
    const csvContent = headers.join(',') + '\n' + ['Example Corp', 'John Doe', 'hr@example.com', '9876543210', '123 Main St, NY', 'IT Services', 'www.example.com'].join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'GoJobSync_Companies_Template.csv';
    link.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingExcel(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = event.target?.result;
        if (!data) return;
        const workbook = read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        const rows: any[][] = utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        
        let headerRowIndex = 0;
        let bestHeaders: string[] = [];

        // Simple header detection
        for (let i = 0; i < Math.min(10, rows.length); i++) {
          const row = rows[i];
          const headers = row.map(cell => String(cell).toLowerCase().replace(/[^a-z0-9]/g, ''));
          if (headers.some(h => h.includes('company') || h.includes('name'))) {
            headerRowIndex = i;
            bestHeaders = headers;
            break;
          }
        }

        const companiesPayload = [];
        for (let i = headerRowIndex + 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.every(cell => !String(cell).trim())) continue;

          let companyName = '', contactPerson = '', email = '', phone = '', address = '', industry = '', website = '', notes = '';

          bestHeaders.forEach((norm, colIndex) => {
            const strVal = String(row[colIndex] || '').trim();
            if (!strVal) return;
            
            if (!companyName && norm.includes('companyname')) companyName = strVal;
            else if (!contactPerson && (norm.includes('hrname') || norm.includes('contactperson') || norm.includes('hr') || norm === 'person' || norm === 'name')) contactPerson = strVal;
            else if (!email && (norm.includes('email') || norm.includes('mailid') || norm.includes('mail'))) email = strVal;
            else if (!phone && (norm.includes('contactno') || norm.includes('contact') || norm.includes('phone') || norm.includes('mobile') || norm.includes('number'))) phone = strVal;
            else if (!address && (norm.includes('location') || norm.includes('address') || norm.includes('city'))) address = strVal;
            else if (!industry && (norm.includes('companytype') || norm.includes('industry') || norm.includes('sector') || norm.includes('domain'))) industry = strVal;
            else if (!website && (norm.includes('website') || norm.includes('url') || norm.includes('link'))) website = strVal;
            else if (!notes && (norm.includes('openingdetails') || norm.includes('opening') || norm.includes('details') || norm.includes('notes') || norm.includes('description'))) notes = strVal;
          });

          if (companyName || email || phone) {
            companiesPayload.push({
              companyName: companyName || 'NA',
              contactPerson: contactPerson || 'NA',
              email: email || `noemail-${companyName?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0,10)}@example.com`,
              phone: phone || 'NA',
              address: address || 'NA',
              industry: industry || 'NA',
              website: website || 'NA',
              notes: notes || 'NA',
              status: 'active',
              source: 'excel_upload'
            });
          }
        }

        const totalRecords = companiesPayload.length;
        setUploadProgress({ uploaded: 0, total: totalRecords });
        
        const chunkSize = 200;
        let successCount = 0;

        for (let i = 0; i < totalRecords; i += chunkSize) {
          const chunk = companiesPayload.slice(i, i + chunkSize);
          const res = await fetch("/api/admin/companies/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ companies: chunk })
          });

          if (res.ok) {
            const resData = await res.json();
            successCount += resData.count;
            setUploadProgress({ uploaded: successCount, total: totalRecords });
          } else {
            const err = await res.json();
            throw new Error(err.error || `Failed at chunk ${i / chunkSize + 1}`);
          }
        }

        alert(`✅ Successfully uploaded ${successCount} companies from Excel!`);
        setShowExcelModal(false);
        fetchData();

      } catch (err: any) {
        alert("Error reading Excel file: " + err.message);
      } finally {
        setUploadingExcel(false);
        setUploadProgress({ uploaded: 0, total: 0 });
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Email logic
  const handleOpenMailModal = (c: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setMailModal({
      companyId: c.id,
      name: c.contactPerson && c.contactPerson !== 'NA' ? c.contactPerson : 'Team',
      companyName: c.companyName,
      fromEmail: 'hr@gojobsync.com',
      toEmail: c.email?.startsWith('noemail-') ? '' : c.email,
      subject: 'Partnership Opportunities with GoJobSync',
      message: `Hi ${c.contactPerson && c.contactPerson !== 'NA' ? c.contactPerson : 'Team'} at ${c.companyName},

Are you looking to hire top talent quickly and effortlessly?

We invite you to join GoJobSync, the fastest-growing job portal connecting companies with pre-verified candidates across multiple industries. 

By registering on our employer portal, you can post your job vacancies directly and gain instant access to thousands of active job seekers.

✨ Why post your jobs on GoJobSync?
- 🚀 Faster hiring cycle with direct candidate applications
- 🔍 Access to pre-screened and verified candidate profiles
- 🎯 Advanced matching to find the exact skills you need
- 🤝 Dedicated account support for your recruitment drives

Take control of your hiring process today. It takes less than 2 minutes to create your company profile and post your first job.

👉 Register & Post Jobs Now: www.gojobsync.com/employer/register

If you have any questions or would like a quick platform walkthrough, simply reply to this email!

Best Regards,
GoJobSync Recruitment Team
🌐 www.gojobsync.com 
📧 hr@gojobsync.com`
    });
  };

  const handleSendMail = async () => {
    if (mailModal.isBulk) {
      setSendingMail(true);
      const total = mailModal.targetCompanies.length;
      setBulkMailProgress({ total, sent: 0, failed: 0 });
      let sentCount = 0;
      let failedCount = 0;

      for (const comp of mailModal.targetCompanies) {
        try {
          const payload = {
            companyId: comp.id,
            name: comp.contactPerson && comp.contactPerson !== 'NA' ? comp.contactPerson : 'Team',
            companyName: comp.companyName,
            fromEmail: 'hr@gojobsync.com',
            toEmail: comp.email,
            subject: mailModal.subject,
            message: `Hi ${comp.contactPerson && comp.contactPerson !== 'NA' ? comp.contactPerson : 'Team'} at ${comp.companyName},\n\n${mailModal.message}`
          };
          
          const res = await fetch('/api/support/send-company-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          if (res.ok) sentCount++;
          else failedCount++;
        } catch (e) {
          failedCount++;
        }
        setBulkMailProgress({ total, sent: sentCount, failed: failedCount });
      }
      
      setSendingMail(false);
      alert(`Bulk email completed!\n✅ Sent: ${sentCount}\n❌ Failed: ${failedCount}`);
      setMailModal(null);
      setBulkMailProgress(null);
      setSelectedIds([]);
      fetchData();
      return;
    }

    if (!mailModal.toEmail) {
      alert('Please provide a valid email address');
      return;
    }
    setSendingMail(true);
    try {
      const res = await fetch('/api/support/send-company-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mailModal)
      });
      if (res.ok) {
        alert('✅ Email sent successfully!');
        setMailModal(null);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to send email');
      }
    } catch (e) {
      alert('Error sending email');
    } finally {
      setSendingMail(false);
    }
  };

  if (loading) return <div className="p-8 text-center flex flex-col items-center justify-center min-h-[60vh] text-slate-500"><Loader2 className="animate-spin w-8 h-8 text-[#0077B6] mb-4" />Loading companies...</div>;

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto bg-[#f8fafc] min-h-screen">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Companies Management</h1>
          <p className="text-slate-500 mt-1">Manage partner companies, upload Excel dumps, and manage contact data</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={downloadSampleTemplate} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-bold hover:bg-blue-100 transition shadow-sm">
            <FileText size={16} /> Sample Template
          </button>
          <button onClick={() => setShowExcelModal(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition shadow-sm">
            <Upload size={16} /> Upload Excel
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition shadow-sm">
            <Plus size={16} /> Add Company
          </button>
        </div>
      </div>

      {/* Toolbar & Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 mb-6 flex flex-col xl:flex-row items-center gap-4 sticky top-4 z-20">
        
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full xl:w-auto bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          <button 
            onClick={() => setSourceTab('all')} 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${sourceTab === 'all' ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            All ({companies.length})
          </button>
          <button 
            onClick={() => setSourceTab('posted')} 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${sourceTab === 'posted' ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            Companies Posted ({companies.filter(c => c.source !== 'excel_upload').length})
          </button>
          <button 
            onClick={() => setSourceTab('excel_upload')} 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${sourceTab === 'excel_upload' ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            Excel Uploads ({companies.filter(c => c.source === 'excel_upload').length})
          </button>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-3 w-full xl:w-auto border-t xl:border-t-0 xl:border-l border-slate-200 pt-3 xl:pt-0 xl:pl-4">
          <button
            onClick={handleSelectCurrentPage}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
              paginatedCompanies.length > 0 && paginatedCompanies.every(c => selectedIds.includes(c.id)) 
                ? 'bg-orange-500 text-white shadow-sm hover:bg-orange-600' 
                : 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200'
            }`}
          >
            {paginatedCompanies.length > 0 && paginatedCompanies.every(c => selectedIds.includes(c.id)) ? <CheckSquare size={16} /> : <Square size={16} />}
            Select This Page ({paginatedCompanies.length})
          </button>

          {selectedIds.length > 0 && (
            <>
              <button
                onClick={() => {
                  const validCompanies = filtered.filter(c => selectedIds.includes(c.id) && c.email && !c.email.startsWith('noemail-'));
                  if (validCompanies.length === 0) {
                    alert("None of the selected companies have a valid email address.");
                    return;
                  }
                  setMailModal({
                    isBulk: true,
                    targetCompanies: validCompanies,
                    subject: 'Partnership Opportunities with GoJobSync',
                    message: `Are you looking to hire top talent quickly and effortlessly?\n\nWe invite you to join GoJobSync, the fastest-growing job portal connecting companies with pre-verified candidates across multiple industries. \n\nBy registering on our employer portal, you can post your job vacancies directly and gain instant access to thousands of active job seekers.\n\n✨ Why post your jobs on GoJobSync?\n- 🚀 Faster hiring cycle with direct candidate applications\n- 🔍 Access to pre-screened and verified candidate profiles\n- 🎯 Advanced matching to find the exact skills you need\n- 🤝 Dedicated account support for your recruitment drives\n\nTake control of your hiring process today. It takes less than 2 minutes to create your company profile and post your first job.\n\n👉 Register & Post Jobs Now: www.gojobsync.com/employer/register\n\nIf you have any questions or would like a quick platform walkthrough, simply reply to this email!\n\nBest Regards,\nGoJobSync Recruitment Team\n🌐 www.gojobsync.com \n📧 hr@gojobsync.com`
                  });
                }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded-lg text-sm font-bold transition"
              >
                <Mail size={16} /> Bulk Email ({selectedIds.length})
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-lg text-sm font-bold transition"
              >
                <Trash2 size={16} /> Delete ({selectedIds.length})
              </button>
            </>
          )}
        </div>

        {/* Search */}
        <div className="flex-1 w-full xl:w-auto relative border-t xl:border-t-0 xl:border-l border-slate-200 pt-3 xl:pt-0 xl:pl-4">
          <Search className="absolute left-3 xl:left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search name, email, phone..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-transparent transition-shadow bg-slate-50 focus:bg-white" 
          />
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 w-12 text-center border-r border-slate-100">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-slate-600 transition" title="Select/Deselect All Filtered">
                    {selectedIds.length > 0 && selectedIds.length === filtered.length ? <CheckSquare size={18} className="text-[#0077B6]" /> : <Square size={18} />}
                  </button>
                </th>
                {isExcelView ? (
                  <>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">Company Name</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">HR Name</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">Contact No</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">Email ID</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">Company type</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">Location</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">Websites</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">Opening details</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-right whitespace-nowrap">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">Company Info</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">Contact Person</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">Industry / Status</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">Source</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 whitespace-nowrap">Communication</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-right whitespace-nowrap">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedCompanies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search size={48} className="mb-4 opacity-20" />
                      <p className="text-lg font-bold text-slate-600">No companies found</p>
                      <p className="text-sm">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCompanies.map((c) => (
                  <tr 
                    key={c.id} 
                    onClick={(e) => handleSelectRow(c.id, e)}
                    className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer group ${selectedIds.includes(c.id) ? 'bg-blue-50/50 hover:bg-blue-50' : ''}`}
                  >
                    <td className="p-4 text-center border-r border-slate-100">
                      <div className={`transition-transform ${selectedIds.includes(c.id) ? 'scale-110 text-[#0077B6]' : 'text-slate-300 group-hover:text-slate-400'}`}>
                        {selectedIds.includes(c.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                      </div>
                    </td>
                    {isExcelView ? (
                      <>
                        <td className="p-4 text-sm font-semibold text-slate-800">{c.companyName || 'NA'}</td>
                        <td className="p-4 text-sm text-slate-700">{c.contactPerson && c.contactPerson !== 'NA' ? c.contactPerson : 'NA'}</td>
                        <td className="p-4 text-sm text-slate-700">{c.phone && c.phone !== 'NA' ? c.phone : 'NA'}</td>
                        <td className="p-4 text-sm text-slate-700">{c.email && c.email !== 'NA' && !c.email.startsWith('noemail-') ? c.email : 'NA'}</td>
                        <td className="p-4 text-sm text-slate-700">{c.industry && c.industry !== 'NA' ? c.industry : 'NA'}</td>
                        <td className="p-4 text-sm text-slate-700">{c.address && c.address !== 'NA' ? c.address : 'NA'}</td>
                        <td className="p-4 text-sm text-slate-700">
                          {c.website && c.website !== 'NA' ? (
                            <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" onClick={e => e.stopPropagation()}>{c.website}</a>
                          ) : 'NA'}
                        </td>
                        <td className="p-4 text-sm text-slate-700 max-w-[200px] truncate" title={c.notes && c.notes !== 'NA' ? c.notes : 'NA'}>{c.notes && c.notes !== 'NA' ? c.notes : 'NA'}</td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={(e) => handleOpenMailModal(c, e)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Send Mail">
                              <Mail size={18} />
                            </button>
                            <a href={getCompanyWhatsAppLink(c.contactPerson && c.contactPerson !== 'NA' ? c.contactPerson : c.companyName, c.phone)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="WhatsApp">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                              </svg>
                            </a>
                            <button onClick={() => setSelectedCompany(c)} className="p-2 text-slate-400 hover:text-[#0077B6] hover:bg-blue-50 rounded-lg transition" title="View details">
                              <Eye size={18} />
                            </button>
                            <button onClick={(e) => handleDeleteOne(c.id, e)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete company">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm">{c.companyName}</span>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                              <span className="truncate max-w-[200px]" title={c.email}>{c.email}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span>{c.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-semibold text-slate-700">{c.contactPerson || 'NA'}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1.5 items-start">
                            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">{c.industry}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap ${c.source === 'excel_upload' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                            {c.source === 'excel_upload' ? 'Excel Upload' : 'Manually Posted'}
                          </span>
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                           <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => handleOpenMailModal(c, e)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition"
                            >
                              <Mail size={14} /> Mail
                            </button>
                            <a 
                              href={getCompanyWhatsAppLink(c.contactPerson && c.contactPerson !== 'NA' ? c.contactPerson : c.companyName, c.phone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                              </svg> WhatsApp
                            </a>
                           </div>
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => setSelectedCompany(c)} className="p-2 text-slate-400 hover:text-[#0077B6] hover:bg-blue-50 rounded-lg transition" title="View details">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => openEdit(c)} className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition" title="Edit company">
                              <Edit size={18} />
                            </button>
                            <button onClick={(e) => handleDeleteOne(c.id, e)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete company">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
            <span className="text-sm font-medium text-slate-500">
              Showing <strong className="text-slate-800">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to <strong className="text-slate-800">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</strong> of <strong className="text-slate-800">{filtered.length}</strong> entries
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent transition"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition ${currentPage === i + 1 ? 'bg-[#0077B6] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800">{editId ? "Edit Company" : "Add New Company"}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition"><X size={20} /></button>
            </div>
            
            <div className="space-y-4 overflow-y-auto px-1 flex-1 custom-scrollbar">
              <div><label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Company Name *</label><input type="text" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#0077B6] outline-none transition" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Contact Person</label><input type="text" value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#0077B6] outline-none transition" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Email *</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#0077B6] outline-none transition" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Phone</label><input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#0077B6] outline-none transition" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Industry</label><input type="text" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#0077B6] outline-none transition" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Address</label><textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#0077B6] outline-none transition" rows={3}></textarea></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Website (Optional)</label><input type="text" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#0077B6] outline-none transition" /></div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#0077B6] outline-none transition">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 text-sm font-bold text-white bg-[#0077B6] rounded-xl hover:bg-[#023E8A] transition shadow-md">{editId ? 'Save Changes' : 'Add Company'}</button>
            </div>
          </div>
        </div>
      )}

      {/* --- EXCEL UPLOAD MODAL --- */}
      {showExcelModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative text-center">
            <button onClick={() => !uploadingExcel && setShowExcelModal(false)} className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 p-2 rounded-full transition"><X size={20} /></button>
            
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText size={32} />
            </div>
            
            <h2 className="text-xl font-bold text-slate-800 mb-2">Upload Companies via Excel</h2>
            <p className="text-sm text-slate-500 mb-8 px-4">Upload an `.xlsx` file containing company data. Ensure columns like Name, Email, and Phone exist.</p>
            
            <input 
              type="file" 
              accept=".xlsx,.xls,.csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            
            {!uploadingExcel ? (
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-md"
              >
                <Upload size={18} /> Select File & Upload
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold">
                  <Loader2 className="animate-spin" size={20} /> Processing...
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300 rounded-full" 
                    style={{ width: `${uploadProgress.total > 0 ? (uploadProgress.uploaded / uploadProgress.total) * 100 : 5}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 font-medium">{uploadProgress.uploaded} of {uploadProgress.total} companies imported</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- EMAIL MODAL --- */}
      {mailModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Mail className="text-blue-600" /> {mailModal.isBulk ? `Bulk Email (${mailModal.targetCompanies.length} Companies)` : `Send Email to ${mailModal.companyName}`}
              </h2>
              <button onClick={() => !sendingMail && setMailModal(null)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition"><X size={20} /></button>
            </div>

            <div className="space-y-4 overflow-y-auto px-1 flex-1 custom-scrollbar">
              {!mailModal.isBulk && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">To</label>
                  <input 
                    type="email" 
                    value={mailModal.toEmail} 
                    onChange={e => setMailModal({ ...mailModal, toEmail: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#0077B6] outline-none transition" 
                    placeholder="Company Email Address"
                    disabled={sendingMail}
                  />
                </div>
              )}
              {mailModal.isBulk && (
                <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-sm font-medium border border-blue-100">
                  You are about to send this template to <strong>{mailModal.targetCompanies.length}</strong> companies. (Invalid emails like 'noemail-' were skipped).
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Subject</label>
                <input 
                  type="text" 
                  value={mailModal.subject} 
                  onChange={e => setMailModal({ ...mailModal, subject: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#0077B6] outline-none transition" 
                  disabled={sendingMail}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Message</label>
                <textarea 
                  value={mailModal.message} 
                  onChange={e => setMailModal({ ...mailModal, message: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#0077B6] outline-none transition font-mono whitespace-pre-wrap" 
                  rows={14}
                  disabled={sendingMail}
                ></textarea>
              </div>

              {bulkMailProgress && (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700">
                    <span>Sending Progress</span>
                    <span>{bulkMailProgress.sent + bulkMailProgress.failed} / {bulkMailProgress.total}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                    <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(bulkMailProgress.sent / bulkMailProgress.total) * 100}%` }}></div>
                    <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${(bulkMailProgress.failed / bulkMailProgress.total) * 100}%` }}></div>
                  </div>
                  <div className="flex gap-4 text-xs font-semibold">
                    <span className="text-emerald-600">✅ {bulkMailProgress.sent} Sent</span>
                    {bulkMailProgress.failed > 0 && <span className="text-red-600">❌ {bulkMailProgress.failed} Failed</span>}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => !sendingMail && setMailModal(null)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition" disabled={sendingMail}>Cancel</button>
              <button 
                onClick={handleSendMail} 
                disabled={sendingMail}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-md disabled:opacity-70"
              >
                {sendingMail ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {sendingMail ? 'Sending...' : (mailModal.isBulk ? 'Send to All' : 'Send Email')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- VIEW COMPANY MODAL --- */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-800">Company Details</h2>
              <button onClick={() => setSelectedCompany(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">{selectedCompany.companyName}</h3>
                <div className="flex items-center gap-3">
                  <p className="text-slate-500 text-sm font-medium">{selectedCompany.industry}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedCompany.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selectedCompany.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Contact Person</span>
                  <span className="text-sm font-bold text-slate-800">{selectedCompany.contactPerson || 'NA'}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Source</span>
                  <span className="text-sm font-bold text-slate-800">{selectedCompany.source === 'excel_upload' ? 'Excel Upload' : 'Manually Posted'}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</span>
                  <span className="text-sm font-bold text-slate-800">{selectedCompany.email}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone</span>
                  <span className="text-sm font-bold text-slate-800">{selectedCompany.phone || 'NA'}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl col-span-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Address</span>
                  <span className="text-sm font-bold text-slate-800">{selectedCompany.address || 'NA'}</span>
                </div>
                {selectedCompany.website && (
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl col-span-2">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">Website</span>
                    <a href={selectedCompany.website.startsWith('http') ? selectedCompany.website : `https://${selectedCompany.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">
                      {selectedCompany.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => { openEdit(selectedCompany); setSelectedCompany(null); }} className="px-5 py-2.5 text-sm font-bold text-white bg-[#0077B6] rounded-xl hover:bg-[#023E8A] flex items-center gap-2 transition shadow-md"><Edit size={16} /> Edit Company</button>
              <button onClick={() => setSelectedCompany(null)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

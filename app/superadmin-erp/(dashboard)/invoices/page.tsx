"use client";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { generateInvoicePdf } from "@/lib/generateInvoicePdf";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => { fetch("/api/admin/invoices").then(r => r.json()).then(d => { setInvoices(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string, type?: string) => {
    await fetch("/api/admin/invoices", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status, type }) });
    fetchData();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const exportToCSV = () => {
    if (invoices.length === 0) return;
    const headers = ['Invoice #', 'Company', 'Email', 'Package', 'Amount', 'GST', 'Total Amount', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...invoices.map(i => [
        i.invoiceNumber,
        `"${i.type}"`,
        `"${i.clientName}"`,
        `"${i.email}"`,
        `"${i.packageName}"`,
        i.amount,
        i.gstAmount,
        i.totalAmount,
        i.status,
        new Date(i.paidAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
        >
          <Download size={16} /> Export to Excel
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b"><tr><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Invoice #</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Type</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Client Name</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Package</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Amount</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody>
            {invoices.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-gray-400">No invoices yet</td></tr> : invoices.map(i => (
              <tr key={i.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm font-mono font-medium text-gray-800">{i.invoiceNumber}</td>
                <td className="p-4 text-sm text-gray-600"><span className={`px-2 py-1 rounded-full text-xs font-medium ${i.type === 'Candidate' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{i.type}</span></td>
                <td className="p-4 text-sm text-gray-600 font-medium">{i.clientName}</td>
                <td className="p-4 text-sm text-gray-600">{i.packageName}</td>
                <td className="p-4 text-sm font-semibold text-gray-800">₹{i.totalAmount}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${i.status === 'paid' ? 'bg-green-100 text-green-700' : i.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{i.status}</span></td>
                <td className="p-4">
                  <div className="flex gap-2 items-center">
                    {i.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(i.id, "paid", i.type)} className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100">Mark Paid</button>
                        <button onClick={() => updateStatus(i.id, "cancelled", i.type)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100">Cancel</button>
                      </>
                    )}
                    <button 
                      onClick={() => generateInvoicePdf(i)} 
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 flex items-center gap-1"
                    >
                      <Download size={14} /> PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

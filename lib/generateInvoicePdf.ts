import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceData {
  invoiceNumber: string;
  companyName?: string;
  clientName?: string;
  type?: string;
  email: string;
  packageName: string;
  amount: number;
  gstAmount: number;
  totalAmount: number;
  status: string;
  paidAt?: string | Date;
}

export const generateInvoicePdf = (invoice: InvoiceData) => {
  const doc = new jsPDF();

  // The jobsync Logo/Header
  doc.setFontSize(22);
  doc.setTextColor(0, 119, 182); // #0077B6
  doc.setFont('helvetica', 'bold');
  doc.text('The jobsync', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.type === 'Candidate' ? 'Candidate Portal' : 'Employer Portal', 14, 26);
  doc.text('Email: info@thejobsync.com', 14, 32);

  // Invoice Title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', 140, 20);

  // Invoice Details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 140, 30);
  const dateStr = invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : new Date().toLocaleDateString();
  doc.text(`Date: ${dateStr}`, 140, 36);
  doc.text(`Status: ${invoice.status.toUpperCase()}`, 140, 42);

  // Billed To
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Billed To:', 14, 55);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${invoice.type === 'Candidate' ? 'Name' : 'Company'}: ${invoice.clientName || invoice.companyName}`, 14, 62);
  doc.text(`Email: ${invoice.email}`, 14, 68);

  // Table
  autoTable(doc, {
    startY: 85,
    head: [['Description', 'Base Amount', 'GST (18%)', 'Total']],
    body: [
      [`Package: ${invoice.packageName}`, `Rs. ${invoice.amount.toFixed(2)}`, `Rs. ${invoice.gstAmount.toFixed(2)}`, `Rs. ${invoice.totalAmount.toFixed(2)}`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 119, 182], textColor: 255 },
    styles: { fontSize: 10, cellPadding: 6 }
  });

  // Footer / Total
  const finalY = (doc as any).lastAutoTable.finalY || 110;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Paid: Rs. ${invoice.totalAmount.toFixed(2)}`, 140, finalY + 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for choosing The jobsync!', 14, finalY + 30);
  doc.text('This is a computer-generated invoice and does not require a signature.', 14, finalY + 36);

  // Save the PDF
  doc.save(`${invoice.invoiceNumber}.pdf`);
};

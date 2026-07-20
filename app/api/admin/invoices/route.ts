import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const employerInvoices = await (prisma as any).invoice.findMany({ orderBy: { createdAt: 'desc' } });
    const candidateInvoices = await (prisma as any).candidateInvoice.findMany({ orderBy: { createdAt: 'desc' } });
    
    const normalizedEmployerInvoices = employerInvoices.map((inv: any) => ({
      ...inv,
      type: 'Employer',
      clientName: inv.companyName
    }));
    
    const normalizedCandidateInvoices = candidateInvoices.map((inv: any) => ({
      ...inv,
      type: 'Candidate',
      clientName: inv.candidateName,
      packageName: inv.planName,
      companyName: 'N/A'
    }));

    const invoices = [...normalizedEmployerInvoices, ...normalizedCandidateInvoices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json(invoices);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status, type } = await request.json();
    
    let invoice;
    if (type === 'Candidate') {
      invoice = await (prisma as any).candidateInvoice.update({
        where: { id },
        data: { status, ...(status === 'paid' ? { paidAt: new Date() } : {}) },
      });
    } else {
      invoice = await (prisma as any).invoice.update({
        where: { id },
        data: { status, ...(status === 'paid' ? { paidAt: new Date() } : {}) },
      });
    }

    if (status === 'paid' && invoice.email) {
      prisma.employer.findUnique({
        where: { email: invoice.email }
      }).then(async (emp: any) => {
        if (emp && emp.contactPhone) {
          const { notifyInvoiceSent } = await import('@/lib/whatsapp');
          notifyInvoiceSent(
            emp.contactPhone,
            emp.contactPerson || emp.companyName,
            invoice.invoiceNumber,
            invoice.totalAmount.toString()
          ).catch(console.error);
        }
      }).catch((e: any) => console.error('[WhatsApp] Find employer error for invoice:', e));
    }

    return NextResponse.json(invoice);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { companies } = await request.json();

    if (!companies || !Array.isArray(companies)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    let successCount = 0;

    for (const comp of companies) {
      if (!comp.companyName || !comp.email) continue;
      
      try {
        await prisma.client.create({
          data: {
            companyName: comp.companyName,
            contactPerson: comp.contactPerson || 'NA',
            email: comp.email,
            phone: comp.phone || 'NA',
            address: comp.address || 'NA',
            industry: comp.industry || 'General',
            website: comp.website || '',
            status: 'active',
            source: 'excel_upload'
          }
        });
        successCount++;
      } catch (err: any) {
        // Skip duplicates or invalid entries silently in bulk operations
        console.error(`Failed to create company ${comp.email}:`, err.message);
      }
    }

    return NextResponse.json({ message: 'Bulk upload successful', count: successCount }, { status: 201 });
  } catch (error: any) {
    console.error('Bulk upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

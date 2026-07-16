const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const subs = await prisma.employerSubscription.findMany();
  console.log('Subs:', subs.length);
  console.log(subs);
  const invoices = await prisma.invoice.findMany();
  console.log('Invoices:', invoices.length);
  console.log(invoices);
}
check();

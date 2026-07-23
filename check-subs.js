const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const candidates = await prisma.candidateAccount.findMany({
    include: {
      subscriptions: true,
      invoices: true
    }
  });
  
  for (const c of candidates) {
    if (c.name.toLowerCase().includes('bala') || c.name.toLowerCase().includes('kamesh') || c.email.toLowerCase().includes('bala') || c.email.toLowerCase().includes('kamesh')) {
      console.log(`\nCandidate: ${c.name} (${c.email})`);
      console.log('Subscriptions:', c.subscriptions);
      console.log('Invoices:', c.invoices);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

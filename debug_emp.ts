import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const e = await prisma.employer.findUnique({ where: { id: 'cmrq62xcx0000l704s6jg770h' } });
  console.log('Employer:', e);
}
run().finally(() => prisma.$disconnect());

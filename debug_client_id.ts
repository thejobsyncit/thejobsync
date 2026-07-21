import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const c = await prisma.client.findUnique({ where: { id: 'cmrq8t4e40005i904eqmq89q2' } });
  console.log('Client:', c);
}
run().finally(() => prisma.$disconnect());

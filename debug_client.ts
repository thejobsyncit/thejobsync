import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const req = await prisma.jobRequirement.findUnique({ where: { id: 'cmrq8t53x0007i904j7a4xq5h' } });
  const client = await prisma.client.findUnique({ where: { id: req.clientId } });
  const emp = await prisma.employer.findUnique({ where: { id: 'cmrq62xcx0000l704s6jg770h' } });
  
  console.log('Client Email:', client.email);
  console.log('Employer Email:', emp.email);
}
run().finally(() => prisma.$disconnect());

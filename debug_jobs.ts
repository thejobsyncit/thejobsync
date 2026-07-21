import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const jobs = await prisma.employerJob.findMany({
    where: { title: { contains: 'TECH' } }
  });
  console.log('Employer Jobs:', jobs);

  const reqs = await prisma.jobRequirement.findMany({
    where: { title: { contains: 'TECH' } }
  });
  console.log('Job Requirements:', reqs);
}
run().finally(() => prisma.$disconnect());

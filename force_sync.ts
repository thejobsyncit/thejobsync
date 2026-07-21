import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const job = await prisma.employerJob.findUnique({ where: { id: 'cmrq8t1ie0004i904sc5o1z1v' } });
  
  if (job) {
    await prisma.jobRequirement.updateMany({
      where: { title: job.title },
      data: {
        location: job.location,
        salaryRange: job.salaryRange,
        experience: job.experience,
        description: job.description,
        skills: job.skills
      }
    });
    console.log('Successfully force-synced the TECHINAL SUPPORT job!');
  }
}

run().finally(() => prisma.$disconnect());

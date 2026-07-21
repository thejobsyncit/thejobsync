import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const jobs = await prisma.employerJob.findMany();
  for (const job of jobs) {
    const employer = await prisma.employer.findUnique({ where: { id: job.employerId } });
    if (!employer) continue;
    
    const client = await prisma.client.findFirst({ 
      where: { 
        OR: [
          { email: employer.email },
          { companyName: employer.companyName }
        ]
      } 
    });
    if (!client) continue;

    const requirements = await prisma.jobRequirement.findMany({
      where: { clientId: client.id, title: job.title },
      orderBy: { createdAt: 'desc' },
      take: 1
    });

    if (requirements.length > 0) {
      await prisma.jobRequirement.update({
        where: { id: requirements[0].id },
        data: {
          location: job.location,
          salaryRange: job.salaryRange,
          experience: job.experience,
          skills: job.skills,
          description: job.description
        }
      });
      console.log('Synced Job:', job.title);
    }
  }
}
run().finally(() => prisma.$disconnect());

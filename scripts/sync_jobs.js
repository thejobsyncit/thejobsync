const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const employer = await prisma.employer.findUnique({ where: { email: 'thejobsyncit@gmail.com' } });
  if (!employer) return console.log('no employer');
  
  let client = await prisma.client.findFirst({ where: { email: employer.email } });
  if (!client) {
    client = await prisma.client.create({
      data: {
        companyName: employer.companyName,
        contactPerson: employer.contactPerson || 'HR',
        email: employer.email,
        phone: employer.contactPhone || 'N/A',
        address: employer.address || 'N/A',
        industry: employer.industry || 'Other',
        website: employer.website || '',
        status: 'active'
      }
    });
    console.log('created client', client.id);
  }
  
  const jobs = await prisma.employerJob.findMany({ where: { employerId: employer.id } });
  let count = 0;
  for (const job of jobs) {
    const existingReq = await prisma.jobRequirement.findFirst({ where: { clientId: client.id, title: job.title } });
    if (!existingReq) {
      await prisma.jobRequirement.create({
        data: {
          clientId: client.id,
          title: job.title,
          description: job.description,
          skills: job.skills,
          experience: job.experience,
          positions: job.openings,
          location: job.location,
          salaryRange: job.salaryRange,
          status: 'open',
          priority: 'medium',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }
      });
      count++;
    }
  }
  console.log(`Synced ${count} jobs.`);
}
main().catch(console.error).finally(()=>prisma.$disconnect());

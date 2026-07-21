import { prisma } from './lib/db';

async function fixDb() {
  const emp = await prisma.employer.findUnique({
    where: { id: 'cmrq62xcx0000l704s6jg770h' }
  });
  if (emp) {
    console.log('Updating Employer name to THE JOBSYNC');
    await prisma.employer.update({
      where: { id: emp.id },
      data: { companyName: 'THE JOBSYNC' }
    });
  }

  // Find all requirements and log apps
  const client = await prisma.client.findFirst({ where: { companyName: 'THE JOBSYNC' } });
  if (client) {
    const reqs = await prisma.jobRequirement.findMany({ where: { clientId: client.id } });
    const apps = await prisma.candidateApplication.findMany({
      where: { requirementId: { in: reqs.map(r => r.id) } }
    });
    console.log(`Found ${apps.length} applications for THE JOBSYNC client.`);
  }
}
fixDb();

import { prisma } from './lib/db';

async function testUpdate() {
  const account = await prisma.candidateAccount.findFirst();
  if (!account) return;

  const originalEmail = account.email;
  console.log('Testing with account:', originalEmail);
  
  // Make sure a Candidate exists for this email
  let c = await prisma.candidate.findFirst({ where: { email: originalEmail } });
  if (!c) {
    c = await prisma.candidate.create({
      data: {
        name: account.name,
        email: account.email,
        phone: account.phone,
        skills: account.skills || '[]',
        experience: account.experience || '',
        education: account.education || '',
        status: 'new'
      }
    });
    console.log('Created CRM Candidate for test.');
  }

  // Simulate API route
  const updateData = { name: account.name + ' UPDATED', phone: account.phone + '1' };
  
  const updated = await prisma.candidateAccount.update({
    where: { id: account.id },
    data: updateData
  });
  
  console.log('Did updated contain email?', !!updated.email, updated.email);
  
  if (updated.email) {
    const res = await prisma.candidate.updateMany({
      where: { email: updated.email },
      data: {
        name: updated.name,
        phone: updated.phone
      }
    });
    console.log('CRM Candidate updateMany result:', res);
  }

  const finalC = await prisma.candidate.findFirst({ where: { email: originalEmail } });
  console.log('Final CRM Candidate Name:', finalC?.name);
}
testUpdate();

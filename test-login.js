const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'balavarshini2223@gmail.com';
  const password = 'balaV4@R';

  const account = await prisma.candidateAccount.findUnique({
    where: { email: email.trim().toLowerCase() }
  });

  if (!account || account.password !== password) {
    console.log('Login failed', { accountFound: !!account, passwordMatch: account ? account.password === password : false });
  } else {
    console.log('Login success');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

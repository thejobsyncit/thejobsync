const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ where: { email: { contains: 'abi' } } });
  console.log('Found ' + users.length + ' users:');
  users.forEach(u => console.log(u.email, u.password));
}

main().catch(console.error).finally(() => prisma.$disconnect());

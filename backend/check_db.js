import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.complaint.count();
  console.log(`Total complaints: ${count}`);
  const latest = await prisma.complaint.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  console.log('Latest 5:', JSON.stringify(latest, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

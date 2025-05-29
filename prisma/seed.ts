import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing records
  await prisma.driver.deleteMany();
  await prisma.team.deleteMany();

  // Create teams
  const teams = [
    { name: 'Red Bull Racing' },
    { name: 'Mercedes' },
    { name: 'Ferrari' },
    { name: 'McLaren' },
    { name: 'Aston Martin' },
  ];

  console.log('Seeding database...');

  for (const team of teams) {
    await prisma.team.create({
      data: team
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
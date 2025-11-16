import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@nextstep.com' },
    update: {},
    create: {
      email: 'demo@nextstep.com',
      name: 'Demo User',
    },
  });

  console.log('Created demo user:', demoUser);

  // Create some sample contexts
  const workContext = await prisma.context.upsert({
    where: { id: 'work-context' },
    update: {},
    create: {
      id: 'work-context',
      name: 'Work',
      description: 'Work-related tasks',
      userId: demoUser.id,
    },
  });

  const homeContext = await prisma.context.upsert({
    where: { id: 'home-context' },
    update: {},
    create: {
      id: 'home-context',
      name: 'Home',
      description: 'Personal and home tasks',
      userId: demoUser.id,
    },
  });

  const errands = await prisma.context.upsert({
    where: { id: 'errands-context' },
    update: {},
    create: {
      id: 'errands-context',
      name: 'Errands',
      description: 'Things to do while out',
      userId: demoUser.id,
    },
  });

  console.log('Created sample contexts');

  // Create a sample project
  const sampleProject = await prisma.project.upsert({
    where: { id: 'sample-project' },
    update: {},
    create: {
      id: 'sample-project',
      name: 'Sample Project',
      description: 'A sample GTD project',
      status: 'active',
      userId: demoUser.id,
    },
  });

  console.log('Created sample project');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

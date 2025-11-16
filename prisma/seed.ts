import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@nextstep.com' },
    update: {},
    create: {
      email: 'demo@nextstep.com',
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create default contexts
  const defaultContexts = [
    '@Home',
    '@Office',
    '@Computer',
    '@Phone',
    '@Errands',
    '@Anywhere',
  ];

  for (const contextName of defaultContexts) {
    const context = await prisma.context.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name: contextName,
        },
      },
      update: {},
      create: {
        userId: user.id,
        name: contextName,
        isSystem: true,
      },
    });

    console.log('✅ Created context:', context.name);
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

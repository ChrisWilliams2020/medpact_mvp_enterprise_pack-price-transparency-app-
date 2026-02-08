// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a default user (customize as needed)
  const user = await prisma.user.upsert({
    where: { email: 'admin@medpact.com' },
    update: {},
    create: {
      email: 'admin@medpact.com',
      name: 'Admin User',
      // Add any required fields here
    },
  });

  // Create a default project
  const project = await prisma.project.create({
    data: {
      name: 'MedPact MVP Enterprise Pack Price Transparency App',
      slug: 'medpact-mvp-enterprise-pack-price-transparency-app-',
      description: 'Seeded project for deployment',
      ownerId: user.id,
    },
  });

  // Example: Create a survey
  await prisma.survey.create({
    data: {
      title: 'Welcome Survey',
      userId: user.id,
      questions: [
        {
          question: 'How did you hear about us?',
          type: 'text',
        },
        {
          question: 'How satisfied are you with our platform?',
          type: 'rating',
          scale: 5,
        },
      ],
      // Add any other required fields here
    },
  });

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

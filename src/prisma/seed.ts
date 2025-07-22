import { PrismaClient } from '@prisma/client';
import logger from '../lib/logger';

const prisma = new PrismaClient();

async function main() {
  logger.info('🌱 Clearing existing data...');
  // Delete posts first due to FK constraint, then users
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  logger.info('🌱 Seeding users...');
  // Create users
  const users = await prisma.user.createMany({
    data: [
      { email: 'alice@example.com', name: 'Alice Johnson' },
      { email: 'bob@example.com', name: 'Bob Smith' },
      { email: 'charlie@example.com', name: 'Charlie Brown' },
      { email: 'dana@example.com', name: 'Dana White' },
      { email: 'eve@example.com', name: null },
    ],
  });

  // Fetch created users for IDs
  const allUsers = await prisma.user.findMany();
  const [alice, bob, charlie, dana, eve] = allUsers;

  logger.info(
    '✅ Users created:',
    allUsers.map(u => ({ id: u.id, email: u.email, name: u.name }))
  );

  logger.info('🌱 Seeding posts...');
  // Create posts
  const posts = await prisma.post.createMany({
    data: [
      {
        title: 'Getting Started with Node.js',
        content:
          'Node.js is a powerful JavaScript runtime that allows you to build scalable server-side applications...',
        published: true,
        authorId: alice.id,
      },
      {
        title: 'TypeScript Best Practices',
        content:
          'TypeScript adds static typing to JavaScript, making your code more reliable and maintainable...',
        published: true,
        authorId: bob.id,
      },
      {
        title: 'Prisma ORM Tutorial',
        content:
          'Prisma is a modern database toolkit that makes database access easy with an auto-generated query builder...',
        published: false,
        authorId: charlie.id,
      },
      {
        title: 'Express.js Routing Deep Dive',
        content:
          'Learn how to structure your Express.js routes for scalability and maintainability.',
        published: true,
        authorId: dana.id,
      },
      {
        title: 'Unpublished Draft',
        content: null,
        published: false,
        authorId: alice.id,
      },
      {
        title: 'Hello World',
        content: 'This is a hello world post.',
        published: true,
        authorId: eve.id,
      },
    ],
  });

  const allPosts = await prisma.post.findMany();
  logger.info(
    '✅ Posts created:',
    allPosts.map(p => ({
      id: p.id,
      title: p.title,
      published: p.published,
      authorId: p.authorId,
    }))
  );

  logger.info('🎉 Database seeding completed successfully!');
}

main()
  .catch(e => {
    logger.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

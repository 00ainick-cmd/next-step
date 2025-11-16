import { prisma } from './prisma';

/**
 * Helper function to get the demo user ID.
 *
 * TODO: Replace this with actual authentication.
 * In a production app, you would:
 * 1. Use NextAuth.js or similar for authentication
 * 2. Get the user ID from the session/token
 * 3. Validate the user has access to the requested resources
 *
 * For now, we fetch the seeded demo user.
 */
export async function getDemoUserId(): Promise<string> {
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@nextstep.com' },
  });

  if (!demoUser) {
    throw new Error('Demo user not found. Please run: npm run db:seed');
  }

  return demoUser.id;
}

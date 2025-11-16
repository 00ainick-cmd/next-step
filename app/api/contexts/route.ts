import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDemoUserId } from '@/lib/demo-user';

/**
 * GET /api/contexts
 *
 * Retrieves all contexts for the current user.
 *
 * Returns: Array of contexts (JSON)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with actual authentication
    // const userId = await getUserIdFromSession(request);
    const userId = await getDemoUserId();

    const contexts = await prisma.context.findMany({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(contexts);
  } catch (error) {
    console.error('Error fetching contexts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

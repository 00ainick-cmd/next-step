import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDemoUserId } from '@/lib/demo-user';

/**
 * POST /api/tasks
 *
 * Creates a new task in the inbox.
 *
 * Body: { title: string }
 *
 * Returns: The created task (JSON)
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Replace with actual authentication
    // const userId = await getUserIdFromSession(request);
    const userId = await getDemoUserId();

    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        status: 'inbox',
        userId,
      },
      include: {
        project: true,
        contexts: {
          include: {
            context: true,
          },
        },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tasks
 *
 * Retrieves tasks for the current user with optional filtering.
 *
 * Query params:
 *  - status (optional): Filter by task status (e.g., "inbox", "next_action")
 *  - contextId (optional): Filter by context ID
 *
 * Returns: Array of tasks (JSON)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with actual authentication
    // const userId = await getUserIdFromSession(request);
    const userId = await getDemoUserId();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const contextId = searchParams.get('contextId');

    // Build the where clause dynamically
    const where: any = {
      userId,
    };

    if (status) {
      where.status = status;
    }

    if (contextId) {
      where.contexts = {
        some: {
          contextId,
        },
      };
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: true,
        contexts: {
          include: {
            context: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

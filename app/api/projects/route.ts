import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDemoUserId } from '@/lib/demo-user';

/**
 * GET /api/projects
 *
 * Retrieves all projects for the current user.
 *
 * Returns: Array of projects (JSON)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with actual authentication
    // const userId = await getUserIdFromSession(request);
    const userId = await getDemoUserId();

    const projects = await prisma.project.findMany({
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
        createdAt: 'desc',
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 *
 * Creates a new project.
 *
 * Body: { name: string }
 *
 * Returns: The created project (JSON)
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Replace with actual authentication
    // const userId = await getUserIdFromSession(request);
    const userId = await getDemoUserId();

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        status: 'active',
        userId,
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

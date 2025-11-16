import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDemoUserId } from '@/lib/demo-user';

/**
 * PATCH /api/tasks/[id]
 *
 * Updates a task with the provided fields.
 *
 * Body can include:
 *  - title: string
 *  - description: string
 *  - status: string
 *  - projectId: string | null
 *  - dueDate: string (ISO date) | null
 *  - scheduledStart: string (ISO date) | null
 *  - scheduledEnd: string (ISO date) | null
 *  - energyLevel: string | null
 *  - timeNeededMinutes: number | null
 *  - contextIds: string[] (replaces existing contexts)
 *
 * Returns: The updated task (JSON)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Replace with actual authentication
    // const userId = await getUserIdFromSession(request);
    const userId = await getDemoUserId();

    const { id } = params;
    const body = await request.json();

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    if (existingTask.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Extract updatable fields
    const {
      title,
      description,
      status,
      projectId,
      dueDate,
      scheduledStart,
      scheduledEnd,
      energyLevel,
      timeNeededMinutes,
      contextIds,
    } = body;

    // Build update data
    const updateData: any = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return NextResponse.json(
          { error: 'Title must be a non-empty string' },
          { status: 400 }
        );
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (projectId !== undefined) {
      updateData.projectId = projectId;
    }

    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }

    if (scheduledStart !== undefined) {
      updateData.scheduledStart = scheduledStart ? new Date(scheduledStart) : null;
    }

    if (scheduledEnd !== undefined) {
      updateData.scheduledEnd = scheduledEnd ? new Date(scheduledEnd) : null;
    }

    if (energyLevel !== undefined) {
      updateData.energyLevel = energyLevel;
    }

    if (timeNeededMinutes !== undefined) {
      updateData.timeNeededMinutes = timeNeededMinutes;
    }

    // If contextIds is provided, update the task-context relationships
    if (contextIds !== undefined) {
      if (!Array.isArray(contextIds)) {
        return NextResponse.json(
          { error: 'contextIds must be an array' },
          { status: 400 }
        );
      }

      // Delete existing contexts and create new ones in a transaction
      await prisma.$transaction([
        // Remove all existing context associations
        prisma.taskContext.deleteMany({
          where: { taskId: id },
        }),
        // Create new context associations
        ...(contextIds.length > 0
          ? [
              prisma.taskContext.createMany({
                data: contextIds.map((contextId: string) => ({
                  taskId: id,
                  contextId,
                })),
              }),
            ]
          : []),
      ]);
    }

    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: true,
        contexts: {
          include: {
            context: true,
          },
        },
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UpdateTaskRequest } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const task = db.tasks.getById(params.id);

  if (!task) {
    return NextResponse.json(
      { error: 'Task not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(task);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateTaskRequest = await request.json();

    // If contextIds are provided, convert to Context objects
    let updatedData: any = { ...body };
    if (body.contextIds) {
      updatedData.contexts = db.contexts.getByIds(body.contextIds);
      delete updatedData.contextIds;
    }

    const updatedTask = db.tasks.update(params.id, updatedData);

    if (!updatedTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const success = db.tasks.delete(params.id);

  if (!success) {
    return NextResponse.json(
      { error: 'Task not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}

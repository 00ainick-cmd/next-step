import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CreateTaskDTO } from '@/types';

export async function GET() {
  const tasks = db.tasks.findAll();
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateTaskDTO = await request.json();

    const task = db.tasks.create({
      title: data.title,
      status: data.status || 'inbox',
      projectId: data.projectId,
      contextIds: data.contextIds,
      dueDate: data.dueDate,
      scheduledStart: data.scheduledStart,
      scheduledEnd: data.scheduledEnd,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

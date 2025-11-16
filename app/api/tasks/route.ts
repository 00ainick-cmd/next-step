import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CreateTaskRequest } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');

  const tasks = db.tasks.getAll(status || undefined);
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTaskRequest = await request.json();

    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const newTask = db.tasks.create({ title: body.title.trim() });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

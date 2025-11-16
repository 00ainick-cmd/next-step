import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CreateProjectDTO } from '@/types';

export async function GET() {
  const projects = db.projects.findAll();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateProjectDTO = await request.json();

    const project = db.projects.create({
      name: data.name,
      description: data.description,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

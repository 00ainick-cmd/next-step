import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CreateContextDTO } from '@/types';

export async function GET() {
  const contexts = db.contexts.findAll();
  return NextResponse.json(contexts);
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateContextDTO = await request.json();

    const context = db.contexts.create({
      name: data.name,
      icon: data.icon,
    });

    return NextResponse.json(context, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create context' },
      { status: 500 }
    );
  }
}

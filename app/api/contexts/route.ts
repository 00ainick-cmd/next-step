import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const contexts = db.contexts.getAll();
  return NextResponse.json(contexts);
}

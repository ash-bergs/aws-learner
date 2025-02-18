import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId)
    return NextResponse.json({ error: 'UserId is required' }, { status: 400 });

  try {
    const tags = await prisma.tag.findMany({
      where: { userId },
      // include: { tasks: true }, // do we want this?
      // order alphabetically
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, color, userId } = body;
  if (!name || !userId)
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  try {
    const existingTags = await prisma.tag.findFirst({
      where: { name, userId },
    });

    if (existingTags)
      return NextResponse.json(
        { error: 'Tag already exists' },
        { status: 400 }
      );

    const newTag = await prisma.tag.create({
      data: {
        name,
        color,
        userId,
      },
    });

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error('Failed to add tag:', error);
    return NextResponse.json({ error: 'Failed to add tag' }, { status: 500 });
  }
}

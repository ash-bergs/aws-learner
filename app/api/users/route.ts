import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// GET: Fetch all users
export async function GET() {
  const users = await prisma.user.findMany();
  console.log('USERS: ', users);
  return NextResponse.json(users);
}

// POST: Add a new user
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, email, firstName, lastName, password, settings } = body;

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Username and password are required.' },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      firstName,
      lastName,
      password: hashedPassword,
      settings,
    },
  });

  return NextResponse.json(newUser, { status: 201 });
}

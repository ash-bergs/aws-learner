import { NextResponse } from 'next/server';
import { db, User } from '@/lib/db';
import bcrypt from 'bcryptjs';

export function validatePassword(password: string): boolean {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}$/;
  return regex.test(password);
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const existingUser = await db.users.get({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists.' },
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        {
          message:
            'Password must be at least 6 characters long and contain at least one number, one special character, and one letter.',
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      theme: `default`,
    };

    await db.users.add(newUser);

    return NextResponse.json(
      { message: 'User created successfully.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Error creating user.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { db, User } from '@/lib/db';
import bcrypt from 'bcryptjs';

/**
 * Checks if a given password is valid according to the following rules:
 * - At least 6 characters long
 * - Contains at least one number
 * - Contains at least one special character (!, @, #, $, %, ^, &, *)
 * - Contains at least one letter
 * @param {string} password The password to be validated
 * @returns {boolean} True if the password is valid, false otherwise
 */
function validatePassword(password: string): boolean {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}$/;
  return regex.test(password);
}

/**
 * Creates a new user
 * @param {Request} req The request object
 * @returns {Response} The response object
 * @throws {Error} If there is an error creating the user
 */
export async function POST(req: Request) {
  console.log('HITTING REGISTER ENDPOINT');
  try {
    const { email, password, username, firstName, lastName } = await req.json();

    if (!password || !username) {
      return NextResponse.json(
        { message: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const existingUser = await db.users.get({ where: { username } });

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
      username,
      firstName,
      lastName,
      password: hashedPassword,
      settings: {
        theme: `tidePool`,
      },
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

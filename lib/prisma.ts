import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

//TODO: remove if this doesn't work
// force prisma to explicitly load .env.production
// seeing if this is why runtime environment variables are not being set
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
}

export const prisma = new PrismaClient();

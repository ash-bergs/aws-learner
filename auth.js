import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (
          credentials === null ||
          !credentials.username ||
          !credentials.password
        )
          return null;

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          });

          if (!user) throw new Error('Check credentials');

          // check the password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValidPassword) throw new Error('Invalid password.');

          return {
            id: user.id,
            name: user.username ?? user.firstName,
            email: user.email,
          };
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
});

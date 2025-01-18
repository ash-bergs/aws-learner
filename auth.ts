import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'test@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      // Very basic, very vanilla
      // In a more robust solution I would opt for something like bcrypt at the bare minimum
      // But more likely build a flow with Google oauth - as it seems to be pretty standard
      authorize: async (credentials) => {
        const { email, password } = credentials || {};

        if (email === 'test@example.com' && password === 'password') {
          return { id: '1', name: 'John Doe', email: 'test@example.com' };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
});

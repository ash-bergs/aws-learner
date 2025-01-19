'use server';
import { signIn, signOut } from '@/auth';

export async function doCredentialLogin(formData: FormData) {
  const username = formData.get('username');
  const password = formData.get('password');

  if (!username || !password) {
    return {
      error: 'Please provide valid credentials',
    };
  }

  const res = await signIn('credentials', {
    username: formData.get('username'),
    password: formData.get('password'),
    redirect: false,
  });

  if (!res) return null;
  return res;
}

export async function logout() {
  await signOut({ redirectTo: '/login' });
}

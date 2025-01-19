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

  await signIn('credentials', {
    username,
    password,
    redirect: false,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
      return {
        error: 'Please provide valid credentials',
      };
    });
}

export async function doLogout() {
  await signOut({ redirectTo: '/login' });
}

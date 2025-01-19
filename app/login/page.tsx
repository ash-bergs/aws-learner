'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doCredentialLogin } from '../actions/actions';
import SplitLayout from '../components/layout/SplitLayout';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await doCredentialLogin(formData)
      .then(() => {
        router.push('/dashboard');
      })
      .catch((err) => {
        console.error(err);
        setError('Please provide valid credentials');
      });
  };

  return (
    <SplitLayout imageSrc="/sample-splash.jpg">
      <h2 className="text-3xl font-bold mb-4">Login</h2>
      <form
        className="w-full max-w-md flex flex-col gap-6"
        onSubmit={handleLogin}
      >
        <div>
          <label className="block text-md font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="username"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label className="block text-md font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
          />
        </div>

        <p className="text-sm">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-blue-500">
            Register Now
          </a>
        </p>

        <button
          type="submit"
          className="bg-primary hover:bg-secondary text-white font-bold py-2 px-10 rounded focus:outline-none focus:shadow-outline"
        >
          Login
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </SplitLayout>
  );
}

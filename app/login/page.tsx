'use client';

import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  // set up state for the form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    // Opted to not let next auth handle the redirect, but in a more robust solution I would set this up to be handled in the route
    const res = await signIn('credentials', {
      redirect: false, // we'll need to redirect to video page here
      email,
      password,
    });

    if (res?.ok) {
      router.push('/dashboard'); // Redirect to the protected page
    } else {
      setError('Please provide valid credentials');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="email@email.com"
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login
          </button>
        </form>
        <div>{error && <p>{error}</p>}</div>
      </div>
    </div>
  );
}

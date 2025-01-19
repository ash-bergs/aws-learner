'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doCredentialLogin } from '../actions/actions';

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
    <div className="flex h-screen items-center justify-center">
      <div
        className="image text-text bg-gray-200 flex flex-col items-center justify-center"
        style={{
          height: '100%',
          width: '100%',

          backgroundImage: "url('/sample-splash.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      <div
        className="text-text flex flex-col items-center justify-center p-8"
        style={{ height: '100%', width: '100%' }}
      >
        <h2 className="text-3xl font-bold mb-4">Login</h2>
        <form
          className="w-full max-w-md flex flex-col gap-6"
          onSubmit={handleLogin}
        >
          <div>
            <label
              className="block text-text text-md font-bold mb-2"
              htmlFor="email"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label
              className="block text-text text-md font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <p className="text-sm text-text">
              Don&apos;t have an account?
              <a href="/register" className="text-blue-500">
                {' '}
                Register Now
              </a>
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <button
              type="submit"
              className="bg-primary hover:bg-secondary text-white font-bold py-2 px-10 rounded focus:outline-none focus:shadow-outline w-auto"
            >
              Login
            </button>
          </div>
        </form>
        <div>{error && <p>{error}</p>}</div>
      </div>
    </div>
  );
}

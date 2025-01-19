'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doCredentialLogin } from '../actions/actions';
import SplitLayout from '../components/layout/SplitLayout';
export default function LoginPage() {
  // set up state for the form fields
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const response = await doCredentialLogin(formData);

      if (!!response.error) {
        console.error(response.error);
        setError(response.error.message);
      } else {
        router.push('/dashboard');
      }
    } catch (e) {
      console.error(e);
      setError('Check your Credentials');
    }
  };

  return (
    <SplitLayout imageSrc="/sample-splash.jpg">
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
    </SplitLayout>
  );
}

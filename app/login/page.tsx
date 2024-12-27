'use client';

import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

// TODO: Once we have a real backend, we'll need to bring in the register form/route
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

      {/** This is the login form, we need a new one for registration
       * TODO: connect this to a login route
       */}
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
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <p className="text-sm text-text">
              Don&apos;t have an account?
              <a href="#" className="text-blue-500">
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

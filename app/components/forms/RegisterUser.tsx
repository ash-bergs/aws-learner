'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterUserForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();

    // registration works differently, we need to hit an api route:
    // /api/auth/register
    // future: we'll want to handle `signIn` here? Just auto-sign them in?
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        username,
        firstName,
        lastName,
        settings: null,
      }),
    });

    console.log('RES: ', res);

    if (res?.ok) {
      router.push('/dashboard'); // Redirect to the protected page
    } else {
      setError('Please provide valid credentials');
    }
  };

  return (
    <div
      className="text-text flex flex-col items-center justify-center"
      style={{ border: '4px solid red', height: '100%', width: '100%' }}
    >
      <h2>Sign Up</h2>
      <form onSubmit={handleRegister}>
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
            First Name
          </label>
          <input
            type="firstName"
            id="firstName"
            onChange={(e) => setFirstName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Last Name
          </label>
          <input
            type="lastName"
            id="lastName"
            onChange={(e) => setLastName(e.target.value)}
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

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Username
          </label>
          <input
            type="username"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Register
        </button>
      </form>
      <div>{error && <p>{error}</p>}</div>
    </div>
  );
};

export default RegisterUserForm;

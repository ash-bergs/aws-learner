'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplitLayout from '../layout/SplitLayout';

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

    if (res?.ok) {
      router.push('/login');
    } else {
      setError('Please provide valid credentials');
    }
  };

  return (
    <SplitLayout imageSrc="/sample-splash.jpg">
      <h2 className="text-3xl text-text font-bold mb-4">Sign Up</h2>
      <form
        className="w-full max-w-md flex flex-col gap-2"
        onSubmit={handleRegister}
      >
        <div className="mb-4">
          <label
            className="block text-gray-400 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            required
            type="username"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-400 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            required
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-400 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            required
            type="email"
            id="email"
            placeholder="email@email.com"
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-400 text-sm font-bold mb-2"
            htmlFor="firstName"
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
            className="block text-gray-400 text-sm font-bold mb-2"
            htmlFor="lastName"
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
        <p className="text-sm">
          Already have an account?{' '}
          <a href="/register" className="text-blue-500">
            Login instead
          </a>
        </p>
        <button
          type="submit"
          className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Register
        </button>
      </form>
      <div role="alert" aria-live="polite">
        {error && <p>{error}</p>}
      </div>
    </SplitLayout>
  );
};

export default RegisterUserForm;

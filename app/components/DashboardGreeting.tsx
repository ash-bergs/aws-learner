'use client';

import React, { useEffect, useState, type JSX } from 'react';

// TODO: Enrich with user data

/**
 * A React component that displays a personalized greeting message
 * based on the current time of day.
 *
 * The component uses the `useEffect` hook to determine the current
 * hour and sets a greeting message accordingly. It greets the user
 * with "Good morning", "Good afternoon", or "Good evening" based on
 * the time of day. The message is displayed alongside a bolded name.
 *
 * @returns {JSX.Element} A JSX element containing the greeting message.
 */
const DashboardGreeting = (): JSX.Element => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const time = new Date().getHours();
    const greeting =
      time >= 4 && time < 12
        ? 'Good morning, '
        : time >= 12 && time < 18
        ? 'Good afternoon, '
        : 'Good evening, ';
    setMessage(greeting);
  }, []);

  return (
    <div>
      <p className="text-2xl">
        {message} <span className="font-bold">Ash</span>
      </p>
    </div>
  );
};

export default DashboardGreeting;

'use client';

import React, { useEffect, useState, type JSX } from 'react';
import { useStatStore } from '@/lib/store/stat';

//TODO: Think on the appearance of this section more - design something in Figma

const statContainerStyles =
  'bg-utility rounded p-2 text-xs font-semibold text-text shadow-sm';

/**
 * A component that displays a greeting message to the user, based on the time of day
 * and a couple of statistics about their task completion.
 *
 * @param {{ username: string }} props The username to display in the greeting message
 * @returns {JSX.Element} A JSX element representing the greeting message
 */
const DashboardGreeting = ({ username }: { username: string }): JSX.Element => {
  const [message, setMessage] = useState('');
  const { completedThisWeek, completedToday } = useStatStore();

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
    <div className="flex flex-col gap-2 w-[100%]">
      <p className="text-2xl">
        {message} <span className="font-bold">{username}</span>
      </p>
      <div className="flex gap-4 p-2">
        <div className={statContainerStyles}>
          <p>Completed Today</p>
          <div className="flex justify-center p-1">
            <p className="text-lg">{completedToday}</p>
          </div>
        </div>
        <div className={statContainerStyles}>
          <p>Completed this Week</p>
          <div className="flex justify-center p-1">
            <p className="text-lg">{completedThisWeek}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGreeting;

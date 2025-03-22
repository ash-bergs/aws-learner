"use client";

import React, { useEffect, useState, type JSX } from "react";

//TODO: Think on the appearance of this section more - design something in Figma
/**
 * A component that displays a greeting message to the user, based on the time of day
 * and a couple of statistics about their task completion.
 *
 * @param {{ username: string }} props The username to display in the greeting message
 * @returns {JSX.Element} A JSX element representing the greeting message
 */
const DashboardGreeting = ({ username }: { username: string }): JSX.Element => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const time = new Date().getHours();
    const greeting =
      time >= 4 && time < 12
        ? "Good morning, "
        : time >= 12 && time < 18
        ? "Good afternoon, "
        : "Good evening, ";
    setMessage(greeting);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xl text-textSecondary">
        {message} <span className="font-bold">{username}</span>
      </p>
    </div>
  );
};

export default DashboardGreeting;

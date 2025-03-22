"use client";

import React from "react";
import { useStatStore } from "@/lib/store/stat";
import { GoGoal } from "react-icons/go";

const DashboardStats = () => {
  const {
    completedThisWeek,
    completedToday,
    dueThisWeek,
    dueToday,
    completedDueThisWeek,
    completedDueToday,
  } = useStatStore();

  return (
    <div className="p-2">
      <h2 className="text-text text-xl font-bold mb-2">
        <GoGoal size={20} aria-hidden="true" className="inline-block mr-2" />
        Objectives
      </h2>
      <div className="flex flex-col md:flex-row gap-2 md:gap-4">
        <div className="w-full">
          <h3
            id="completed-objectives"
            className="text-text text-lg font-medium mb-1"
          >
            Completed
          </h3>
          <ul
            aria-labelledby="completed-objectives"
            className="grid grid-cols-2 gap-4 w-full"
          >
            <StatItem
              label="Today"
              value={completedToday}
              ariaLabel={`${completedToday} tasks completed today`}
            />
            <StatItem
              label="This Week"
              value={completedThisWeek}
              ariaLabel={`${completedThisWeek} tasks completed this week`}
            />
          </ul>
        </div>
        <div className="w-full">
          <h3
            id="due-objectives"
            className="text-text text-lg font-medium mb-1"
          >
            Due
          </h3>
          <ul
            aria-labelledby="due-objectives"
            className="grid grid-cols-2 gap-4 w-full"
          >
            <StatItem
              label="Due Today"
              value={completedDueToday}
              total={dueToday}
              ariaLabel={`${completedDueToday} tasks out of ${dueToday} tasks due today completed`}
              due
            />
            <StatItem
              label="Due this Week"
              ariaLabel={`${completedDueThisWeek} tasks out of ${dueThisWeek} tasks due this week completed`}
              value={completedDueThisWeek}
              total={dueThisWeek}
              due
            />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

interface StatItemProps {
  label: string;
  ariaLabel?: string;
  value: number;
  total?: number;
  due?: boolean;
}

const StatItem = ({ label, ariaLabel, value, total, due }: StatItemProps) => {
  // determine background color based on due status
  const bgColor = due ? "bg-highlight" : "bg-utility";
  return (
    <li
      className={`${bgColor} rounded-sm p-2 text-xs font-semibold text-text shadow-xs`}
    >
      <p>{label}</p>
      <div className="flex justify-center items-center p-1">
        <p className="text-lg" role="status" aria-label={ariaLabel}>
          {value}
        </p>
        {total !== undefined && (
          <>
            <span className="font-light mx-1">/</span>
            <p className="text-lg font-light">{total}</p>
          </>
        )}
      </div>
    </li>
  );
};

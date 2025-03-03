'use client';

import React from 'react';
import { useStatStore } from '@/lib/store/stat';

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
    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
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
      <StatItem
        label="Due Today"
        value={completedDueToday}
        total={dueToday}
        ariaLabel={`${completedDueToday} tasks out of ${dueToday} tasks due today completed`}
      />
      <StatItem
        label="Due this Week"
        ariaLabel={`${completedDueThisWeek} tasks out of ${dueThisWeek} tasks due this week completed`}
        value={completedDueThisWeek}
        total={dueThisWeek}
      />
    </ul>
  );
};

export default DashboardStats;

interface StatItemProps {
  label: string;
  ariaLabel?: string;
  value: number;
  total?: number;
}

const StatItem = ({ label, ariaLabel, value, total }: StatItemProps) => {
  return (
    <li className="bg-utility rounded-sm p-2 text-xs font-semibold text-text shadow-xs">
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

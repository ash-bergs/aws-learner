'use client';

import React from 'react';
import { useStatStore } from '@/lib/store/stat';

const statContainerStyles =
  'bg-utility rounded p-2 text-xs font-semibold text-text shadow-sm';

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
      <div className={statContainerStyles}>
        <p>Today</p>
        <div className="flex justify-center p-1">
          <p className="text-lg">{completedToday}</p>
        </div>
      </div>
      <div className={statContainerStyles}>
        <p>This Week</p>
        <div className="flex justify-center p-1">
          <p className="text-lg">{completedThisWeek}</p>
        </div>
      </div>
      <div className={statContainerStyles}>
        <p>Due Today</p>
        <div className="flex justify-center items-center p-1">
          <p className="text-lg">{completedDueToday}</p>
          <span className="font-light mx-1">/</span>
          <p className="text-lg font-light">{dueToday}</p>
        </div>
      </div>
      <div className={statContainerStyles}>
        <p>Due this Week</p>
        <div className="flex justify-center items-center p-1">
          <p className="text-lg">{completedDueThisWeek}</p>
          <span className="font-light mx-1">/</span>
          <p className="text-lg font-light">{dueThisWeek}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

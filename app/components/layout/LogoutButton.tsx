'use client';

import React from 'react';
import { doLogout } from '@/app/actions/actions';

const LogoutButton = () => {
  return (
    <button
      onClick={() => doLogout()}
      type="submit"
      className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;

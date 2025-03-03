'use client';

import React from 'react';
import { logout } from '@/app/actions/actions';
import { navigationButtonStyles } from '@/lib/style';

const LogoutButton = () => {
  return (
    <button
      onClick={() => logout()}
      type="submit"
      className={navigationButtonStyles}
    >
      Logout
    </button>
  );
};

export default LogoutButton;

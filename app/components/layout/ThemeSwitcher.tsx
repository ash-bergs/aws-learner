'use client';

import React, { type JSX } from 'react';
import { useStore } from '@/lib/store/app';
import { Theme, THEMES, AVAILABLE_THEMES } from '@/lib/core/theme.config';

/**
 * A dropdown menu that allows the user to select a theme for the app.
 *
 * It uses the useStore hook to get the current theme and setTheme function
 * from the app store. The component listens to the value of the theme
 * and updates the app store when the value changes.
 *
 * @returns {JSX.Element} A JSX element representing the theme switcher.
 */
const ThemeSwitcher = (): JSX.Element => {
  const { theme, setTheme } = useStore();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = e.target.value as Theme;
    setTheme(theme);
  };

  return (
    <select
      value={theme}
      onChange={handleThemeChange}
      className="text-gray-900 p-2 rounded"
    >
      {AVAILABLE_THEMES.map((theme) => (
        <option key={theme} value={theme}>
          {THEMES[theme]}
        </option>
      ))}
    </select>
  );
};

export default ThemeSwitcher;

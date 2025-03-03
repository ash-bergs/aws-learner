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
    <div className="relative">
      <select
        name="theme"
        aria-label="Theme Selector"
        id="theme-selector"
        value={theme}
        onChange={handleThemeChange}
        className="text-gray-900 p-2 pr-8 rounded-sm bg-background focus:outline font-semibold text-text focus:outline-highlight appearance-none"
      >
        {AVAILABLE_THEMES.map((theme) => (
          <option key={theme} value={theme}>
            {THEMES[theme]}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-2 text-text flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 text-text"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default ThemeSwitcher;

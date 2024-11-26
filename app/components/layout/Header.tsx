'use client';
import { useStore, Theme } from '@/lib/store/app';

/**
 * A header component that renders a navigation bar with a theme selector and a view selector.
 *
 * It uses the `useStore` hook to access the state of the application, AppState
 *
 * The theme selector allows users to switch between a light and dark theme
 * The view selector allows users to switch between viewing tasks and notes, or both
 *
 * View selector is disabled for now, as the logic is not implemented yet
 *
 * @returns {JSX.Element} The JSX element representing the header.
 */
function Header(): JSX.Element {
  const { theme, setTheme } = useStore(); // Zustand selectors.

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //TODO: type research needed:
    const theme = e.target.value as Theme; // type casting - not sure if this is the best way
    setTheme(theme);
  };

  return (
    <header className="bg-gray-50 dark:bg-gray-800 p-4 px-8 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        HabitNest
      </h1>
      <div className="flex items-center space-x-4">
        {/* Theme Selector */}
        <select
          value={theme}
          onChange={handleThemeChange}
          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          {/* <option value="custom">Custom</option> */}
        </select>

        {/* View Selector */}
        {/* <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded"
        >
          <option value="both">Tasks & Notes</option>
          <option value="tasks">Tasks Only</option>
          <option value="notes">Notes Only</option>
        </select> */}
      </div>
    </header>
  );
}

export default Header;

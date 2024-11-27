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
    <header className="sticky top-0 bg-primary p-4 px-6 shadow-md flex justify-between items-center z-10">
      <h1 className="text-lg font-bold text-text">HabitNest</h1>
      <div className="flex items-center space-x-4">
        {/* Theme Selector */}
        <select
          value={theme}
          onChange={handleThemeChange}
          className="text-gray-900 p-2 rounded"
        >
          <option value="light">Tidepool</option>
          <option value="dark">Orchid</option>
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

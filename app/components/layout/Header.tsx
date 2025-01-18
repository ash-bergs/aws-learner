import ThemeSwitcher from './ThemeSwitcher';

import type { JSX } from "react";

/**
 * The top-level header component, which displays the app title and selectors
 * for the theme and view.
 *
 * The theme selector is a dropdown menu that allows the user to select
 * between different color themes. The view selector is a dropdown menu
 * that allows the user to select between different views: "Tasks & Notes"
 * (the default), "Tasks Only", and "Notes Only".
 *
 * @returns {JSX.Element} The JSX element representing the header.
 */
function Header(): JSX.Element {
  return (
    <header className="sticky top-0 bg-primary p-4 px-6 shadow-md flex justify-between items-center z-10">
      <h1 className="text-lg font-bold text-text">HabitNest</h1>
      <div className="flex items-center space-x-4">
        <ThemeSwitcher />
        {/* TODO: View Selector */}
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

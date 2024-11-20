'use client';

import { useState } from 'react';
import { Task } from '@/lib/db';

/**
 * A component to render a single task.
 *
 * @param {object} props The component props.
 * @param {Task} props.task The task to render.
 * @returns {React.ReactElement} A JSX element representing the task list item.
 */
export const TaskItem = ({ task }: { task: Task }) => {
  const [menuOpen, setMenuOpen] = useState(false); // TODO: move menu to its own component

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <li className="flex items-center justify-between p-4 mb-2 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow">
      <div
        className="flex items-center space-x-4"
        //style={{ border: '2px solid red' }}
      >
        <input
          type="checkbox"
          checked={task.completed}
          className="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring focus:ring-blue-200"
          onChange={() => console.log('Handle completion toggle here')} //TODO: Handle completion toggle
        />
        <span
          className={`text-gray-800 ${
            task.completed ? 'line-through text-gray-500' : ''
          }`}
        >
          {task.text}
        </span>
      </div>

      {/* TODO: Add Category Badge - come up with better groupings for tasks */}
      {/* TODO: Add colors scales to tailwind theme */}
      {/* {task.category && (
        <span
          className={`px-2 py-1 text-sm font-medium rounded-lg ${
            task.category === 'daily'
              ? 'bg-blue-100 text-blue-800'
              : task.category === 'selfcare'
              ? 'bg-pink-100 text-pink-800'
              : task.category === 'home'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {task.category}
        </span>
      )} */}

      <div className="relative">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <ul className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg text-sm z-10">
            <li>
              <button
                //onClick={handleEdit}
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
            </li>
            <li>
              <button
                //onClick={handleDelete}
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                Delete
              </button>
            </li>
          </ul>
        )}
      </div>
    </li>
  );
};

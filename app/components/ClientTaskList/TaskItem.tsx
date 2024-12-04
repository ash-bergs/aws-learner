'use client';

import { useState } from 'react';
import { Task } from '@/lib/db';
import { useTaskStore } from '@/lib/store/task';
import MeatballMenu from '../MeatballMenu';
import { COLORS } from '@/constants';

/**
 * A component to render a single task.
 *
 * @param {object} props The component props.
 * @param {Task} props.task The task to render.
 * @returns {React.ReactElement} A JSX element representing the task list item.
 */
export const TaskItem = ({ task }: { task: Task }): React.ReactElement => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { deleteTask, toggleComplete } = useTaskStore();

  // get the background color for the task from the color col
  const bgColor = task.color
    ? COLORS.find((color) => color.name === task.color)?.class
    : 'bg-note';

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  //TODO: add 'Change color' menu item - figure out how this will work
  const menuItems = [
    {
      label: 'Delete',
      onClick: () => deleteTask(task.id),
    },
  ];

  return (
    <li
      className={`flex items-center justify-between p-4 mb-2 ${bgColor} border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={task.completed}
          className="form-checkbox h-5 w-5 rounded focus:outline focus:outline-primary"
          onChange={() => toggleComplete(task.id)}
        />
        <span
          className={`text-gray-800 ${task.completed ? 'line-through' : ''}`}
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

      <MeatballMenu
        menuOpen={menuOpen}
        toggleMenu={(e: React.MouseEvent) => {
          e.stopPropagation();
          toggleMenu();
        }}
        items={menuItems}
      />
    </li>
  );
};

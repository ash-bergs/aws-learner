'use client';

import { useState } from 'react';
import { Task } from '@/lib/db';
import { useTaskStore } from '@/lib/store/task';
import { useNoteStore } from '@/lib/store/note';
import MeatballMenu from '../../MeatballMenu';
import { COLORS } from '@/utils/constants';
import DueDateModal from './DueDateModal';

/**
 * A component to render a single task.
 *
 * @param {object} props The component props.
 * @param {Task} props.task The task to render.
 * @returns {React.ReactElement} A JSX element representing the task list item.
 */
const TaskItem = ({ task }: { task: Task }): React.ReactElement => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDueDateModalOpen, setIsDueDateModalOpen] = useState(false);
  const { deleteTask, toggleComplete } = useTaskStore();

  const { setSelectedTaskIds, selectedTaskIds, isLinking } = useNoteStore();

  // get the background color for the task from the color col
  const bgColor = task.color
    ? COLORS.find((color) => color.name === task.color)?.class
    : 'bg-note';

  // TODO - better classes - clsx?
  const borderColor =
    isLinking && selectedTaskIds.includes(task.id)
      ? 'border-2 border-highlight'
      : '';

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  //TODO: add 'Change color' menu item - figure out how this will work
  const menuItems = [
    {
      label: 'Due Date',
      onClick: () => {
        setIsDueDateModalOpen(!isDueDateModalOpen);
        setMenuOpen(false);
      },
    },
    {
      label: 'Delete',
      onClick: () => {
        deleteTask(task.id);
        setMenuOpen(false);
      },
    },
  ];

  //TODO: clean up this logic - extract?
  // switcher between using the checkbox during linking
  // if isLinking is true, then the input action should add the taskId to the selectedTaskIds array
  // if isLinking is false, then it should toggleComplete
  const handleCheckboxChange = () => {
    if (isLinking) {
      setSelectedTaskIds(task.id);
    } else {
      toggleComplete(task.id);
    }
  };

  const checked = isLinking
    ? selectedTaskIds.includes(task.id)
    : task.completed;

  return (
    <li
      className={`flex items-center justify-between p-4 mb-2 ${bgColor} ${borderColor} rounded-md shadow-sm hover:shadow-md transition-shadow`}
    >
      <div>
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={checked}
            className="form-checkbox h-5 w-5 rounded focus:outline focus:outline-primary"
            onChange={handleCheckboxChange}
          />
          <span
            className={`text-gray-800 ${task.completed ? 'line-through' : ''}`}
          >
            {task.text}
          </span>
        </div>
        {task.dueDate && (
          <span className="text-gray-500 text-xs ml-2">
            Due: {new Date(task.dueDate).toDateString()}
          </span>
        )}
      </div>
      <MeatballMenu
        menuOpen={menuOpen}
        toggleMenu={(e: React.MouseEvent) => {
          e.stopPropagation();
          toggleMenu();
        }}
        items={menuItems}
      />
      <DueDateModal
        task={task}
        isDueDateModalOpen={isDueDateModalOpen}
        setIsDueDateModalOpen={setIsDueDateModalOpen}
      />
    </li>
  );
};

export default TaskItem;

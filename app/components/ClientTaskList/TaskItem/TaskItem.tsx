'use client';

import { useState } from 'react';
import { COLORS } from '@/utils/constants';
import { useTaskStore } from '@/lib/store/task';
import { useNoteStore } from '@/lib/store/note';
import { useStatStore } from '@/lib/store/stat';
import { useStore } from '@/lib/store/app';
import { useSelectedTaskStore } from '@/lib/store/selected.task';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import DueDateModal from './DueDateModal';
import MeatballMenu from '../../MeatballMenu';
import ToggleCompletionButton from './ToggleCompletionButton';
import type { TaskWithTags } from '@/lib/store/task';

/**
 * A component to render a single task.
 *
 * @param {object} props The component props.
 * @param {Task} props.task The task to render.
 * @returns {React.ReactElement} A JSX element representing the task list item.
 */
const TaskItem = ({ task }: { task: TaskWithTags }): React.ReactElement => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDueDateModalOpen, setIsDueDateModalOpen] = useState(false);
  const { toggleComplete } = useTaskStore();
  const { updateStats } = useStatStore();
  const { selectedTaskIds, setSelectedTaskIds } = useSelectedTaskStore();
  const { isLinking } = useNoteStore();
  const { disableColorCodeTasks } = useStore();

  const taskTagColor = task.taskTags.length > 0 && task.taskTags[0].tag.color;

  const bgColor =
    task.taskTags.length > 0 && !disableColorCodeTasks
      ? COLORS.find((color) => color.name === taskTagColor)?.background
      : 'bg-note';

  // TODO - better classes - clsx?
  const borderColor = selectedTaskIds.includes(task.id)
    ? 'border-2 border-highlight'
    : 'border-2 border-transparent';

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleCompleteTask = (id: string) => {
    toggleComplete(id);
    updateStats();
  };

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
        setIsDeleteModalOpen(!isDeleteModalOpen);
        setMenuOpen(false);
      },
    },
  ];

  const handleCheckboxChange = () => {
    if (isLinking) return setSelectedTaskIds(task.id);
    setSelectedTaskIds(task.id);
  };

  const checked = selectedTaskIds.includes(task.id);

  return (
    <div
      className={`relative flex items-center justify-between p-4 mb-2 ${bgColor} ${borderColor} rounded-md shadow-sm hover:shadow-md transition-shadow gap-2`}
      role="group"
      aria-labelledby={`task-label-${task.id}`}
      aria-describedby={task.dueDate ? `task-due-${task.id}` : undefined}
    >
      <div>
        {/* <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            id={`task-${task.id}`}
            name={`task-${task.id}`}
            aria-label={`${checked ? 'Unselect' : 'Select'} task ${task.text}`}
            checked={checked}
            className="
            appearance-none w-5 h-5 shrink-0 border-2 border-gray-400 rounded
            flex items-center justify-center text-white
            focus:outline focus:outline-2 focus:outline-highlight
            checked:bg-highlight checked:border-transparent
            relative
            before:content-['✓'] before:absolute before:inset-0 before:flex before:items-center before:justify-center before:text-white before:font-bold before:text-lg before:opacity-0 checked:before:opacity-100
            "
            onChange={handleCheckboxChange}
          />
          <span
            id={`task-label-${task.id}`}
            className={`text-gray-800 ${
              task.completed ? 'line-through italic' : ''
            }`}
          >
            {task.text}
          </span>
        </div> */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id={`task-${task.id}`}
            name={`task-${task.id}`}
            aria-label={`${checked ? 'Unselect' : 'Select'} task ${task.text}`}
            checked={checked}
            onChange={handleCheckboxChange}
            className="
              relative appearance-none w-6 h-6 shrink-0 border-2 border-secondary rounded-md 
              flex items-center justify-center 
              focus:outline focus:outline-2 focus:outline-highlight
              checked:bg-highlight checked:border-highlight 
            "
          />
          <span
            className={`text-gray-900 ${
              task.completed && 'line-through italic'
            }`}
          >
            {task.text}
          </span>

          {/* Checkmark inside the checkbox */}
          {checked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute w-6 h-6 text-white pointer-events-none"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </label>

        {task.dueDate && (
          <span
            id={`task-due-${task.id}`}
            className="text-gray-500 text-xs ml-2"
          >
            Due: {new Date(task.dueDate).toDateString()}
          </span>
        )}
      </div>
      <div className="flex items-center">
        <ToggleCompletionButton
          isCompleted={task.completed}
          onToggle={() => toggleCompleteTask(task.id)}
          ariaLabel={`Mark task ${task.text} as ${
            task.completed ? 'incomplete' : 'complete'
          }`}
        />
        <MeatballMenu
          menuOpen={menuOpen}
          toggleMenu={(e: React.MouseEvent) => {
            e.stopPropagation();
            toggleMenu();
          }}
          items={menuItems}
        />
      </div>
      <DueDateModal
        task={task}
        isDueDateModalOpen={isDueDateModalOpen}
        setIsDueDateModalOpen={setIsDueDateModalOpen}
      />
      <DeleteConfirmationModal
        task={task}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
      />
    </div>
  );
};

export default TaskItem;

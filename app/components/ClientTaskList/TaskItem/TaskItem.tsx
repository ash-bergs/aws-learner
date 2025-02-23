'use client';

import { useState } from 'react';
import { COLORS } from '@/utils/constants';
import { useTaskStore } from '@/lib/store/task';
import { useNoteStore } from '@/lib/store/note';
import { useStatStore } from '@/lib/store/stat';
import { useStore } from '@/lib/store/app';
import { useSelectedTaskStore } from '@/lib/store/selected.task';
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
  const [isDueDateModalOpen, setIsDueDateModalOpen] = useState(false);
  const { deleteTask, toggleComplete } = useTaskStore();
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
    : '';

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
        deleteTask(task.id);
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
      className={`relative flex items-center justify-between p-4 mb-2 ${bgColor} ${borderColor} rounded-md shadow-sm hover:shadow-md transition-shadow`}
    >
      <div>
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            id={`task-${task.id}`}
            name={`task-${task.id}`}
            aria-label="Mark task as complete"
            checked={checked}
            className="form-checkbox h-5 w-5 rounded focus:outline focus:outline-highlight"
            onChange={handleCheckboxChange}
          />
          <span
            className={`text-gray-800 ${
              task.completed ? 'line-through italic' : ''
            }`}
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
      <div className="flex items-center">
        <ToggleCompletionButton
          isCompleted={task.completed}
          onToggle={() => toggleCompleteTask(task.id)}
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
    </div>
  );
};

export default TaskItem;

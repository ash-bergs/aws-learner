'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskItem from './TaskItem/TaskItem';
import type { TaskWithTags } from '@/lib/store/task';
// SEE DOCS: https://docs.dndkit.com/presets/sortable

/**
 * A component that renders a single, sortable task list item.
 * Rendered in the DndContext in ClientTaskList.
 *
 * @param {{ task: Task }} props The component props.
 * @param {Task} props.task The task to render.
 * @returns {React.ReactElement} A JSX element representing the sortable task list item.
 */
const SortableTaskItem = ({
  task,
}: {
  task: TaskWithTags;
}): React.ReactElement => {
  // useSortable provides utils to make the elements sortable
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id, // unique identifier for the sortable item
    });

  const style = {
    transform: CSS.Transform.toString(transform), // applies position changes when the item is dragged
    transition, // smooths movements
  };

  // ref={setNodeRef} - fn to connect this element to dnd-kit system, a ref to DOM element to become droppable
  // style={style} - drag and transition styles
  // {...attributes} - ARIA attributes
  // {...listeners} - attach mouse and touch event handlers
  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskItem task={task} />
    </li>
  );
};

export default SortableTaskItem;

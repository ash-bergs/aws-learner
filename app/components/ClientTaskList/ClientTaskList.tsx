'use client';

import React, { useEffect } from 'react';
import { useTaskStore } from '@/lib/store/task';
import { TaskItem } from './TaskItem';

/**
 * A component that renders a list of tasks.
 *
 * It utilizes the `useTaskStore` hook to access and fetch tasks from the store.
 * On component mount, it triggers the `fetchTasks` function to load tasks.
 * Each task is rendered as a `TaskItem` within an unordered list.
 *
 * @returns {React.ReactElement} A JSX element representing the list of tasks.
 */
const ClientTaskList = (): React.ReactElement => {
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
};

export default ClientTaskList;

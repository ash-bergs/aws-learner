'use client';

import React, { useEffect } from 'react';
import { useTaskStore } from '@/lib/store/task';

const ClientTaskList = () => {
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.text} - {task.completed ? '✅' : '❌'}
        </li>
      ))}
    </ul>
  );
};

export default ClientTaskList;

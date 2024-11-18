'use client';

import React, { useEffect, useState } from 'react';
import { db, Task } from '@/lib/db';

const ClientTaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const allTasks = await db.tasks.toArray();
      setTasks(allTasks);
    };

    fetchTasks();
  }, []);

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

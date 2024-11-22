'use client';

import { useState } from 'react';
import { Task } from '@/lib/db';
import { useTaskStore } from '@/lib/store/task';

/**
 * A component that renders a text input and an "Add" button.
 *
 * When the button is clicked, it adds a new task to the store with the text
 * entered in the input and clears the input.
 *
 * @returns {React.ReactElement} The JSX element representing the component.
 */
const AddTasks = () => {
  const { addTask } = useTaskStore();
  const [taskText, setTaskText] = useState('');

  const handleAddTask = async () => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: taskText,
      completed: false,
      dateAdded: new Date(),
      dateUpdated: new Date(),
    };

    await addTask(newTask);
    setTaskText('');
    document.getElementById('task')?.focus();
  };

  return (
    <div className="flex items-center border rounded-full px-4 py-2 bg-gray-100 space-x-2">
      <input
        id="task"
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        className="flex-grow bg-transparent outline-none placeholder-gray-500"
        placeholder="Add a task..."
      />
      <button onClick={handleAddTask}>Add</button>
    </div>
  );
};

export default AddTasks;

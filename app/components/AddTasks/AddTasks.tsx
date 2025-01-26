'use client';

import React, { useState } from 'react';
import { useTaskStore } from '@/lib/store/task';

import ColorSelector from './ColorSelector';
import TagSelector from './TagSelector';

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
  const [taskColor, setTaskColor] = useState('green');
  const [taskTag, setTaskTag] = useState('');

  const handleAddTask = async () => {
    await addTask(taskText, taskColor, taskTag);
    setTaskText('');
    document.getElementById('task')?.focus();
  };

  // TODO: why doesn't this reset task color?
  const handleClearTaskInput = () => {
    setTaskText('');
    setTaskColor('green');
    setTaskTag('');
    document.getElementById('task')?.focus();
  };

  return (
    <>
      <div className="flex items-center border rounded-full px-4 py-2 bg-gray-100 gap-1">
        <input
          id="task"
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          className="flex-grow bg-transparent outline-none placeholder-gray-500"
          placeholder="Describe your task..."
        />

        <ColorSelector onColorSelect={(color: string) => setTaskColor(color)} />
        <TagSelector
          selectedTag={taskTag}
          onTagSelect={(tag: string) => setTaskTag(tag)}
        />
      </div>
      <div className="flex gap-2">
        <button
          className="w-full text-center font-bold py-2 px-4 rounded-md
        bg-primary hover:bg-secondary text-white"
          onClick={handleAddTask}
        >
          Add Task
        </button>
        {/** TODO: create an alternate color for cancel/clear buttons */}
        <button
          className="w-full text-center font-bold py-2 px-4 rounded-md
        bg-highlight hover:bg-secondary text-white"
          onClick={handleClearTaskInput}
        >
          Clear
        </button>
      </div>
    </>
  );
};

export default AddTasks;

'use client';

import React, { useState, useRef } from 'react';
import { useTaskStore } from '@/lib/store/task';
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
  const [taskTag, setTaskTag] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTask = async () => {
    if (!taskText.trim()) return;
    const taskTags = taskTag === '' ? [] : [taskTag];
    await addTask(taskText, taskTags);
    setTaskText('');
    inputRef.current?.focus();
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAddTask();
  };
  const handleClearTaskInput = () => {
    setTaskText('');
    setTaskTag('');
    inputRef.current?.focus();
  };

  return (
    <div>
      <form
        aria-label="Add Task Form"
        className="flex flex-col gap-2"
        onSubmit={handleFormSubmit}
      >
        <div className="flex items-center border rounded-full px-4 py-2 bg-gray-100 gap-1">
          <label htmlFor="task-input" className="sr-only">
            Task Description
          </label>
          <input
            ref={inputRef}
            id="task-input"
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            className="flex-grow rounded bg-transparent focus:outline focus:outline-highlight text-text-secondary"
            placeholder="Describe your task..."
          />
          <TagSelector
            selectedTag={taskTag}
            onTagSelect={(tag: string) => setTaskTag(tag)}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="w-full text-center font-bold py-2 px-4 rounded-md
        bg-primary hover:bg-secondary text-white"
            type="submit"
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
      </form>
    </div>
  );
};

export default AddTasks;
